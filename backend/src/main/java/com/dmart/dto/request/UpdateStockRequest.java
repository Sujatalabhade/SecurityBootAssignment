package com.dmart.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStockRequest {
    @NotNull
    private Long productId;
    @NotNull
    private Integer quantity;
    private String notes;
}
