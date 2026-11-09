package com.digitalapicraft.quizapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class MockBuyRequest {

    @NotNull(message = "Credits amount is required")
    @Min(value = 50, message = "Minimum purchase is 50 credits")
    private Long credits;

    private String paymentMethod; // e.g. "MOCK_UPI", "MOCK_CARD"
    private String idempotencyKey;

    public MockBuyRequest() {
    }

    public MockBuyRequest(Long credits, String paymentMethod, String idempotencyKey) {
        this.credits = credits;
        this.paymentMethod = paymentMethod;
        this.idempotencyKey = idempotencyKey;
    }

    public Long getCredits() {
        return credits;
    }

    public void setCredits(Long credits) {
        this.credits = credits;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }
}
