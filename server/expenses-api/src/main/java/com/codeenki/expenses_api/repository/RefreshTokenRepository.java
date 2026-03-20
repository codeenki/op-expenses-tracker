package com.codeenki.expenses_api.repository;

import com.codeenki.expenses_api.entity.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {

    Optional<RefreshTokenEntity> findByToken(String token);

    /**
     * Revoke all tokens in a family.
     * Called when token theft is detected (reuse of a rotated token).
     */
    @Modifying
    @Query("UPDATE RefreshTokenEntity r SET r.revoked = true WHERE r.tokenFamily = :family")
    void revokeAllByTokenFamily(@Param("family") UUID family);

    /**
     * Revoke all tokens for a user.
     * Called on explicit logout.
     */
    @Modifying
    @Query("UPDATE RefreshTokenEntity r SET r.revoked = true WHERE r.user.id = :userId")
    void revokeAllByUserId(@Param("userId") UUID userId);

    /**
     * Clean up expired tokens.
     * Run periodically to keep the table clean.
     */
    @Modifying
    @Query("DELETE FROM RefreshTokenEntity r WHERE r.expiresAt < CURRENT_TIMESTAMP")
    void deleteExpiredTokens();
}
