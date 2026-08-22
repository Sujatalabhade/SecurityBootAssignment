package com.dmart.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponse {
    private Long id;
    private ProductResponse product;
    private int quantity;
    private BigDecimal priceAtOrder;
    private BigDecimal subtotal;
}
