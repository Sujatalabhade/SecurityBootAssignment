package com.dmart.controller;

import com.dmart.dto.request.PlaceOrderRequest;
import com.dmart.dto.response.ApiResponse;
import com.dmart.dto.response.OrderResponse;
import com.dmart.entity.User;
import com.dmart.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PlaceOrderRequest request,
            HttpServletRequest httpRequest) {
        OrderResponse response = orderService.placeOrder(user.getId(), request, httpRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order placed successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(@AuthenticationPrincipal User user) {
        List<OrderResponse> response = orderService.getMyOrders(user.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders retrieved", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        OrderResponse response = orderService.getOrderById(user.getId(), id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order retrieved", response));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        OrderResponse response = orderService.cancelOrder(user.getId(), id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order cancelled", response));
    }
}
