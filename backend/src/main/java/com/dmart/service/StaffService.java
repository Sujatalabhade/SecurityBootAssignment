package com.dmart.service;

import com.dmart.dto.request.UpdateOrderStatusRequest;
import com.dmart.dto.response.OrderResponse;
import com.dmart.dto.response.PageResponse;
import com.dmart.entity.Order;
import com.dmart.enums.DeliveryType;
import com.dmart.enums.OrderStatus;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public StaffService(OrderRepository orderRepository, OrderService orderService) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    public PageResponse<OrderResponse> getPendingOrders(int page, int size) {
        Page<Order> orderPage = orderRepository.findByStatus(OrderStatus.PENDING, PageRequest.of(page, size, Sort.by("createdAt").ascending()));
        List<OrderResponse> content = orderPage.getContent().stream()
                .map(orderService::mapToOrderResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(content, orderPage.getNumber(), orderPage.getSize(), orderPage.getTotalElements(), orderPage.getTotalPages());
    }

    public OrderResponse updateOrderStatus(Long staffId, Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        order.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            order.setNotes(order.getNotes() + "\nStaff note: " + request.getNotes());
        }
        order = orderRepository.save(order);
        return orderService.mapToOrderResponse(order);
    }

    public List<OrderResponse> getUpcomingPickups(String date) {
        List<OrderStatus> statuses = Arrays.asList(OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP);
        return orderRepository.findByDeliveryTypeAndStatusIn(DeliveryType.SCHEDULED_PICKUP, statuses, Sort.by("scheduledTime").ascending())
                .stream().map(orderService::mapToOrderResponse).collect(Collectors.toList());
    }

    public List<OrderResponse> getDeliveryOrders() {
        List<OrderStatus> statuses = Arrays.asList(OrderStatus.READY_FOR_PICKUP, OrderStatus.OUT_FOR_DELIVERY);
        return orderRepository.findByDeliveryTypeAndStatusIn(DeliveryType.HOME_DELIVERY, statuses, Sort.by("createdAt").ascending())
                .stream().map(orderService::mapToOrderResponse).collect(Collectors.toList());
    }
}
