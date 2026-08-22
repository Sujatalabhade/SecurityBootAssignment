package com.dmart.service;

import com.dmart.dto.request.CreateProductRequest;
import com.dmart.dto.response.CategoryResponse;
import com.dmart.dto.response.PageResponse;
import com.dmart.dto.response.ProductResponse;
import com.dmart.entity.Category;
import com.dmart.entity.InventoryLog;
import com.dmart.entity.Product;
import com.dmart.entity.User;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.CategoryRepository;
import com.dmart.repository.InventoryLogRepository;
import com.dmart.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryLogRepository inventoryLogRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, InventoryLogRepository inventoryLogRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.inventoryLogRepository = inventoryLogRepository;
    }

    public PageResponse<ProductResponse> getAll(int page, int size, Long categoryId, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage;

        if (categoryId != null) {
            productPage = productRepository.findByActiveTrueAndCategoryId(categoryId, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            productPage = productRepository.findByActiveTrueAndNameContainingIgnoreCase(search.trim(), pageable);
        } else {
            productPage = productRepository.findByActiveTrue(pageable);
        }

        List<ProductResponse> content = productPage.getContent().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(content, productPage.getNumber(), productPage.getSize(),
                productPage.getTotalElements(), productPage.getTotalPages());
    }

    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (!product.isActive()) {
            throw new ResourceNotFoundException("Product not found");
        }
        return mapToProductResponse(product);
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .filter(Category::isActive)
                .map(c -> CategoryResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .description(c.getDescription())
                        .imageUrl(c.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request, User adminUser) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = Product.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .mrp(request.getMrp())
                .stockQty(request.getStockQty())
                .unit(request.getUnit())
                .imageUrl(request.getImageUrl())
                .active(true)
                .build();

        product = productRepository.save(product);

        if (request.getStockQty() > 0) {
            updateStockLog(product, request.getStockQty(), "RESTOCK", null, "Initial stock");
        }

        return mapToProductResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, CreateProductRequest request, User adminUser) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        product.setCategory(category);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setMrp(request.getMrp());
        
        int diff = request.getStockQty() - product.getStockQty();
        if (diff != 0) {
            product.setStockQty(request.getStockQty());
            updateStockLog(product, diff, "ADJUSTMENT", null, "Stock updated by admin");
        }

        product.setUnit(request.getUnit());
        product.setImageUrl(request.getImageUrl());

        product = productRepository.save(product);
        return mapToProductResponse(product);
    }

    @Transactional
    public void deleteProduct(Long id, User adminUser) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
    }

    @Transactional
    public void updateStock(Long productId, int changeQty, String type, Long referenceId, String notes) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setStockQty(product.getStockQty() + changeQty);
        productRepository.save(product);
        updateStockLog(product, changeQty, type, referenceId, notes);
    }

    private void updateStockLog(Product product, int changeQty, String type, Long referenceId, String notes) {
        InventoryLog log = InventoryLog.builder()
                .product(product)
                .changeQty(changeQty)
                .type(type)
                .referenceId(referenceId)
                .notes(notes)
                .build();
        inventoryLogRepository.save(log);
    }

    public ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .mrp(product.getMrp())
                .stockQty(product.getStockQty())
                .unit(product.getUnit())
                .imageUrl(product.getImageUrl())
                .active(product.isActive())
                .build();
    }
}
