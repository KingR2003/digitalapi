package com.digitalapicraft.quizapi;

import com.digitalapicraft.quizapi.entity.Role;
import com.digitalapicraft.quizapi.entity.User;
import com.digitalapicraft.quizapi.entity.Wallet;
import com.digitalapicraft.quizapi.exception.InsufficientBalanceException;
import com.digitalapicraft.quizapi.repository.UserRepository;
import com.digitalapicraft.quizapi.repository.WalletRepository;
import com.digitalapicraft.quizapi.service.WalletService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class WalletServiceConcurrencyTest {

    @Autowired
    private WalletService walletService;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testConcurrentDeductions_PreservesBalanceConsistency() throws InterruptedException {
        // Create user with exactly 200 credits
        String email = "concurrency_" + System.currentTimeMillis() + "@test.com";
        User user = new User(email, passwordEncoder.encode("pass"), "Concurrent Tester", Role.ROLE_USER);
        user = userRepository.save(user);

        Wallet wallet = new Wallet(user, 200L);
        walletRepository.save(wallet);

        Long userId = user.getId();
        int totalThreads = 10;
        long stakeAmount = 100L;

        ExecutorService executor = Executors.newFixedThreadPool(totalThreads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(totalThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        for (int i = 0; i < totalThreads; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await(); // Synchronize all threads to hit simultaneously
                    walletService.deductStake(userId, stakeAmount, 1L);
                    successCount.incrementAndGet();
                } catch (InsufficientBalanceException ex) {
                    failureCount.incrementAndGet();
                } catch (Exception ex) {
                    System.err.println("Unexpected exception: " + ex.getMessage());
                } finally {
                    finishLatch.countDown();
                }
            });
        }

        // Release the latch so all 10 threads strike simultaneously
        startLatch.countDown();
        finishLatch.await();
        executor.shutdown();

        // Verification:
        // With 200 initial credits and 100 stake fee:
        // Exactly 2 threads should succeed, exactly 8 threads should fail.
        assertEquals(2, successCount.get(), "Exactly 2 concurrent stake requests should succeed");
        assertEquals(8, failureCount.get(), "Exactly 8 concurrent stake requests should be rejected");

        // Balance must be exactly 0, never negative
        Long finalBalance = walletService.getBalance(userId);
        assertEquals(0L, finalBalance, "Final balance must be exactly 0");
    }
}
