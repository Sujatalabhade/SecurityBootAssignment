package com.dmart.repository;

import com.dmart.entity.ReturnRequest;
import com.dmart.enums.ReturnStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    List<ReturnRequest> findByUserId(Long userId);
    List<ReturnRequest> findByStatus(ReturnStatus status);
    Optional<ReturnRequest> findByOrderId(Long orderId);
}
