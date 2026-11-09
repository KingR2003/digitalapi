package com.digitalapicraft.quizapi.dto;

import com.digitalapicraft.quizapi.entity.AttemptStatus;

import java.util.List;

public class QuizResultResponse {
    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private int score;
    private int maxScore;
    private int percentage;
    private int passingScore;
    private AttemptStatus status;
    private boolean passed;
    private Long stakeCost;
    private Long rewardWon;
    private Long updatedBalance;
    private List<QuestionReviewDto> review;

    public QuizResultResponse() {
    }

    public QuizResultResponse(Long attemptId, Long quizId, String quizTitle, int score, int maxScore, int percentage, int passingScore, AttemptStatus status, boolean passed, Long stakeCost, Long rewardWon, Long updatedBalance, List<QuestionReviewDto> review) {
        this.attemptId = attemptId;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.score = score;
        this.maxScore = maxScore;
        this.percentage = percentage;
        this.passingScore = passingScore;
        this.status = status;
        this.passed = passed;
        this.stakeCost = stakeCost;
        this.rewardWon = rewardWon;
        this.updatedBalance = updatedBalance;
        this.review = review;
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

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(int maxScore) {
        this.maxScore = maxScore;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }

    public int getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(int passingScore) {
        this.passingScore = passingScore;
    }

    public AttemptStatus getStatus() {
        return status;
    }

    public void setStatus(AttemptStatus status) {
        this.status = status;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public Long getStakeCost() {
        return stakeCost;
    }

    public void setStakeCost(Long stakeCost) {
        this.stakeCost = stakeCost;
    }

    public Long getRewardWon() {
        return rewardWon;
    }

    public void setRewardWon(Long rewardWon) {
        this.rewardWon = rewardWon;
    }

    public Long getUpdatedBalance() {
        return updatedBalance;
    }

    public void setUpdatedBalance(Long updatedBalance) {
        this.updatedBalance = updatedBalance;
    }

    public List<QuestionReviewDto> getReview() {
        return review;
    }

    public void setReview(List<QuestionReviewDto> review) {
        this.review = review;
    }
}
