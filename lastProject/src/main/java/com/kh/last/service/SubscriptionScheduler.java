package com.kh.last.service;

import com.kh.last.model.vo.Subscription;
import com.kh.last.repository.SubscriptionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SubscriptionScheduler {

    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionScheduler(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    // 매일 자정마다 구독 상태를 확인하고 만료된 구독을 비활성화
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkSubscriptionStatus() {
        List<Subscription> activeSubscriptions = subscriptionRepository.findAll();
        LocalDate today = LocalDate.now();

        for (Subscription subscription : activeSubscriptions) {
            if (subscription.getEndDate().toLocalDate().isBefore(today)) {
                subscription.setSubStatus("INACTIVE");
                subscriptionRepository.save(subscription);
            }
        }
    }
}