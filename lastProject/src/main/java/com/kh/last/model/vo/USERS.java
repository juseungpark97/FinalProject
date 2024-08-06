package com.kh.last.model.vo;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
<<<<<<< HEAD:lastProject/src/main/java/com/kh/last/model/vo/Users.java
@Table(name = "USERS")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "user_seq", allocationSize = 1)
=======
public class USERS {
    @Id
    //@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    //@SequenceGenerator(name = "user_seq", sequenceName = "user_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
>>>>>>> origin/main:lastProject/src/main/java/com/kh/last/model/vo/USERS.java
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