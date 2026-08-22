package com.dmart.dto.request;

import com.dmart.enums.DeliveryType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PlaceOrderRequest {
    @NotNull
    private DeliveryType deliveryType;
    private String deliveryAddress;
    private LocalDateTime scheduledTime;
    private String notes;
}
