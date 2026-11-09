package com.digitalapicraft.quizapi.dto;

import java.util.List;

public class QuestionReviewDto {
    private Long questionId;
    private String questionText;
    private List<String> options;
    private Integer selectedOptionIndex;
    private Integer correctOptionIndex;
    private boolean correct;
    private String explanation;

    public QuestionReviewDto() {
    }

    public QuestionReviewDto(Long questionId, String questionText, List<String> options, Integer selectedOptionIndex, Integer correctOptionIndex, boolean correct, String explanation) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.options = options;
        this.selectedOptionIndex = selectedOptionIndex;
        this.correctOptionIndex = correctOptionIndex;
        this.correct = correct;
        this.explanation = explanation;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public Integer getSelectedOptionIndex() {
        return selectedOptionIndex;
    }

    public void setSelectedOptionIndex(Integer selectedOptionIndex) {
        this.selectedOptionIndex = selectedOptionIndex;
    }

    public Integer getCorrectOptionIndex() {
        return correctOptionIndex;
    }

    public void setCorrectOptionIndex(Integer correctOptionIndex) {
        this.correctOptionIndex = correctOptionIndex;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
