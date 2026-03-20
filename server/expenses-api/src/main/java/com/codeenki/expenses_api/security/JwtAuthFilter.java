package com.codeenki.expenses_api.security;

import com.codeenki.expenses_api.entity.UserEntity;
import com.codeenki.expenses_api.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

/**
 * JWT Authentication Filter.
 * Runs before every request. Extracts the JWT from the
 * Authorization header, validates it, and sets the user
 * in Spring Security's context so controllers can access it.
 *
 * If no token is present, or it's invalid, the request
 * continues without authentication (Spring Security will
 * block it if the endpoint requires auth).
 */

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        /* Extract token from Authorization header */
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        /* Validate token and extract user ID */
        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        UUID userId = jwtService.extractUserId(token);

        if (userId == null) {
            filterChain.doFilter(request, response);
            return;
        }

        /* Only set auth if not already authenticated in this request */
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            Optional<UserEntity> userOpt = userRepository.findById(userId);

            if (userOpt.isPresent()) {
                UserEntity user = userOpt.get();

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                Collections.emptyList()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
