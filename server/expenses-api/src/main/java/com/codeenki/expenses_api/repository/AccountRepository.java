package com.codeenki.expenses_api.repository;

import com.codeenki.expenses_api.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, UUID> {

    List<AccountEntity> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<AccountEntity> findByUserIdAndType(UUID userId, AccountEntity.AccountType type);

    List<AccountEntity> findByUserIdAndStatusAndIncludeInGlobalBalance(
            UUID userId, AccountEntity.EntityStatus status, Boolean includeInGlobalBalance);
}