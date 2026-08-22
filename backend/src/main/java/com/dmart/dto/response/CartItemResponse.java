package com.dmart.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CartItemResponse {
    private Long id;
    private ProductResponse product;
    private int quantity;
    private LocalDateTime addedAt;
    private BigDecimal subtotal;
}
