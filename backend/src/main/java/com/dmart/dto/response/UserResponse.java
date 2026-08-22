package com.dmart.dto.response;

import com.dmart.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String address;
    private boolean active;
    private LocalDateTime createdAt;
}
