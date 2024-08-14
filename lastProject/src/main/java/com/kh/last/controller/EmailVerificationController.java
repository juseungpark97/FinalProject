package com.kh.last.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/email")
public class EmailVerificationController {

    @Autowired
    private JavaMailSender emailSender;

    private Map<String, String> verificationCodes = new HashMap<>();

    @PostMapping("/send-code")
    public void sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = generateVerificationCode();
        verificationCodes.put(email, code);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("이메일 인증 코드");
        message.setText("인증 코드: " + code);
        emailSender.send(message);
    }

    @PostMapping("/verify-code")
    public Map<String, Boolean> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        Map<String, Boolean> response = new HashMap<>();
        response.put("verified", code.equals(verificationCodes.get(email)));
        return response;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
    
    @PostMapping("/send-subscribe-success")
    public void sendSubscribeSuccessEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("구독 성공");
        message.setText("CinemaCloud 구독이 성공적으로 완료되었습니다. 감사합니다!");

        emailSender.send(message);
    }
}
