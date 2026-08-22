package com.dmart.controller;

import com.dmart.dto.request.UpdateStockRequest;
import com.dmart.dto.response.ApiResponse;
import com.dmart.dto.response.DashboardStats;
import com.dmart.dto.response.PageResponse;
import com.dmart.dto.response.ProductResponse;
import com.dmart.entity.User;
import com.dmart.service.ManagerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping("/inventory")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<ProductResponse> response = managerService.getInventory(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Inventory retrieved", response));
    }

    @PutMapping("/inventory")
    public ResponseEntity<ApiResponse<ProductResponse>> updateStock(
            @AuthenticationPrincipal User manager,
            @Valid @RequestBody UpdateStockRequest request) {
        ProductResponse response = managerService.updateStock(manager.getId(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Stock updated", response));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getSalesStats() {
        DashboardStats stats = managerService.getSalesStats();
        return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard stats retrieved", stats));
    }
}
