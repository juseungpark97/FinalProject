package com.kh.last.model.dto;

import lombok.Data;

@Data

public class PasswordChangeRequest {
    private String email;
    private String currentPassword;
    private String newPassword;

    // Getters and Setters
}