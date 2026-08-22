package com.dmart.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardStats {
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal totalRevenue;
    private long lowStockCount;
}
