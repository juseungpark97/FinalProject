package com.kh.last.model.vo;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "STOP_ACCOUNT")
public class StopAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "STOP_ID")
    private Long stopId; // 정지번호

    @Column(name = "USER_NO", nullable = false)
    private Long userNo; // 유저번호

    @Column(name = "STOP_DATE", nullable = false)
    private LocalDate stopDate; // 정지일자

    @Column(name = "REASON", nullable = false, length = 1000)
    private String reason; // 정지사유
    
    @PrePersist
    protected void onCreate() {
        this.stopDate = LocalDate.now();
    }
}
