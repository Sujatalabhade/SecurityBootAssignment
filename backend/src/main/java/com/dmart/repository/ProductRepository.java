package com.dmart.repository;

import com.dmart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByActiveTrueAndCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByActiveTrue(Pageable pageable);
}
