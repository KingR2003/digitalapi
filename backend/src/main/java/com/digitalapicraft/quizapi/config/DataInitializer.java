package com.digitalapicraft.quizapi.config;

import com.digitalapicraft.quizapi.entity.*;
import com.digitalapicraft.quizapi.repository.QuizRepository;
import com.digitalapicraft.quizapi.repository.UserRepository;
import com.digitalapicraft.quizapi.repository.WalletRepository;
import com.digitalapicraft.quizapi.repository.WalletTransactionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final QuizRepository quizRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            WalletRepository walletRepository,
            WalletTransactionRepository transactionRepository,
            QuizRepository quizRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.quizRepository = quizRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsersAndWallets();
        }

        if (quizRepository.count() == 0) {
            seedQuizzes();
        }
    }

    private void seedUsersAndWallets() {
        // Create Admin
        User admin = new User(
                "admin@digitalapi.com",
                passwordEncoder.encode("admin123"),
                "API Administrator",
                Role.ROLE_ADMIN
        );
        admin = userRepository.save(admin);

        Wallet adminWallet = new Wallet(admin, 5000L);
        adminWallet = walletRepository.save(adminWallet);
        transactionRepository.save(new WalletTransaction(
                adminWallet, 5000L, 5000L, TransactionType.INITIAL_BONUS, "ADMIN_GENESIS", "Admin bootstrap credit allocation"
        ));

        // Create Demo User with 500 initial credits
        User user = new User(
                "user@digitalapi.com",
                passwordEncoder.encode("user123"),
                "Candidate Explorer",
                Role.ROLE_USER
        );
        user = userRepository.save(user);

        Wallet userWallet = new Wallet(user, 500L);
        userWallet = walletRepository.save(userWallet);
        transactionRepository.save(new WalletTransaction(
                userWallet, 500L, 500L, TransactionType.INITIAL_BONUS, "REGISTRATION_BONUS", "Initial registration bonus (500 Credits)"
        ));
    }

    private void seedQuizzes() {
        Quiz quiz1 = new Quiz(
                "Java & Spring Boot Mastery",
                "Test your backend skills in concurrency, transactions, and REST APIs with Spring Boot 3.",
                "Backend Engineering",
                100L, // Stake cost
                250L, // Reward payout
                70,   // Passing score %
                180   // Time limit in seconds
        );

        quiz1.addQuestion(new Question(
                "Which annotation in Spring Boot enforces database-level row locking to prevent race conditions?",
                "@Lock(LockModeType.PESSIMISTIC_WRITE)",
                "@Transactional(readOnly = true)",
                "@Async",
                "@ConcurrentUpdate",
                0,
                1,
                "Pessimistic write locking locks rows using SELECT ... FOR UPDATE in SQL to ensure consistency."
        ));

        quiz1.addQuestion(new Question(
                "What is the default isolation level in most relational databases (e.g. PostgreSQL)?",
                "READ UNCOMMITTED",
                "READ COMMITTED",
                "REPEATABLE READ",
                "SERIALIZABLE",
                1,
                1,
                "PostgreSQL defaults to READ COMMITTED, preventing dirty reads while allowing non-repeatable reads."
        ));

        quiz1.addQuestion(new Question(
                "How can you prevent double-spending in a credit-staking API?",
                "Use in-memory local variables",
                "Disable transactions",
                "Use atomic DB updates with pessimistic row locking and CHECK constraints",
                "Cache wallet balance in client cookies",
                2,
                1,
                "Atomic updates with DB pessimistic locks and SQL CHECK constraints eliminate concurrency anomalies."
        ));

        quiz1.addQuestion(new Question(
                "Which HTTP status code is most appropriate when a user tries to stake more credits than available?",
                "200 OK",
                "400 Bad Request or 422 Unprocessable Entity",
                "500 Internal Server Error",
                "301 Moved Permanently",
                1,
                1,
                "400 or 422 represents a client request error where business balance requirements are not met."
        ));

        quizRepository.save(quiz1);

        Quiz quiz2 = new Quiz(
                "REST API Design & Cloud Gateways",
                "Evaluate your expertise in OpenAPI 3, API Gateways, Docker, and stateless microservices.",
                "Cloud & Architecture",
                50L,  // Stake cost
                120L, // Reward payout
                60,   // Passing score %
                120   // Time limit in seconds
        );

        quiz2.addQuestion(new Question(
                "What is the primary role of an API Gateway like DigitalAPI Gateway?",
                "Compile Java bytecode into machine code",
                "Centralize routing, rate limiting, authentication, and traffic analytics",
                "Store relational table schemas",
                "Replace frontend CSS styles",
                1,
                1,
                "API Gateways serve as reverse proxies providing rate limiting, security, CORS, and centralized telemetry."
        ));

        quiz2.addQuestion(new Question(
                "Why is a stateless API ideal for GCP Cloud Run deployment?",
                "It requires sticky sessions",
                "It can horizontally auto-scale from zero to multiple container instances seamlessly",
                "It avoids using databases altogether",
                "It disables HTTPS traffic",
                1,
                1,
                "Stateless architectures allow Cloud Run to dynamically spawn or tear down containers according to demand."
        ));

        quiz2.addQuestion(new Question(
                "What does an Idempotency-Key header accomplish in financial or credit operations?",
                "Doubles the credit transaction automatically",
                "Ensures repeated identical requests do not produce duplicate charges",
                "Encrypts passwords with MD5",
                "Bypasses CORS restrictions",
                1,
                1,
                "Idempotency keys ensure network retries do not execute side effects multiple times."
        ));

        quizRepository.save(quiz2);
    }
}

