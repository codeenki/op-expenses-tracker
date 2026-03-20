package com.codeenki.expenses_api.repository;

import com.codeenki.expenses_api.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {

    List<TransactionEntity> findByUserIdOrderByTransactionDateDesc(UUID userId);

    List<TransactionEntity> findByUserIdAndSourceId(UUID userId, UUID sourceId);

    /**
     * Find transactions within a date range for a specific user.
     * Used for monthly summaries and chart data.
     */
    @Query("SELECT t FROM TransactionEntity t WHERE t.user.id = :userId " +
            "AND t.transactionDate >= :startDate AND t.transactionDate < :endDate " +
            "ORDER BY t.transactionDate DESC")
    List<TransactionEntity> findByUserIdAndDateRange(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Find transactions by type (expense, income, transfer) for a user.
     */
    List<TransactionEntity> findByUserIdAndTypeOrderByTransactionDateDesc(
            UUID userId, TransactionEntity.TransactionType type);

    /**
     * Find recent transactions limited to a count.
     * Used for the Dashboard's "recent expenses" section.
     */
    List<TransactionEntity> findTop10ByUserIdAndTypeOrderByTransactionDateDesc(
            UUID userId, TransactionEntity.TransactionType type);

    /**
     * Find all cash transactions for a user.
     */
    List<TransactionEntity> findByUserIdAndSourceType(
            UUID userId, TransactionEntity.SourceType sourceType);
}
