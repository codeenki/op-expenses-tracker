package com.codeenki.expenses_api.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table( name = "accounts")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class AccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private String name;

    @Column(name = "bank_institution")
    @Builder.Default
    private String bankInstitution = "";

    @Builder.Default
    private String country = "";

    @Column(nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type;

    @Column(name = "initial_balance", nullable = false)
    private Long initialBalance;

    @Column(nullable = false)
    private Long balance;

    @Column(name = "interest_rate")
    private Double interestRate;

    @Builder.Default
    private String tags = "";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Visibility visibility = Visibility.PRIVATE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EntityStatus status = EntityStatus.ACTIVE;

    /* Cash-specific fields */
    private String location;

    @Column(name = "include_in_global_balance", nullable = false)
    @Builder.Default
    private Boolean includeInGlobalBalance = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum AccountType {
        CHECKING, SAVINGS, INVESTMENT, ENTERPRISE, CASH
    }

    public enum Visibility {
        PRIVATE, SHARED, PUBLIC
    }

    public enum EntityStatus {
        ACTIVE, INACTIVE, CLOSED
    }
}
