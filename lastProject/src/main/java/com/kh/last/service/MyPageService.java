package com.kh.last.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.last.model.vo.Subscription;
import com.kh.last.model.vo.USERS;
import com.kh.last.repository.SubscriptionRepository;
import com.kh.last.repository.UserRepository;

@Service
public class MyPageService {

	@Autowired
	private SubscriptionRepository subscriptionRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserService userService;

	public Optional<Subscription> getSubscriptionDetails(String token) {
		String email = userService.getEmailFromToken(token);
		if (email == null) {
			return Optional.empty();
		}

		USERS user = userRepository.findByEmail(email).orElse(null);
		if (user == null) {
			return Optional.empty();
		}

		return subscriptionRepository.findByUserUserNo(user.getUserNo());
	}

	/**
	 * 사용자의 구독을 해지하는 메서드
	 * 
	 * @param token JWT 토큰
	 * @return 구독 해지가 성공하면 true, 실패하면 false
	 */
	public boolean cancelSubscription(String token) {
		String email = userService.getEmailFromToken(token);
		if (email == null) {
			return false;
		}

		USERS user = userRepository.findByEmail(email).orElse(null);
		if (user == null) {
			return false;
		}

		Optional<Subscription> subscriptionOpt = subscriptionRepository.findByUserUserNo(user.getUserNo());
		if (subscriptionOpt.isPresent()) {
			Subscription subscription = subscriptionOpt.get();
			subscription.setSubStatus("DEACTIVE");
			subscriptionRepository.save(subscription);
			return true;
		}

		return false;
	}
}