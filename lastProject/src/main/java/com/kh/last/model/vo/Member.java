package com.kh.last.model.vo;

import javax.persistence.*;

import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
@Table(name = "MEMBER")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq_generator")
    @SequenceGenerator(name = "member_seq_generator", sequenceName = "member_seq", allocationSize = 1)
    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "NICKNAME", nullable = false)
    private String nickname;

    @Column(name = "BIRTH", nullable = false)
    private String birth;

    @Column(name = "GENDER", nullable = false)
    private String gender;

    @Column(name = "PHONE", nullable = false)
    private String phone;

    @Column(name = "ADDRESS", nullable = false)
    private String address;

    @Column(name = "CREATE_DATE")
    private Timestamp createDate;

    @Column(name = "ROLE", columnDefinition = "varchar(100) default '일반'")
    private String role;

    @Column(name = "PROFILE_IMAGE")
    private String profileImage;

    @Column(name = "STATUS", columnDefinition = "varchar(10) default 'Y'")
    private String status;

    @Column(name = "UPDATE_DATE")
    private Timestamp updateDate;

    // Getters and Setters
}
