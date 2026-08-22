package com.dmart.controller;

import com.dmart.dto.response.ApiResponse;
import com.dmart.dto.response.CategoryResponse;
import com.dmart.dto.response.PageResponse;
import com.dmart.dto.response.ProductResponse;
import com.dmart.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        
        PageResponse<ProductResponse> response = productService.getAll(page, size, categoryId, search);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product retrieved", response));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> response = productService.getAllCategories();
        return ResponseEntity.ok(new ApiResponse<>(true, "Categories retrieved", response));
    }
}
