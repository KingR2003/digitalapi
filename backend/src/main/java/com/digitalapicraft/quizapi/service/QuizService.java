package com.digitalapicraft.quizapi.service;

import com.digitalapicraft.quizapi.dto.*;
import com.digitalapicraft.quizapi.entity.*;
import com.digitalapicraft.quizapi.exception.BadRequestException;
import com.digitalapicraft.quizapi.exception.ResourceNotFoundException;
import com.digitalapicraft.quizapi.repository.QuestionRepository;
import com.digitalapicraft.quizapi.repository.QuizAttemptRepository;
import com.digitalapicraft.quizapi.repository.QuizRepository;
import com.digitalapicraft.quizapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;

    public QuizService(
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            QuizAttemptRepository attemptRepository,
            UserRepository userRepository,
            WalletService walletService) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.userRepository = userRepository;
        this.walletService = walletService;
    }

    @Transactional(readOnly = true)
    public List<QuizSummaryResponse> getAllActiveQuizzes() {
        return quizRepository.findByActiveTrue().stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizSummaryResponse> getAllQuizzesForAdmin() {
        return quizRepository.findAll().stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuizSummaryResponse getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));
        return toSummaryResponse(quiz);
    }

    /**
     * Atomically starts a quiz attempt:
     * 1. Validates quiz availability and non-empty questions
     * 2. Atomically stakes user credits using pessimistic write lock
     * 3. Creates an active attempt
     * 4. Returns sanitized questions (no answer leaks)
     */
    @Transactional
    public StartQuizResponse startQuizAttempt(Long userId, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        if (!Boolean.TRUE.equals(quiz.getActive())) {
            throw new BadRequestException("This quiz is currently inactive");
        }

        List<Question> questions = quiz.getQuestions();
        if (questions == null || questions.isEmpty()) {
            throw new BadRequestException("This quiz has no questions yet");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Deduct stake credits atomically with pessimistic lock
        Long remainingBalance = walletService.deductStake(userId, quiz.getStakeCost(), quizId);

        QuizAttempt attempt = new QuizAttempt(user, quiz, quiz.getStakeCost());
        attempt = attemptRepository.save(attempt);

        List<QuestionDto> questionDtos = questions.stream()
                .map(q -> new QuestionDto(
                        q.getId(),
                        q.getQuestionText(),
                        List.of(q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()),
                        q.getPoints()
                ))
                .collect(Collectors.toList());

        return new StartQuizResponse(
                attempt.getId(),
                quiz.getId(),
                quiz.getTitle(),
                quiz.getTimeLimitSeconds(),
                quiz.getStakeCost(),
                remainingBalance,
                questionDtos
        );
    }

    /**
     * Evaluates quiz submission, checks passing score, and awards reward credits if passed.
     */
    @Transactional
    public QuizResultResponse submitQuiz(Long userId, Long attemptId, SubmitQuizRequest request) {
        QuizAttempt attempt = attemptRepository.findByIdAndUserId(attemptId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found with id: " + attemptId));

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new BadRequestException("This attempt has already been submitted and completed");
        }

        Quiz quiz = attempt.getQuiz();
        List<Question> questions = quiz.getQuestions();

        Map<Long, Integer> userAnswers = request.getAnswers() != null ? request.getAnswers() : Collections.emptyMap();

        int totalScore = 0;
        int maxScore = 0;
        List<QuestionReviewDto> reviews = new ArrayList<>();

        for (Question q : questions) {
            int qPoints = q.getPoints() != null ? q.getPoints() : 1;
            maxScore += qPoints;

            Integer userChoice = userAnswers.get(q.getId());
            boolean isCorrect = userChoice != null && userChoice.equals(q.getCorrectOptionIndex());

            if (isCorrect) {
                totalScore += qPoints;
            }

            reviews.add(new QuestionReviewDto(
                    q.getId(),
                    q.getQuestionText(),
                    List.of(q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()),
                    userChoice,
                    q.getCorrectOptionIndex(),
                    isCorrect,
                    q.getExplanation()
            ));
        }

        int percentage = maxScore > 0 ? (int) Math.round(((double) totalScore / maxScore) * 100) : 0;
        boolean passed = percentage >= quiz.getPassingScore();

        attempt.setScore(totalScore);
        attempt.setMaxScore(maxScore);
        attempt.setPercentage(percentage);
        attempt.setCompletedAt(LocalDateTime.now());

        Long updatedBalance;
        if (passed) {
            attempt.setStatus(AttemptStatus.PASSED);
            attempt.setRewardWon(quiz.getRewardAmount());
            updatedBalance = walletService.creditReward(userId, quiz.getRewardAmount(), attempt.getId());
        } else {
            attempt.setStatus(AttemptStatus.FAILED);
            attempt.setRewardWon(0L);
            updatedBalance = walletService.getBalance(userId);
        }

        attemptRepository.save(attempt);

        return new QuizResultResponse(
                attempt.getId(),
                quiz.getId(),
                quiz.getTitle(),
                totalScore,
                maxScore,
                percentage,
                quiz.getPassingScore(),
                attempt.getStatus(),
                passed,
                attempt.getStakeCost(),
                attempt.getRewardWon(),
                updatedBalance,
                reviews
        );
    }

    // ================= Admin Quiz Management =================

    @Transactional
    public QuizSummaryResponse createQuiz(QuizCreateRequest request) {
        Quiz quiz = new Quiz(
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getStakeCost(),
                request.getRewardAmount(),
                request.getPassingScore(),
                request.getTimeLimitSeconds()
        );
        quiz = quizRepository.save(quiz);
        return toSummaryResponse(quiz);
    }

    @Transactional
    public QuizSummaryResponse updateQuiz(Long id, QuizCreateRequest request) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));

        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setCategory(request.getCategory());
        quiz.setStakeCost(request.getStakeCost());
        quiz.setRewardAmount(request.getRewardAmount());
        quiz.setPassingScore(request.getPassingScore());
        quiz.setTimeLimitSeconds(request.getTimeLimitSeconds());

        quiz = quizRepository.save(quiz);
        return toSummaryResponse(quiz);
    }

    @Transactional
    public void deleteQuiz(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));
        quizRepository.delete(quiz);
    }

    @Transactional
    public QuestionDto addQuestionToQuiz(Long quizId, QuestionCreateRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        Question question = new Question(
                request.getQuestionText(),
                request.getOptionA(),
                request.getOptionB(),
                request.getOptionC(),
                request.getOptionD(),
                request.getCorrectOptionIndex(),
                request.getPoints(),
                request.getExplanation()
        );

        quiz.addQuestion(question);
        question = questionRepository.save(question);

        return new QuestionDto(
                question.getId(),
                question.getQuestionText(),
                List.of(question.getOptionA(), question.getOptionB(), question.getOptionC(), question.getOptionD()),
                question.getPoints()
        );
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
        questionRepository.delete(question);
    }

    private QuizSummaryResponse toSummaryResponse(Quiz quiz) {
        int count = quiz.getQuestions() != null ? quiz.getQuestions().size() : 0;
        return new QuizSummaryResponse(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getCategory(),
                quiz.getStakeCost(),
                quiz.getRewardAmount(),
                quiz.getPassingScore(),
                quiz.getTimeLimitSeconds(),
                count,
                quiz.getActive()
        );
    }
}

