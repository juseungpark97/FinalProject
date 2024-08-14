package com.kh.last.model.dto;

import lombok.Data;


@Data
public class UserCreateRequest {
    private String email;
    private String password;
    private String phone;
    private String status;
    private String birthday;
    private String username;
}