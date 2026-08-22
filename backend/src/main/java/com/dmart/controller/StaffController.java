package com.dmart.controller;

import com.dmart.dto.request.UpdateOrderStatusRequest;
import com.dmart.dto.response.ApiResponse;
import com.dmart.dto.response.OrderResponse;
import com.dmart.dto.response.PageResponse;
import com.dmart.dto.response.ReturnRequestResponse;
import com.dmart.entity.User;
import com.dmart.service.ReturnService;
import com.dmart.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;
    private final ReturnService returnService;

    public StaffController(StaffService staffService, ReturnService returnService) {
        this.staffService = staffService;
        this.returnService = returnService;
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getPendingOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<OrderResponse> response = staffService.getPendingOrders(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending orders retrieved", response));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @AuthenticationPrincipal User staff,
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse response = staffService.updateOrderStatus(staff.getId(), id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order status updated", response));
    }

    @GetMapping("/pickup")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUpcomingPickups(@RequestParam(required = false) String date) {
        List<OrderResponse> response = staffService.getUpcomingPickups(date);
        return ResponseEntity.ok(new ApiResponse<>(true, "Upcoming pickups retrieved", response));
    }

    @GetMapping("/delivery")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getDeliveryOrders() {
        List<OrderResponse> response = staffService.getDeliveryOrders();
        return ResponseEntity.ok(new ApiResponse<>(true, "Delivery orders retrieved", response));
    }

    @GetMapping("/returns")
    public ResponseEntity<ApiResponse<List<ReturnRequestResponse>>> getPendingReturns() {
        List<ReturnRequestResponse> response = returnService.getPendingRequests();
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending returns retrieved", response));
    }

    @PutMapping("/returns/{id}/process")
    public ResponseEntity<ApiResponse<ReturnRequestResponse>> processReturn(
            @AuthenticationPrincipal User staff,
            @PathVariable Long id,
            @RequestParam boolean approved,
            @RequestParam(required = false) String notes) {
        ReturnRequestResponse response = returnService.processRequest(staff.getId(), id, approved, notes);
        return ResponseEntity.ok(new ApiResponse<>(true, "Return request processed", response));
    }
}
