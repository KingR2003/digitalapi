package com.digitalapicraft.quizapi.dto;

import com.digitalapicraft.quizapi.entity.TransactionType;

import java.time.LocalDateTime;

public class TransactionResponse {
    private Long id;
    private Long amount;
    private Long balanceAfter;
    private TransactionType type;
    private String referenceId;
    private String description;
    private LocalDateTime createdAt;

    public TransactionResponse() {
    }

    public TransactionResponse(Long id, Long amount, Long balanceAfter, TransactionType type, String referenceId, String description, LocalDateTime createdAt) {
        this.id = id;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.type = type;
        this.referenceId = referenceId;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public Long getBalanceAfter() {
        return balanceAfter;
    }

    public void setBalanceAfter(Long balanceAfter) {
        this.balanceAfter = balanceAfter;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

