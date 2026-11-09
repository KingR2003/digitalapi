package com.digitalapicraft.quizapi.controller;

import com.digitalapicraft.quizapi.dto.QuestionCreateRequest;
import com.digitalapicraft.quizapi.dto.QuestionDto;
import com.digitalapicraft.quizapi.dto.QuizCreateRequest;
import com.digitalapicraft.quizapi.dto.QuizSummaryResponse;
import com.digitalapicraft.quizapi.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin Quiz Management", description = "Endpoints restricted to ROLE_ADMIN for managing quizzes and question banks")
public class AdminQuizController {

    private final QuizService quizService;

    public AdminQuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/quizzes")
    @Operation(summary = "List all quizzes (Admin)", description = "Retrieves all quizzes including inactive ones.")
    public ResponseEntity<List<QuizSummaryResponse>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzesForAdmin());
    }

    @PostMapping("/quizzes")
    @Operation(summary = "Create a new quiz", description = "Creates a new quiz with custom stake cost, reward amounts, and passing score criteria.")
    public ResponseEntity<QuizSummaryResponse> createQuiz(@Valid @RequestBody QuizCreateRequest request) {
        QuizSummaryResponse response = quizService.createQuiz(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/quizzes/{id}")
    @Operation(summary = "Update an existing quiz", description = "Updates title, description, economics, and time limit for a quiz.")
    public ResponseEntity<QuizSummaryResponse> updateQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizCreateRequest request) {
        QuizSummaryResponse response = quizService.updateQuiz(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/quizzes/{id}")
    @Operation(summary = "Delete a quiz", description = "Deletes a quiz and all associated questions.")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/quizzes/{quizId}/questions")
    @Operation(summary = "Add question to quiz", description = "Appends a new multiple-choice question with answer options and explanations to a quiz.")
    public ResponseEntity<QuestionDto> addQuestion(
            @PathVariable Long quizId,
            @Valid @RequestBody QuestionCreateRequest request) {
        QuestionDto response = quizService.addQuestionToQuiz(quizId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/questions/{questionId}")
    @Operation(summary = "Delete question", description = "Removes a question from a quiz.")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long questionId) {
        quizService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }
}
