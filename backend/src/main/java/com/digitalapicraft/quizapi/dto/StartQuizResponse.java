package com.digitalapicraft.quizapi.dto;

import java.util.List;

public class StartQuizResponse {
    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private Integer timeLimitSeconds;
    private Long stakeDeducted;
    private Long remainingBalance;
    private List<QuestionDto> questions;

    public StartQuizResponse() {
    }

    public StartQuizResponse(Long attemptId, Long quizId, String quizTitle, Integer timeLimitSeconds, Long stakeDeducted, Long remainingBalance, List<QuestionDto> questions) {
        this.attemptId = attemptId;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.timeLimitSeconds = timeLimitSeconds;
        this.stakeDeducted = stakeDeducted;
        this.remainingBalance = remainingBalance;
        this.questions = questions;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }

    public Integer getTimeLimitSeconds() {
        return timeLimitSeconds;
    }

    public void setTimeLimitSeconds(Integer timeLimitSeconds) {
        this.timeLimitSeconds = timeLimitSeconds;
    }

    public Long getStakeDeducted() {
        return stakeDeducted;
    }

    public void setStakeDeducted(Long stakeDeducted) {
        this.stakeDeducted = stakeDeducted;
    }

    public Long getRemainingBalance() {
        return remainingBalance;
    }

    public void setRemainingBalance(Long remainingBalance) {
        this.remainingBalance = remainingBalance;
    }

    public List<QuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDto> questions) {
        this.questions = questions;
    }
}

