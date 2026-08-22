package com.dmart.service;

import com.dmart.dto.request.PlaceOrderRequest;
import com.dmart.dto.response.OrderItemResponse;
import com.dmart.dto.response.OrderResponse;
import com.dmart.entity.*;
import com.dmart.enums.OrderStatus;
import com.dmart.exception.BadRequestException;
import com.dmart.exception.InsufficientStockException;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AuditLogService auditLogService;
    private final ProductService productService;
    private final InventoryLogRepository inventoryLogRepository;
    private final EntityManager entityManager;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartItemRepository,
                        UserRepository userRepository, ProductRepository productRepository,
                        AuditLogService auditLogService, ProductService productService,
                        InventoryLogRepository inventoryLogRepository, EntityManager entityManager) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.auditLogService = auditLogService;
        this.productService = productService;
        this.inventoryLogRepository = inventoryLogRepository;
        this.entityManager = entityManager;
    }

    @Transactional
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId).orElseThrow();
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .deliveryType(request.getDeliveryType())
                .scheduledTime(request.getScheduledTime())
                .deliveryAddress(request.getDeliveryAddress())
                .notes(request.getNotes())
                .discount(BigDecimal.ZERO)
                .build();
        
        for (CartItem ci : cartItems) {
            Product product = entityManager.find(Product.class, ci.getProduct().getId(), LockModeType.PESSIMISTIC_WRITE);
            if (product.getStockQty() < ci.getQuantity()) {
                throw new InsufficientStockException("Insufficient stock for product: " + product.getName());
            }

            product.setStockQty(product.getStockQty() - ci.getQuantity());
            entityManager.merge(product);
            
            BigDecimal price = product.getPrice();
            BigDecimal itemSubtotal = price.multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(ci.getQuantity())
                    .priceAtOrder(price)
                    .build();
            orderItems.add(orderItem);
        }

        order.setSubtotal(subtotal);
        order.setFinalAmount(subtotal); // discount logic can be added later
        order.setItems(orderItems);

        order = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            InventoryLog log = InventoryLog.builder()
                    .product(item.getProduct())
                    .changeQty(-item.getQuantity())
                    .type("SALE")
                    .referenceId(order.getId())
                    .notes("Order placed")
                    .build();
            inventoryLogRepository.save(log);
        }

        cartItemRepository.deleteByUserId(userId);
        
        auditLogService.log(userId, "PLACE_ORDER", "Order", order.getId(), "Placed order for amount " + order.getFinalAmount(), httpRequest);

        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getMyOrders(Long userId) {
        return orderRepository.findByUserId(userId, Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to order");
        }
        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to order");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled at this stage");
        }

        order.setStatus(OrderStatus.CANCELLED);

        // restore stock
        for (OrderItem item : order.getItems()) {
            Product product = entityManager.find(Product.class, item.getProduct().getId(), LockModeType.PESSIMISTIC_WRITE);
            product.setStockQty(product.getStockQty() + item.getQuantity());
            entityManager.merge(product);

            InventoryLog log = InventoryLog.builder()
                    .product(product)
                    .changeQty(item.getQuantity())
                    .type("RETURN")
                    .referenceId(order.getId())
                    .notes("Order cancelled")
                    .build();
            inventoryLogRepository.save(log);
        }

        order = orderRepository.save(order);
        return mapToOrderResponse(order);
    }

    public OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream().map(item -> {
            BigDecimal subtotal = item.getPriceAtOrder().multiply(BigDecimal.valueOf(item.getQuantity()));
            return OrderItemResponse.builder()
                    .id(item.getId())
                    .product(productService.mapToProductResponse(item.getProduct()))
                    .quantity(item.getQuantity())
                    .priceAtOrder(item.getPriceAtOrder())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .status(order.getStatus())
                .deliveryType(order.getDeliveryType())
                .scheduledTime(order.getScheduledTime())
                .deliveryAddress(order.getDeliveryAddress())
                .items(itemResponses)
                .subtotal(order.getSubtotal())
                .discount(order.getDiscount())
                .finalAmount(order.getFinalAmount())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
