package com.dmart.service;

import com.dmart.dto.request.ReturnRequestDto;
import com.dmart.dto.response.ReturnRequestResponse;
import com.dmart.entity.*;
import com.dmart.enums.OrderStatus;
import com.dmart.enums.ReturnStatus;
import com.dmart.enums.ReturnType;
import com.dmart.exception.BadRequestException;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.OrderRepository;
import com.dmart.repository.ProductRepository;
import com.dmart.repository.ReturnRequestRepository;
import com.dmart.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReturnService {

    private final ReturnRequestRepository returnRequestRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;
    private final EntityManager entityManager;

    public ReturnService(ReturnRequestRepository returnRequestRepository, OrderRepository orderRepository,
                         ProductRepository productRepository, UserRepository userRepository,
                         ProductService productService, EntityManager entityManager) {
        this.returnRequestRepository = returnRequestRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productService = productService;
        this.entityManager = entityManager;
    }

    @Transactional
    public ReturnRequestResponse createRequest(Long userId, ReturnRequestDto request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to order");
        }
        
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("Only delivered orders can be returned/exchanged");
        }

        if (order.getUpdatedAt().plusDays(7).isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Return period of 7 days has expired");
        }

        boolean productInOrder = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getId().equals(request.getProductId()));
        if (!productInOrder) {
            throw new BadRequestException("Product not found in this order");
        }

        Product product = productRepository.findById(request.getProductId()).orElseThrow();
        Product exchangeProduct = null;
        if (request.getType() == ReturnType.EXCHANGE) {
            if (request.getExchangeProductId() == null) {
                throw new BadRequestException("Exchange product ID is required for exchange");
            }
            exchangeProduct = productRepository.findById(request.getExchangeProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exchange product not found"));
            
            if (exchangeProduct.getStockQty() < 1) {
                throw new BadRequestException("Exchange product is out of stock");
            }
        }

        User user = userRepository.findById(userId).orElseThrow();

        ReturnRequest returnReq = ReturnRequest.builder()
                .order(order)
                .user(user)
                .product(product)
                .reason(request.getReason())
                .type(request.getType())
                .status(ReturnStatus.PENDING)
                .exchangeProduct(exchangeProduct)
                .build();

        returnReq = returnRequestRepository.save(returnReq);
        return mapToReturnRequestResponse(returnReq);
    }

    public List<ReturnRequestResponse> getMyRequests(Long userId) {
        return returnRequestRepository.findByUserId(userId).stream()
                .map(this::mapToReturnRequestResponse)
                .collect(Collectors.toList());
    }

    public List<ReturnRequestResponse> getPendingRequests() {
        return returnRequestRepository.findByStatus(ReturnStatus.PENDING).stream()
                .map(this::mapToReturnRequestResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReturnRequestResponse processRequest(Long staffUserId, Long requestId, boolean approved, String staffNotes) {
        ReturnRequest req = returnRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found"));

        if (req.getStatus() != ReturnStatus.PENDING) {
            throw new BadRequestException("Request is already processed");
        }

        User staff = userRepository.findById(staffUserId).orElseThrow();
        req.setStaffNotes(staffNotes);
        req.setResolvedAt(LocalDateTime.now());
        req.setResolvedBy(staff);

        if (!approved) {
            req.setStatus(ReturnStatus.REJECTED);
        } else {
            req.setStatus(ReturnStatus.APPROVED);
            
            // Note: Simplistic single-item return logic
            // In a real system, we'd know how many items were returned, here assuming 1
            Product originalProd = entityManager.find(Product.class, req.getProduct().getId(), LockModeType.PESSIMISTIC_WRITE);
            originalProd.setStockQty(originalProd.getStockQty() + 1);
            entityManager.merge(originalProd);

            if (req.getType() == ReturnType.EXCHANGE) {
                Product exchangeProd = entityManager.find(Product.class, req.getExchangeProduct().getId(), LockModeType.PESSIMISTIC_WRITE);
                if (exchangeProd.getStockQty() < 1) {
                    throw new BadRequestException("Exchange product out of stock now. Rejecting request.");
                }
                exchangeProd.setStockQty(exchangeProd.getStockQty() - 1);
                entityManager.merge(exchangeProd);
            } else {
                Order order = req.getOrder();
                order.setStatus(OrderStatus.RETURNED);
                orderRepository.save(order);
            }
        }

        req = returnRequestRepository.save(req);
        return mapToReturnRequestResponse(req);
    }

    private ReturnRequestResponse mapToReturnRequestResponse(ReturnRequest req) {
        return ReturnRequestResponse.builder()
                .id(req.getId())
                .orderId(req.getOrder().getId())
                .userId(req.getUser().getId())
                .userName(req.getUser().getName())
                .product(productService.mapToProductResponse(req.getProduct()))
                .reason(req.getReason())
                .type(req.getType())
                .status(req.getStatus())
                .exchangeProduct(req.getExchangeProduct() != null ? productService.mapToProductResponse(req.getExchangeProduct()) : null)
                .staffNotes(req.getStaffNotes())
                .createdAt(req.getCreatedAt())
                .resolvedAt(req.getResolvedAt())
                .build();
    }
}
