package com.digitalapicraft.quizapi.dto;

public class QuizSummaryResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Long stakeCost;
    private Long rewardAmount;
    private Integer passingScore;
    private Integer timeLimitSeconds;
    private int totalQuestions;
    private Boolean active;

    public QuizSummaryResponse() {
    }

    public QuizSummaryResponse(Long id, String title, String description, String category, Long stakeCost, Long rewardAmount, Integer passingScore, Integer timeLimitSeconds, int totalQuestions, Boolean active) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.stakeCost = stakeCost;
        this.rewardAmount = rewardAmount;
        this.passingScore = passingScore;
        this.timeLimitSeconds = timeLimitSeconds;
        this.totalQuestions = totalQuestions;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}

