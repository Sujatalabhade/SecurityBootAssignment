package com.dmart.dto.response;

import com.dmart.enums.DeliveryType;
import com.dmart.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private Long userId;
    private String userName;
    private OrderStatus status;
    private DeliveryType deliveryType;
    private LocalDateTime scheduledTime;
    private String deliveryAddress;
    private List<OrderItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal finalAmount;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
