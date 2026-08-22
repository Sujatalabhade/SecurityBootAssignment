package com.dmart.entity;

import com.dmart.enums.ReturnStatus;
import com.dmart.enums.ReturnType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "return_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(columnDefinition="TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    private ReturnType type;

    @Enumerated(EnumType.STRING)
    private ReturnStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exchange_product_id")
    private Product exchangeProduct;

    @Column(columnDefinition="TEXT")
    private String staffNotes;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;
}
