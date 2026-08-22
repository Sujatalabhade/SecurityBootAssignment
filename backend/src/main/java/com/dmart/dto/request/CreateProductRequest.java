package com.dmart.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateProductRequest {
    @NotNull
    private Long categoryId;
    @NotBlank
    private String name;
    private String description;
    @NotNull
    @Min(0)
    private BigDecimal price;
    @NotNull
    @Min(0)
    private BigDecimal mrp;
    @Min(0)
    private int stockQty;
    @NotBlank
    private String unit;
    private String imageUrl;
}
