package com.digitalapicraft.quizapi.controller;

import com.digitalapicraft.quizapi.config.UserPrincipal;
import com.digitalapicraft.quizapi.dto.QuizResultResponse;
import com.digitalapicraft.quizapi.dto.QuizSummaryResponse;
import com.digitalapicraft.quizapi.dto.StartQuizResponse;
import com.digitalapicraft.quizapi.dto.SubmitQuizRequest;
import com.digitalapicraft.quizapi.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quizzes")
@Tag(name = "Quiz Arena", description = "Endpoints for exploring quizzes, staking credits, answering questions, and scoring results")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    @Operation(summary = "List all active quizzes", description = "Returns all published quizzes with stake cost, reward amounts, and passing thresholds.")
    public ResponseEntity<List<QuizSummaryResponse>> getActiveQuizzes() {
        return ResponseEntity.ok(quizService.getAllActiveQuizzes());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quiz summary by ID", description = "Returns metadata and parameters for a specific quiz.")
    public ResponseEntity<QuizSummaryResponse> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "Stake credits and start quiz", description = "Atomically locks user wallet, verifies sufficient balance, deducts the stake fee, and returns the questions.")
    public ResponseEntity<StartQuizResponse> startQuiz(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        StartQuizResponse response = quizService.startQuizAttempt(principal.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/attempts/{attemptId}/submit")
    @Operation(summary = "Submit answers and receive score", description = "Submits question choices, scores responses, awards reward credits if score meets passing threshold, and provides explanations.")
    public ResponseEntity<QuizResultResponse> submitQuiz(
            @PathVariable Long attemptId,
            @RequestBody SubmitQuizRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        QuizResultResponse response = quizService.submitQuiz(principal.getId(), attemptId, request);
        return ResponseEntity.ok(response);
    }
}
