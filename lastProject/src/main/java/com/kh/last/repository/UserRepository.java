package com.kh.last.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kh.last.model.vo.USERS;

import java.util.Optional;

public interface UserRepository extends JpaRepository<USERS, Long> {
    Optional<USERS> findByEmail(String email);
}
