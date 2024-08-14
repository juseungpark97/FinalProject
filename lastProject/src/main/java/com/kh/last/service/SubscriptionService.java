package com.kh.last.service;

import com.kh.last.model.vo.USERS;
import com.kh.last.model.vo.Subscription;
import com.kh.last.repository.SubscriptionRepository;
import com.kh.last.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean isUserSubscribed(String email) {
        // 사용자 조회
        Optional<USERS> optionalUser = userRepository.findByEmail(email);
        if (!optionalUser.isPresent()) {
            return false;
        }

        USERS user = optionalUser.get();

        // 현재 날짜를 기준으로 활성화된 구독을 찾음
        return subscriptionRepository.findByUserUserNoAndSubStatusAndEndDateAfter(
                user.getUserNo(),
                "ACTIVE",
                new Date(System.currentTimeMillis())
        ).isPresent();
    }

    public synchronized Subscription subscribeUser(String email, int months) {
        USERS user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // 유저가 이미 활성 구독을 가지고 있는지 확인
        Optional<Subscription> existingSubscription = subscriptionRepository.findByUserUserNoAndSubStatusAndEndDateAfter(
                user.getUserNo(),
                "ACTIVE",
                new Date(System.currentTimeMillis())
        );

        if (existingSubscription.isPresent()) {
            return existingSubscription.get();  // 기존 구독 반환
        }

        // 새로운 구독 생성
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStartDate(Date.valueOf(LocalDate.now()));
        subscription.setEndDate(Date.valueOf(LocalDate.now().plusMonths(months)));
        subscription.setSubStatus("ACTIVE");
        subscriptionRepository.save(subscription);

        System.out.println(months + " months subscription confirmed for user " + user.getEmail());
        return subscription;
    }


    public void activateSubscription(String email) {
        subscribeUser(email, 1);  // 기본적으로 1개월 구독으로 활성화
    }
}
