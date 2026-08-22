package com.dmart.service;

import com.dmart.dto.request.LoginRequest;
import com.dmart.dto.request.RegisterRequest;
import com.dmart.dto.response.AuthResponse;
import com.dmart.entity.User;
import com.dmart.enums.Role;
import com.dmart.exception.BadRequestException;
import com.dmart.repository.UserRepository;
import com.dmart.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final AuditLogService auditLogService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils, AuthenticationManager authenticationManager,
                       AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already in use.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(Role.CUSTOMER)
                .active(true)
                .build();

        user = userRepository.save(user);

        String token = jwtUtils.generateToken(user);
        
        auditLogService.log(user.getId(), "USER_REGISTER", "User", user.getId(), "User registered", httpRequest);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!user.isActive()) {
            throw new BadRequestException("Account is disabled.");
        }

        String token = jwtUtils.generateToken(user);

        auditLogService.log(user.getId(), "USER_LOGIN", "User", user.getId(), "User logged in", httpRequest);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }

    @Transactional
    public User updateProfile(Long userId, com.dmart.dto.request.UpdateProfileRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.dmart.exception.ResourceNotFoundException("User not found"));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user = userRepository.save(user);
        auditLogService.log(userId, "UPDATE_PROFILE", "User", userId, "Updated profile details", httpRequest);
        return user;
    }
}
