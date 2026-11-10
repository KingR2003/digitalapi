package com.digitalapicraft.quizapi.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuizCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String category;

    @NotNull(message = "Stake cost is required")
    @Min(value = 0, message = "Stake cost must be non-negative")
    private Long stakeCost;

    @NotNull(message = "Reward amount is required")
    @Min(value = 0, message = "Reward amount must be non-negative")
    private Long rewardAmount;

    @NotNull(message = "Passing score is required")
    @Min(value = 1, message = "Passing score must be at least 1%")
    @Max(value = 100, message = "Passing score cannot exceed 100%")
    private Integer passingScore;

    @NotNull(message = "Time limit is required")
    @Min(value = 10, message = "Time limit must be at least 10 seconds")
    private Integer timeLimitSeconds;

    public QuizCreateRequest() {
    }

    public QuizCreateRequest(String title, String description, String category, Long stakeCost, Long rewardAmount, Integer passingScore, Integer timeLimitSeconds) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.stakeCost = stakeCost;
        this.rewardAmount = rewardAmount;
        this.passingScore = passingScore;
        this.timeLimitSeconds = timeLimitSeconds;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getStakeCost() {
        return stakeCost;
    }

    public void setStakeCost(Long stakeCost) {
        this.stakeCost = stakeCost;
    }

    public Long getRewardAmount() {
        return rewardAmount;
    }

    public void setRewardAmount(Long rewardAmount) {
        this.rewardAmount = rewardAmount;
    }

    public Integer getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(Integer passingScore) {
        this.passingScore = passingScore;
    }

    public Integer getTimeLimitSeconds() {
        return timeLimitSeconds;
    }

    public void setTimeLimitSeconds(Integer timeLimitSeconds) {
        this.timeLimitSeconds = timeLimitSeconds;
    }
}

