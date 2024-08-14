package com.kh.last.controller;

import com.kh.last.service.SmsService;
import com.kh.last.service.UserService;
import com.kh.last.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    @Autowired
    private SmsService smsService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @PostMapping("/send-code")
    public ResponseEntity<String> sendVerificationCode(@RequestBody PhoneRequest phoneRequest) {
        try {
            smsService.sendVerificationCode(phoneRequest.getPhone());
            return ResponseEntity.ok("인증번호가 휴대폰으로 전송되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("문제가 발생했습니다. 다시 시도해주세요.");
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody VerificationRequest verificationRequest) {
        boolean isVerified = smsService.verifyCode(verificationRequest.getPhone(), verificationRequest.getCode());
        if (isVerified) {
            return ResponseEntity.ok("인증이 완료되었습니다.");
        } else {
            return ResponseEntity.status(400).body("인증번호가 올바르지 않습니다.");
        }
    }

    @GetMapping("/get-email")
    public ResponseEntity<String> getEmailByPhone(@RequestParam String phone) {
        String email = emailService.getEmailByPhone(phone);
        if (email != null) {
            return ResponseEntity.ok(email);
        } else {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            boolean result = userService.changePassword(request.getPhone(), request.getCode(), request.getNewPassword());
            if (result) {
                return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
            } else {
                return ResponseEntity.status(400).body("인증번호가 올바르지 않거나 사용자를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("비밀번호 변경에 실패했습니다.");
        }
    }

    // DTO classes for requests
    public static class PhoneRequest {
        private String phone;
        // Getters and setters
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class ChangePasswordRequest {
        private String phone;
        private String code;
        private String newPassword;

        // Getters and setters
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class VerificationRequest {
        private String phone;
        private String code;
        // Getters and setters
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }
}
