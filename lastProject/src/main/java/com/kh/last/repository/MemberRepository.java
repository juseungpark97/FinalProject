package com.kh.last.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.last.model.vo.Member;

public interface MemberRepository extends JpaRepository<Member, String> {
}