package com.kh.last.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.last.model.vo.Member;

public interface MemberRepository extends JpaRepository<Member, String> {
	boolean existsByEmail(String email);
	Optional<Member> findByEmail(String email);
	
}