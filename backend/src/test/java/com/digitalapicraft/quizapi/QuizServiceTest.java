package com.digitalapicraft.quizapi;

import com.digitalapicraft.quizapi.dto.QuizResultResponse;
import com.digitalapicraft.quizapi.dto.StartQuizResponse;
import com.digitalapicraft.quizapi.dto.SubmitQuizRequest;
import com.digitalapicraft.quizapi.entity.Role;
import com.digitalapicraft.quizapi.entity.User;
import com.digitalapicraft.quizapi.repository.QuizRepository;
import com.digitalapicraft.quizapi.repository.UserRepository;
import com.digitalapicraft.quizapi.service.QuizService;
import com.digitalapicraft.quizapi.service.WalletService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class QuizServiceTest {

    @Autowired
    private QuizService quizService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletService walletService;

    @Test
    void testQuizWorkflow_StartAndSubmitAnswers() {
        // Create user with 500 initial credits
        String email = "quizuser_" + System.currentTimeMillis() + "@test.com";
        User user = new User(email, "hashed", "Quiz Tester", Role.ROLE_USER);
        user = userRepository.save(user);
        walletService.initializeWalletForUser(user);

        // Fetch seeded Quiz 1 (stake: 100, reward: 250, passing: 70%)
        Long quizId = quizRepository.findAll().get(0).getId();

        // 1. Start Quiz (should deduct 100 credits -> balance = 400)
        StartQuizResponse startResponse = quizService.startQuizAttempt(user.getId(), quizId);
        assertNotNull(startResponse.getAttemptId());
        assertEquals(100L, startResponse.getStakeDeducted());
        assertEquals(400L, startResponse.getRemainingBalance());
        assertFalse(startResponse.getQuestions().isEmpty());

        // 2. Submit all correct answers:
        // Question 1 correct is option 0
        // Question 2 correct is option 1
        // Question 3 correct is option 2
        // Question 4 correct is option 1
        Long q1Id = startResponse.getQuestions().get(0).getId();
        Long q2Id = startResponse.getQuestions().get(1).getId();
        Long q3Id = startResponse.getQuestions().get(2).getId();
        Long q4Id = startResponse.getQuestions().get(3).getId();

        Map<Long, Integer> answers = Map.of(
                q1Id, 0,
                q2Id, 1,
                q3Id, 2,
                q4Id, 1
        );

        QuizResultResponse result = quizService.submitQuiz(user.getId(), startResponse.getAttemptId(), new SubmitQuizRequest(answers));

        assertTrue(result.isPassed());
        assertEquals(100, result.getPercentage());
        assertEquals(250L, result.getRewardWon());
        // Balance before pass was 400, reward won is 250 -> new balance = 650
        assertEquals(650L, result.getUpdatedBalance());
        assertEquals(650L, walletService.getBalance(user.getId()));
    }
}

