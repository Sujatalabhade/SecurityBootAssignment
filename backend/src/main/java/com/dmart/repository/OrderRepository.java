package com.dmart.repository;

import com.dmart.entity.Order;
import com.dmart.enums.DeliveryType;
import com.dmart.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId, Sort sort);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    Page<Order> findByStatusIn(List<OrderStatus> statuses, Pageable pageable);
    List<Order> findByDeliveryTypeAndStatusIn(DeliveryType deliveryType, List<OrderStatus> statuses, Sort sort);
}
