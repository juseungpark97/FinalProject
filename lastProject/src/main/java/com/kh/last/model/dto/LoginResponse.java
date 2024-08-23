package com.kh.last.model.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private boolean isSubscribed;  // 구독 상태를 나타내는 필드 추가

    public LoginResponse(String token) {
        this.token = token;
    }



}