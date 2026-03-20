package com.codeenki.expenses_api.repository;

import com.codeenki.expenses_api.entity.AccountEntity;
import com.codeenki.expenses_api.entity.CardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CardRepository extends JpaRepository<CardEntity, UUID> {

    List<CardEntity> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<CardEntity> findByUserIdAndStatus(UUID userId, AccountEntity.EntityStatus status);
}
