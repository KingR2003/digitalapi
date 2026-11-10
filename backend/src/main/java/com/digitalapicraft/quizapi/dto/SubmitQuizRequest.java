package com.digitalapicraft.quizapi.dto;

import java.util.Map;

public class SubmitQuizRequest {
    // Map of questionId -> selectedOptionIndex (0..3)
    private Map<Long, Integer> answers;

    public SubmitQuizRequest() {
    }

    public SubmitQuizRequest(Map<Long, Integer> answers) {
        this.answers = answers;
    }

    public Map<Long, Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, Integer> answers) {
        this.answers = answers;
    }
}

