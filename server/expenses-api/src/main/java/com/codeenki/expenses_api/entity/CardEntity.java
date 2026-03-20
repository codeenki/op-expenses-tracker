package com.codeenki.expenses_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cards")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardNetwork network;

    @Column(nullable = false)
    private String bank;

    @Column(name = "last_four_digits", nullable = false, length = 4)
    private String lastFourDigits;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "associated_account_id")
    private AccountEntity associatedAccount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AccountEntity.EntityStatus status = AccountEntity.EntityStatus.ACTIVE;

    @Column(name = "credit_limit")
    private Long creditLimit;

    @Column(name = "current_balance", nullable = false)
    @Builder.Default
    private Long currentBalance = 0L;

    @Column(name = "statement_closing_date")
    private LocalDate statementClosingDate;

    @Column(name = "payment_due_date")
    private LocalDate paymentDueDate;

    @Column(name = "include_in_global_balance", nullable = false)
    @Builder.Default
    private Boolean includeInGlobalBalance = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CardType {
        CREDIT, DEBIT
    }

    public enum CardNetwork {
        VISA, MASTERCARD, AMEX, OTHER
    }
}
