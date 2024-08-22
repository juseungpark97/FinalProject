package com.kh.last.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kh.last.model.vo.Faq;
import com.kh.last.model.vo.StopAccount;

@Repository
public interface StopAccountRepository extends JpaRepository<StopAccount, Long> {
    Optional<StopAccount> findByUserNo(Long userNo);

	void deleteByUserNo(Long userNo);
}