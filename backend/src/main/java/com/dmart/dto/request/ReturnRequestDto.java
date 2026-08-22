package com.dmart.dto.request;

import com.dmart.enums.ReturnType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReturnRequestDto {
    @NotNull
    private Long orderId;
    @NotNull
    private Long productId;
    @NotBlank
    private String reason;
    @NotNull
    private ReturnType type;
    private Long exchangeProductId;
}
