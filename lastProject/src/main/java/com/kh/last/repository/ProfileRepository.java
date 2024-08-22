package com.kh.last.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.USERS;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findByUserNo(USERS user);
    
    @Query("SELECT p FROM Profile p WHERE p.userNo.role <> :role AND p.userNo.status <> :status")
    List<Profile> findProfilesByUserRoleNotAndStatusNot(@Param("role") String role, @Param("status") String status);
}