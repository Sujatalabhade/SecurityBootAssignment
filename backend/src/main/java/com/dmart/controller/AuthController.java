package com.dmart.controller;

import com.dmart.dto.request.LoginRequest;
import com.dmart.dto.request.RegisterRequest;
import com.dmart.dto.response.ApiResponse;
import com.dmart.dto.response.AuthResponse;
import com.dmart.entity.User;
import com.dmart.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.register(request, httpRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.login(request, httpRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Current user retrieved", user));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody com.dmart.dto.request.UpdateProfileRequest request,
            HttpServletRequest httpRequest) {
        User updatedUser = authService.updateProfile(user.getId(), request, httpRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", updatedUser));
    }
}
