package com.dmart.controller;

import com.dmart.dto.request.AddToCartRequest;
import com.dmart.dto.response.ApiResponse;
import com.dmart.dto.response.CartItemResponse;
import com.dmart.dto.response.CartResponse;
import com.dmart.entity.User;
import com.dmart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal User user) {
        CartResponse response = cartService.getCart(user.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart retrieved", response));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartItemResponse>> addItem(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddToCartRequest request) {
        CartItemResponse response = cartService.addItem(user.getId(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Item added to cart", response));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<CartItemResponse>> updateQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable Long cartItemId,
            @RequestParam int quantity) {
        CartItemResponse response = cartService.updateQuantity(user.getId(), cartItemId, quantity);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart item updated", response));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> removeItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long cartItemId) {
        cartService.removeItem(user.getId(), cartItemId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Item removed from cart", null));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart cleared", null));
    }
}
