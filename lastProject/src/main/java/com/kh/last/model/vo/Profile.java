package com.kh.last.model.vo;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_no")
    private Long profileNo;

    @Column(name = "image", nullable = false, length = 255)
    private String image;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_no", nullable = false)
    private USERS user;
}