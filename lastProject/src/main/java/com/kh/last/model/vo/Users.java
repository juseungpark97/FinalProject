package com.kh.last.model.vo;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_no")
    private Long userNo;

    @Column(name = "userid", nullable = false, length = 255)
    private String userId;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "role", nullable = true, length = 50)
    private String role = "user";

    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt;

    @Column(name = "status", nullable = true, length = 3)
    private String status;

    @Column(name = "birthday", nullable = true, length = 100)
    private String birthday;

    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Column(name = "vNumber", nullable = true)
    private Long vNumber;
}
