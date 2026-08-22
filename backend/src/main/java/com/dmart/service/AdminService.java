package com.dmart.service;

import com.dmart.dto.request.AssignRoleRequest;
import com.dmart.dto.response.AuditLogResponse;
import com.dmart.dto.response.PageResponse;
import com.dmart.dto.response.UserResponse;
import com.dmart.entity.AuditLog;
import com.dmart.entity.User;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.AuditLogRepository;
import com.dmart.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminService(UserRepository userRepository, AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public PageResponse<UserResponse> getAllUsers(int page, int size) {
        Page<User> userPage = userRepository.findAll(PageRequest.of(page, size));
        List<UserResponse> content = userPage.getContent().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(content, userPage.getNumber(), userPage.getSize(), userPage.getTotalElements(), userPage.getTotalPages());
    }

    public UserResponse assignRole(Long adminId, Long userId, AssignRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(request.getRole());
        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    public PageResponse<AuditLogResponse> getAuditLogs(int page, int size) {
        Page<AuditLog> logPage = auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size));
        List<AuditLogResponse> content = logPage.getContent().stream()
                .map(this::mapToAuditLogResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(content, logPage.getNumber(), logPage.getSize(), logPage.getTotalElements(), logPage.getTotalPages());
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .address(user.getAddress())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private AuditLogResponse mapToAuditLogResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .userId(log.getUser() != null ? log.getUser().getId() : null)
                .userEmail(log.getUser() != null ? log.getUser().getEmail() : "Anonymous")
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .details(log.getDetails())
                .ipAddress(log.getIpAddress())
                .timestamp(log.getTimestamp())
                .build();
    }
}
