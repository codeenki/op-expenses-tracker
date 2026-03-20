package com.codeenki.expenses_api.service;

import com.codeenki.expenses_api.dto.auth.*;
import com.codeenki.expenses_api.entity.RefreshTokenEntity;
import com.codeenki.expenses_api.entity.UserEntity;
import com.codeenki.expenses_api.repository.RefreshTokenRepository;
import com.codeenki.expenses_api.repository.UserRepository;
import com.codeenki.expenses_api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Authentication service.
 * Handles user registration, login, token refresh, and logout.
 *
 * Security measures:
 * - Passwords hashed with BCrypt before storage
 * - Refresh token rotation on every use
 * - Token family tracking for theft detection
 * - All tokens revoked on logout
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    /**
     * Register a new user.
     * Validates email uniqueness, hashes password, creates user,
     * and returns tokens.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        /* Check if email already exists */
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        /* Create user with hashed password */
        UserEntity user = UserEntity.builder()
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .primaryCurrency(
                        request.getPrimaryCurrency() != null
                                ? request.getPrimaryCurrency()
                                : "USD"
                )
                .build();

        user = userRepository.save(user);

        /* Generate tokens */
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = createRefreshToken(user, UUID.randomUUID());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    /**
     * Login an existing user.
     * Validates credentials and returns tokens.
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        /* Find user by email */
        UserEntity user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        /* Verify password */
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        /* Generate tokens */
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = createRefreshToken(user, UUID.randomUUID());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    /**
     * Refresh an access token using a valid refresh token.
     * Implements token rotation: the old refresh token is
     * revoked and a new one is issued.
     *
     * If a revoked token is used (potential theft), ALL tokens
     * in that family are revoked for security.
     */
    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        /* Find the refresh token */
        RefreshTokenEntity tokenEntity = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        /* Check if token was already revoked — potential theft */
        if (tokenEntity.getRevoked()) {
            /*
             * Someone is trying to use a token that was already rotated.
             * This means the token was likely stolen. Revoke ALL tokens
             * in this family to lock out the attacker.
             */
            refreshTokenRepository.revokeAllByTokenFamily(tokenEntity.getTokenFamily());
            throw new IllegalArgumentException("Token reuse detected — all sessions revoked");
        }

        /* Check if token is expired */
        if (tokenEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token expired");
        }

        /* Revoke the current token (rotation) */
        tokenEntity.setRevoked(true);
        refreshTokenRepository.save(tokenEntity);

        /* Issue new tokens in the same family */
        UserEntity user = tokenEntity.getUser();
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String newRefreshToken = createRefreshToken(user, tokenEntity.getTokenFamily());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    /**
     * Logout — revoke all refresh tokens for the user.
     */
    @Transactional
    public void logout(UUID userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }

    /**
     * Creates a refresh token and saves it to the database.
     * The token string is a random UUID — not a JWT.
     * The actual validation happens by looking it up in the database.
     */
    private String createRefreshToken(UserEntity user, UUID tokenFamily) {
        String tokenValue = UUID.randomUUID().toString();

        RefreshTokenEntity refreshToken = RefreshTokenEntity.builder()
                .token(tokenValue)
                .user(user)
                .tokenFamily(tokenFamily)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000))
                .build();

        refreshTokenRepository.save(refreshToken);

        return tokenValue;
    }
}