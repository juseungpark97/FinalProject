package com.kh.last.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.last.model.vo.USERS;

public interface UserRepository extends JpaRepository<USERS, Long> {
    Optional<USERS> findByEmail(String email);

    Optional<USERS> findByPhone(String phone);
    
    List<USERS> findByRoleNotAndStatusNot(String role, String status);
}
