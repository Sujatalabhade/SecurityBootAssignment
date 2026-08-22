package com.dmart.controller;

import com.dmart.dto.request.ReturnRequestDto;
import com.dmart.dto.response.ApiResponse;
import com.dmart.dto.response.ReturnRequestResponse;
import com.dmart.entity.User;
import com.dmart.service.ReturnService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/returns")
public class ReturnController {

    private final ReturnService returnService;

    public ReturnController(ReturnService returnService) {
        this.returnService = returnService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReturnRequestResponse>> createRequest(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ReturnRequestDto request) {
        ReturnRequestResponse response = returnService.createRequest(user.getId(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Return request created", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReturnRequestResponse>>> getMyRequests(@AuthenticationPrincipal User user) {
        List<ReturnRequestResponse> response = returnService.getMyRequests(user.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Return requests retrieved", response));
    }
}
