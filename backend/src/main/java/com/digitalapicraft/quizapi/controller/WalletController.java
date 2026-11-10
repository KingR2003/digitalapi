package com.digitalapicraft.quizapi.controller;

import com.digitalapicraft.quizapi.config.UserPrincipal;
import com.digitalapicraft.quizapi.dto.MockBuyRequest;
import com.digitalapicraft.quizapi.dto.TransactionResponse;
import com.digitalapicraft.quizapi.dto.WalletResponse;
import com.digitalapicraft.quizapi.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wallet")
@Tag(name = "Credit Wallet", description = "Endpoints for checking balance, viewing ledger transactions, and buying credits via mock payment")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user wallet balance", description = "Retrieves the current available credit balance for the authenticated user.")
    public ResponseEntity<WalletResponse> getMyWallet(@AuthenticationPrincipal UserPrincipal principal) {
        WalletResponse response = walletService.getWalletByUserId(principal.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/transactions")
    @Operation(summary = "Get transaction history", description = "Retrieves paginated audit ledger of all credit deposits, stakes, rewards, and mock purchases.")
    public ResponseEntity<Page<TransactionResponse>> getTransactions(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<TransactionResponse> transactions = walletService.getTransactions(
                principal.getId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/mock-buy")
    @Operation(summary = "Buy credits via mock payment", description = "Simulates purchasing credits through an external mock payment gateway and credits the wallet atomically.")
    public ResponseEntity<WalletResponse> buyCredits(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKeyHeader,
            @Valid @RequestBody MockBuyRequest request) {
        String key = (idempotencyKeyHeader != null && !idempotencyKeyHeader.isBlank())
                ? idempotencyKeyHeader
                : request.getIdempotencyKey();

        WalletResponse response = walletService.buyCredits(
                principal.getId(),
                request.getCredits(),
                request.getPaymentMethod(),
                key
        );
        return ResponseEntity.ok(response);
    }
}

