package com.kh.last.model.vo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    // 프로필 벡터 필드 추가
    @Column(name = "profile_vector", length = 4000)
    private String profileVector; // 사용자의 선호도를 벡터로 저장
    
    @Column(name = "profile_main", nullable = false, length = 1)
    private String profileMain; // 'M' for Main, 'S' for Sub

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Profile profile = (Profile) o;
        return profileNo != null && profileNo.equals(profile.profileNo);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
