package com.dmart.service;

import com.dmart.dto.request.UpdateStockRequest;
import com.dmart.dto.response.DashboardStats;
import com.dmart.dto.response.PageResponse;
import com.dmart.dto.response.ProductResponse;
import com.dmart.entity.Order;
import com.dmart.entity.Product;
import com.dmart.enums.OrderStatus;
import com.dmart.repository.OrderRepository;
import com.dmart.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManagerService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProductService productService;

    public ManagerService(ProductRepository productRepository, OrderRepository orderRepository, ProductService productService) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.productService = productService;
    }

    public PageResponse<ProductResponse> getInventory(int page, int size) {
        Page<Product> productPage = productRepository.findAll(PageRequest.of(page, size));
        List<ProductResponse> content = productPage.getContent().stream()
                .map(productService::mapToProductResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(content, productPage.getNumber(), productPage.getSize(), productPage.getTotalElements(), productPage.getTotalPages());
    }

    @Transactional
    public ProductResponse updateStock(Long staffId, UpdateStockRequest request) {
        productService.updateStock(request.getProductId(), request.getQuantity(), "RESTOCK", null, request.getNotes());
        Product product = productRepository.findById(request.getProductId()).orElseThrow();
        return productService.mapToProductResponse(product);
    }

    public DashboardStats getSalesStats() {
        List<Order> allOrders = orderRepository.findAll();
        
        long totalOrders = allOrders.size();
        long pendingOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.PENDING).count();
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .map(Order::getFinalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long lowStockCount = productRepository.findAll().stream()
                .filter(p -> p.getStockQty() < 10)
                .count();

        return DashboardStats.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .totalRevenue(totalRevenue)
                .lowStockCount(lowStockCount)
                .build();
    }
}
