package com.kh.last.repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.last.model.vo.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    // 특정 사용자의 활성화된 구독을 조회하는 메서드
    Optional<Subscription> findByUserUserNoAndSubStatusAndEndDateAfter(Long userNo, String subStatus, Date currentDate);

    Optional<Subscription> findByUserUserNo(Long userNo);
    List<Subscription> findAllBySubStatus(String subStatus);
}