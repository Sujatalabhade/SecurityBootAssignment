package com.dmart.controller;

import com.dmart.dto.request.AssignRoleRequest;
import com.dmart.dto.request.CreateProductRequest;
import com.dmart.dto.response.ApiResponse;
import com.dmart.dto.response.AuditLogResponse;
import com.dmart.dto.response.PageResponse;
import com.dmart.dto.response.ProductResponse;
import com.dmart.dto.response.UserResponse;
import com.dmart.entity.User;
import com.dmart.service.AdminService;
import com.dmart.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;

    public AdminController(AdminService adminService, ProductService productService) {
        this.adminService = adminService;
        this.productService = productService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<UserResponse> response = adminService.getAllUsers(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Users retrieved", response));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> assignRole(
            @AuthenticationPrincipal User admin,
            @PathVariable Long id,
            @Valid @RequestBody AssignRoleRequest request) {
        UserResponse response = adminService.assignRole(admin.getId(), id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Role assigned", response));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<PageResponse<AuditLogResponse>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<AuditLogResponse> response = adminService.getAuditLogs(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Audit logs retrieved", response));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @AuthenticationPrincipal User admin,
            @Valid @RequestBody CreateProductRequest request) {
        ProductResponse response = productService.createProduct(request, admin);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product created", response));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @AuthenticationPrincipal User admin,
            @PathVariable Long id,
            @Valid @RequestBody CreateProductRequest request) {
        ProductResponse response = productService.updateProduct(id, request, admin);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product updated", response));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @AuthenticationPrincipal User admin,
            @PathVariable Long id) {
        productService.deleteProduct(id, admin);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted", null));
    }
}
