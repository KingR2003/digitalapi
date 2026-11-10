package com.digitalapicraft.quizapi.dto;

import java.time.LocalDateTime;

public class WalletResponse {
    private Long userId;
    private Long balance;
    private LocalDateTime updatedAt;

    public WalletResponse() {
    }

    public WalletResponse(Long userId, Long balance, LocalDateTime updatedAt) {
        this.userId = userId;
        this.balance = balance;
        this.updatedAt = updatedAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBalance() {
        return balance;
    }

    public void setBalance(Long balance) {
        this.balance = balance;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

