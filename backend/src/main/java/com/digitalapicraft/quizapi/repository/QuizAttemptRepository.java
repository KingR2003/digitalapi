package com.digitalapicraft.quizapi.repository;

import com.digitalapicraft.quizapi.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    Optional<QuizAttempt> findByIdAndUserId(Long id, Long userId);
    List<QuizAttempt> findByUserIdOrderByStartedAtDesc(Long userId);
}

