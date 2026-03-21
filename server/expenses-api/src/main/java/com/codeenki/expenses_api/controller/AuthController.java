package com.codeenki.expenses_api.controller;

import com.codeenki.expenses_api.dto.auth.*;
import com.codeenki.expenses_api.entity.UserEntity;
import com.codeenki.expenses_api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Authentication controller.
 * All endpoints are under /api/auth/.
 *
 * register, login, refresh — public (no token needed)
 * logout — requires authentication
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register( request );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshRequest request) {
        try {
            AuthResponse response = authService.refresh(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Logout — requires the user to be authenticated.
     * The @AuthenticationPrincipal annotation injects the
     * currently authenticated user from the security context
     * (set by JwtAuthFilter).
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserEntity user) {
        authService.logout(user.getId());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}