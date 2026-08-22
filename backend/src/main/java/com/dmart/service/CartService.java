package com.dmart.service;

import com.dmart.dto.request.AddToCartRequest;
import com.dmart.dto.response.CartItemResponse;
import com.dmart.dto.response.CartResponse;
import com.dmart.entity.CartItem;
import com.dmart.entity.Product;
import com.dmart.entity.User;
import com.dmart.exception.BadRequestException;
import com.dmart.exception.InsufficientStockException;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.CartItemRepository;
import com.dmart.repository.ProductRepository;
import com.dmart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository, UserRepository userRepository, ProductService productService) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    public CartResponse getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        
        List<CartItemResponse> itemResponses = items.stream().map(this::mapToCartItemResponse).collect(Collectors.toList());
        int totalItems = itemResponses.stream().mapToInt(CartItemResponse::getQuantity).sum();
        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .items(itemResponses)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }

    @Transactional
    public CartItemResponse addItem(Long userId, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.isActive()) {
            throw new BadRequestException("Product is not available");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(userId, request.getProductId());
        CartItem cartItem;

        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            int newQty = cartItem.getQuantity() + request.getQuantity();
            if (newQty > product.getStockQty()) {
                throw new InsufficientStockException("Not enough stock available");
            }
            cartItem.setQuantity(newQty);
        } else {
            if (request.getQuantity() > product.getStockQty()) {
                throw new InsufficientStockException("Not enough stock available");
            }
            User user = userRepository.findById(userId).orElseThrow();
            cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
        }

        cartItem = cartItemRepository.save(cartItem);
        return mapToCartItemResponse(cartItem);
    }

    @Transactional
    public CartItemResponse updateQuantity(Long userId, Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new BadRequestException("Not your cart item");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        if (quantity > cartItem.getProduct().getStockQty()) {
            throw new InsufficientStockException("Not enough stock available");
        }

        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.save(cartItem);
        return mapToCartItemResponse(cartItem);
    }

    @Transactional
    public void removeItem(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new BadRequestException("Not your cart item");
        }
        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private CartItemResponse mapToCartItemResponse(CartItem item) {
        BigDecimal subtotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemResponse.builder()
                .id(item.getId())
                .product(productService.mapToProductResponse(item.getProduct()))
                .quantity(item.getQuantity())
                .addedAt(item.getAddedAt())
                .subtotal(subtotal)
                .build();
    }
}
