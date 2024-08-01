package com.kh.last.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.kh.last.model.vo.Users;
import com.kh.last.service.UserService;

import lombok.Data;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Users createUser(@RequestBody UserCreateRequest request) {
        return userService.createUser(
        		request.getUserId(),
        		request.getEmail(),
        		request.getPassword(),
        		request.getStatus(),
        		request.getBirthday(),
        		request.getUsername(),
        		request.getVNumber()
        );
    }
}
@Data
class UserCreateRequest {
    private String userId;
    private String email;
    private String password;
    private String status;
    private String birthday;
    private String username;
    private Long vNumber;

    // Getters and Setters
}
