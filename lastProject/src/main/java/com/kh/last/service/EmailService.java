package com.kh.last.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.kh.last.model.vo.USERS;
import com.kh.last.repository.UserRepository;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private UserRepository userRepository;

    public void sendSubscriptionConfirmationEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Subscription Confirmation");
        message.setText("Your subscription has been successfully processed.");
        mailSender.send(message);
    }
    public String getEmailByPhone(String phone) {
        USERS user = userRepository.findByPhone(phone).orElse(null);
        return user != null ? user.getEmail() : null;
    }
}