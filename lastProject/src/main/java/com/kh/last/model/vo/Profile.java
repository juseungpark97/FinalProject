package com.kh.last.model.vo;

import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Data
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileNo;

    @ManyToOne
    @JoinColumn(name = "user_no", nullable = false)
    private USERS userNo;

    @Column(name = "profile_img", nullable = false)
    private String profileImg;

    @Column(name = "profile_name", nullable = false)
    private String profileName;
    @Column(name = "profile_pwd", nullable = true)
    private Integer profilePwd;
    
    @Column(name = "is_locked", nullable = false)
    private boolean isLocked = false;
    
    @Column(name = "profile_main", nullable = false, length = 1)
    private String profileMain; // 'M' for Main, 'S' for Sub

    @Lob
    private String profileVector; // 사용자의 선호도를 JSON 문자열로 저장
    
    // 테트리스 점수
    @Column(name = "tetris_high_score", nullable = false)
    private int tetrisHighScore = 0; // 최고 점수

    // 테트리스 점수 업데이트 메서드
    public void updateTetrisHighScore(int newScore) {
        if (newScore > this.tetrisHighScore) {
            this.tetrisHighScore = newScore;
        }
    }

    @Transient
    private Map<String, Integer> vectorList;

    @PostLoad
    private void postLoad() {
        if (profileVector != null) {
            this.vectorList = parseJsonArray(profileVector);
        }
    }

    @PrePersist
    @PreUpdate
    private void prePersist() {
        if (vectorList != null) {
            this.profileVector = stringifyJsonArray(vectorList);
        }
    }

    public void updateVectorList(Map<String, Integer> newVectorList) {
        this.vectorList = newVectorList;
        prePersist(); // 변경 사항을 반영하여 JSON 문자열 업데이트
    }

    private Map<String, Integer> parseJsonArray(String jsonArray) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(jsonArray, new TypeReference<Map<String, Integer>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String stringifyJsonArray(Map<String, Integer> jsonArray) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(jsonArray);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
