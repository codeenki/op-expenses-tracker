package com.codeenki.expenses_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private String currency;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false)
    private SourceType sourceType;

    @Column(name = "source_id")
    private UUID sourceId;

    @Column(name = "source_name", nullable = false)
    private String sourceName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionCategory category;

    @Builder.Default
    private String tags = "";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Recurrence recurrence = Recurrence.NONE;

    private String notes;

    @Column(name = "transfer_to_id")
    private UUID transferToId;

    @Column(name = "transfer_to_name")
    private String transferToName;

    @Column(name = "attachment_url")
    private String attachmentUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum TransactionType {
        EXPENSE, INCOME, TRANSFER
    }

    public enum SourceType {
        ACCOUNT, CREDIT_CARD, CASH
    }

    public enum TransactionCategory {
        FOOD, TRANSPORT, SHOPPING, BILLS, ENTERTAINMENT,
        HEALTH, EDUCATION, SALARY, FREELANCE,
        INVESTMENT_INCOME, TRANSFER, OTHER
    }

    public enum Recurrence {
        NONE, WEEKLY, BIWEEKLY, MONTHLY
    }

}
