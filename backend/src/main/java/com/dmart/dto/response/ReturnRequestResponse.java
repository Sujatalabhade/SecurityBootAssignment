package com.dmart.dto.response;

import com.dmart.enums.ReturnStatus;
import com.dmart.enums.ReturnType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReturnRequestResponse {
    private Long id;
    private Long orderId;
    private Long userId;
    private String userName;
    private ProductResponse product;
    private String reason;
    private ReturnType type;
    private ReturnStatus status;
    private ProductResponse exchangeProduct;
    private String staffNotes;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
