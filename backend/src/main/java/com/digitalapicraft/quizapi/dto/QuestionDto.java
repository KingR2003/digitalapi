package com.digitalapicraft.quizapi.dto;

import java.util.List;

public class QuestionDto {
    private Long id;
    private String questionText;
    private List<String> options;
    private Integer points;

    public QuestionDto() {
    }

    public QuestionDto(Long id, String questionText, List<String> options, Integer points) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.points = points;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }
}
