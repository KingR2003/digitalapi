package com.digitalapicraft.quizapi.service;

import com.digitalapicraft.quizapi.dto.TransactionResponse;
import com.digitalapicraft.quizapi.dto.WalletResponse;
import com.digitalapicraft.quizapi.entity.TransactionType;
import com.digitalapicraft.quizapi.entity.User;
import com.digitalapicraft.quizapi.entity.Wallet;
import com.digitalapicraft.quizapi.entity.WalletTransaction;
import com.digitalapicraft.quizapi.exception.InsufficientBalanceException;
import com.digitalapicraft.quizapi.exception.ResourceNotFoundException;
import com.digitalapicraft.quizapi.repository.WalletRepository;
import com.digitalapicraft.quizapi.repository.WalletTransactionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final long initialCredits;

    public WalletService(
            WalletRepository walletRepository,
            WalletTransactionRepository transactionRepository,
            @Value("${app.initial-credits:500}") long initialCredits) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.initialCredits = initialCredits;
    }

    @Transactional
    public Wallet initializeWalletForUser(User user) {
        Wallet wallet = new Wallet(user, initialCredits);
        wallet = walletRepository.save(wallet);

        WalletTransaction tx = new WalletTransaction(
                wallet,
                initialCredits,
                initialCredits,
                TransactionType.INITIAL_BONUS,
                "REGISTRATION_BONUS",
                "Welcome bonus for registration"
        );
        transactionRepository.save(tx);
        return wallet;
    }

    @Transactional(readOnly = true)
    public WalletResponse getWalletByUserId(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));
        return new WalletResponse(userId, wallet.getBalance(), wallet.getUpdatedAt());
    }

    @Transactional(readOnly = true)
    public Long getBalance(Long userId) {
        return walletRepository.findByUserId(userId)
                .map(Wallet::getBalance)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));
    }

    /**
     * Atomically stakes credits for a quiz using pessimistic database row locking.
     * Prevents race conditions and double-spending across concurrent requests.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Long deductStake(Long userId, Long stakeCost, Long quizId) {
        if (stakeCost == null || stakeCost <= 0) {
            return getBalance(userId);
        }

        Wallet wallet = walletRepository.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));

        if (wallet.getBalance() < stakeCost) {
            throw new InsufficientBalanceException(
                    String.format("Insufficient credits: Required %d credits, but available balance is %d", stakeCost, wallet.getBalance())
            );
        }

        long newBalance = wallet.getBalance() - stakeCost;
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        WalletTransaction tx = new WalletTransaction(
                wallet,
                -stakeCost,
                newBalance,
                TransactionType.QUIZ_STAKE,
                "QUIZ_" + quizId,
                "Staked credits to enter quiz #" + quizId
        );
        transactionRepository.save(tx);

        return newBalance;
    }

    /**
     * Atomically credits quiz rewards to the user's wallet with row locking.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Long creditReward(Long userId, Long rewardAmount, Long attemptId) {
        if (rewardAmount == null || rewardAmount <= 0) {
            return getBalance(userId);
        }

        Wallet wallet = walletRepository.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));

        long newBalance = wallet.getBalance() + rewardAmount;
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        WalletTransaction tx = new WalletTransaction(
                wallet,
                rewardAmount,
                newBalance,
                TransactionType.QUIZ_REWARD,
                "ATTEMPT_" + attemptId,
                "Won reward for passing quiz attempt #" + attemptId
        );
        transactionRepository.save(tx);

        return newBalance;
    }

    /**
     * Atomically adds credits via mock payment purchase.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public WalletResponse buyCredits(Long userId, Long credits, String paymentMethod, String idempotencyKey) {
        Wallet wallet = walletRepository.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));

        long newBalance = wallet.getBalance() + credits;
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        String ref = idempotencyKey != null && !idempotencyKey.isBlank()
                ? idempotencyKey
                : "MOCK_PAY_" + System.currentTimeMillis();

        String method = (paymentMethod != null && !paymentMethod.isBlank()) ? paymentMethod : "MOCK_GATEWAY";

        WalletTransaction tx = new WalletTransaction(
                wallet,
                credits,
                newBalance,
                TransactionType.MOCK_BUY,
                ref,
                "Purchased " + credits + " credits via " + method
        );
        transactionRepository.save(tx);

        return new WalletResponse(userId, newBalance, wallet.getUpdatedAt());
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactions(Long userId, Pageable pageable) {
        return transactionRepository.findByWalletUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(tx -> new TransactionResponse(
                        tx.getId(),
                        tx.getAmount(),
                        tx.getBalanceAfter(),
                        tx.getType(),
                        tx.getReferenceId(),
                        tx.getDescription(),
                        tx.getCreatedAt()
                ));
    }
}

