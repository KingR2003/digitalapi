package com.digitalapicraft.quizapi.repository;

import com.digitalapicraft.quizapi.entity.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    Page<WalletTransaction> findByWalletUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<WalletTransaction> findByWalletUserIdOrderByCreatedAtDesc(Long userId);
}

