package com.kh.last.model.dto;

import lombok.Data;

@Data
public class EmailCheckResponse {
    private boolean exists;
    private String message;

    public EmailCheckResponse(boolean exists) {
        this.exists = exists;
    }
}