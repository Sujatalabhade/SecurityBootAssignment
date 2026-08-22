package com.dmart.dto.request;

import com.dmart.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignRoleRequest {
    @NotNull
    private Role role;
}
