package com.kh.last.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.USERS;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findByUserNo(USERS user);
    
    long countByUserNo(USERS userNo);
}