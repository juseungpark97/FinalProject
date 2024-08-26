package com.kh.last.service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.last.model.vo.Subscription;
import com.kh.last.model.vo.USERS;
import com.kh.last.repository.SubscriptionRepository;
import com.kh.last.repository.UserRepository;

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
		return subscriptionRepository.findByUserUserNoAndSubStatusAndEndDateAfter(user.getUserNo(), "ACTIVE",
				new Date(System.currentTimeMillis())).isPresent();
	}

	public synchronized Subscription subscribeUser(String email, int months) {
	    USERS user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalStateException("User not found"));

	    // 유저가 이미 활성 구독을 가지고 있는지 확인
	    Optional<Subscription> existingSubscription = subscriptionRepository
	            .findByUserUserNoAndSubStatusAndEndDateAfter(user.getUserNo(), "ACTIVE",
	                    new Date(System.currentTimeMillis()));

	    if (existingSubscription.isPresent()) {
	        Subscription subscription = existingSubscription.get();
	        if (subscription.isCancelled()) {
	            throw new IllegalStateException("Subscription is cancelled and cannot be renewed.");
	        }
	        return subscription; // 기존 구독 반환
	    }

	    // 새로운 구독 생성
	    Subscription subscription = new Subscription();
	    subscription.setUser(user);
	    subscription.setStartDate(Date.valueOf(LocalDate.now()));
	    subscription.setEndDate(Date.valueOf(LocalDate.now().plusMonths(months)));
	    subscription.setSubStatus("ACTIVE");
	    subscription.setCancelled(false); // 구독이 활성화되면 취소 상태 해제
	    subscriptionRepository.save(subscription);

	    System.out.println(months + " months subscription confirmed for user " + user.getEmail());
	    return subscription;
	}
	public void cancelSubscription(String email) {
	    Optional<USERS> optionalUser = userRepository.findByEmail(email);
	    if (optionalUser.isPresent()) {
	        USERS user = optionalUser.get();
	        Optional<Subscription> subscriptionOpt = subscriptionRepository.findByUserUserNoAndSubStatusAndEndDateAfter(
	                user.getUserNo(), "ACTIVE", new Date(System.currentTimeMillis()));

	        if (subscriptionOpt.isPresent()) {
	            Subscription subscription = subscriptionOpt.get();           
	            subscription.setCancelled(true);   // 사용자가 해지했음을 나타내는 플래그
	            subscriptionRepository.save(subscription);
	        } else {
	            throw new IllegalStateException("Active subscription not found for user: " + email);
	        }
	    } else {
	        throw new IllegalStateException("User not found with email: " + email);
	    }
	}

	public boolean canUserAccessService(String email) {
		Optional<USERS> optionalUser = userRepository.findByEmail(email);
		if (!optionalUser.isPresent()) {
			return false;
		}

		USERS user = optionalUser.get();

		// 사용자의 구독 상태와 종료 날짜를 확인
		Optional<Subscription> subscriptionOpt = subscriptionRepository.findByUserUserNo(user.getUserNo());

		if (subscriptionOpt.isPresent()) {
			Subscription subscription = subscriptionOpt.get();
			// INACTIVE 상태이더라도 종료일이 현재 날짜 이후라면 접근 허용
			if (subscription.getEndDate().toLocalDate().isAfter(LocalDate.now())) {
				return true;
			}
		}

		return false; // 접근 불가
	}

	public void reactivateSubscription(String email) {
	    Optional<USERS> optionalUser = userRepository.findByEmail(email);
	    if (optionalUser.isPresent()) {
	        USERS user = optionalUser.get();
	        Optional<Subscription> subscriptionOpt = subscriptionRepository.findByUserUserNo(user.getUserNo());

	        if (subscriptionOpt.isPresent()) {
	            Subscription subscription = subscriptionOpt.get();
	            if ("INACTIVE".equals(subscription.getSubStatus()) || subscription.isCancelled()) {
	                subscription.setCancelled(false); // 구독 재활성화 시 취소 상태를 해제
	                subscriptionRepository.save(subscription);
	            } else {
	                throw new IllegalStateException("Subscription is already active and not cancelled.");
	            }
	        } else {
	            throw new IllegalStateException("Subscription not found for user: " + email);
	        }
	    } else {
	        throw new IllegalStateException("User not found with email: " + email);
	    }
	}
	public void checkAndExpireSubscriptions() {
	    List<Subscription> subscriptions = subscriptionRepository.findAll();
	    LocalDate today = LocalDate.now();

	    for (Subscription subscription : subscriptions) {
	        if (subscription.getEndDate().toLocalDate().isBefore(today) && "ACTIVE".equals(subscription.getSubStatus())) {
	            subscription.setSubStatus("INACTIVE");  // 만료된 구독을 INACTIVE로 변경
	            subscriptionRepository.save(subscription);
	        }
	    }
	}

}
