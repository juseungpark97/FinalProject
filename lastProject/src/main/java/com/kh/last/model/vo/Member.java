package com.kh.last.model.vo;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "MEMBER")
@Data
public class Member {

    @Id
    private String userName;
    private String userPwd;
}