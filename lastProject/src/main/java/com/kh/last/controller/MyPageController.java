package com.kh.last.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.last.model.vo.Subscription;
import com.kh.last.service.MyPageService;


@RestController
@RequestMapping("/api/myPage")
public class MyPageController {

    private final MyPageService myPageService;

    public MyPageController(MyPageService myPageService) {
        this.myPageService = myPageService;
    }

    @GetMapping("/subscription-date")
    public ResponseEntity<Subscription> getSubscriptionDate(@RequestHeader("Authorization") String token) {
        Optional<Subscription> subscription = myPageService.getSubscriptionDetails(token);
        return subscription.map(ResponseEntity::ok)
                           .orElseGet(() -> ResponseEntity.notFound().build());
    }

}