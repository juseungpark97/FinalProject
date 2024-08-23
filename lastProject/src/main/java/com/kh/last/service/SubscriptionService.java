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
			return existingSubscription.get(); // 기존 구독 반환
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
		subscribeUser(email, 1); // 기본적으로 1개월 구독으로 활성화
	}

	public void cancelSubscription(String email) {
		Optional<USERS> optionalUser = userRepository.findByEmail(email);
		if (optionalUser.isPresent()) {
			USERS user = optionalUser.get();
			Optional<Subscription> subscriptionOpt = subscriptionRepository.findByUserUserNoAndSubStatusAndEndDateAfter(
					user.getUserNo(), "ACTIVE", new Date(System.currentTimeMillis()));

			if (subscriptionOpt.isPresent()) {
				Subscription subscription = subscriptionOpt.get();
				subscription.setSubStatus("INACTIVE");
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
				if ("INACTIVE".equals(subscription.getSubStatus())) {
					subscription.setSubStatus("ACTIVE");
					subscriptionRepository.save(subscription);
				} else {
					throw new IllegalStateException("Subscription is already active.");
				}
			} else {
				throw new IllegalStateException("Subscription not found for user: " + email);
			}
		} else {
			throw new IllegalStateException("User not found with email: " + email);
		}
	}

}
