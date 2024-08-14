package com.kh.last.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import net.nurigo.java_sdk.api.Message;
import net.nurigo.java_sdk.exceptions.CoolsmsException;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SmsService {

    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

    @Value("${coolsms.api_key}")
    private String apiKey;

    @Value("${coolsms.api_secret}")
    private String apiSecret;

    @Value("${coolsms.from}")
    private String from;

    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();

    public void sendVerificationCode(String phoneNumber) throws CoolsmsException {
        String generatedCode = generateVerificationCode();
        Message coolsms = new Message(apiKey, apiSecret);

        HashMap<String, String> params = new HashMap<>();
        params.put("to", phoneNumber); // Ensure this number is in international format
        params.put("from", from); // Ensure this number is registered with CoolSMS
        params.put("type", "sms");
        params.put("text", "인증번호는 [" + generatedCode + "] 입니다.");

        try {
            // Sending the message
            Map<String, String> response = coolsms.send(params);

            // Log response details
            logger.info("SMS send response: {}", response);
        } catch (CoolsmsException e) {
            logger.error("Error sending SMS: {}", e.getMessage());
            throw e;
        }

        // Save the verification code
        verificationCodes.put(phoneNumber, generatedCode);
        logger.info("Sent verification code [{}] to phone number [{}]", generatedCode, phoneNumber);
    }

    public boolean verifyCode(String phoneNumber, String code) {
        String storedCode = verificationCodes.get(phoneNumber);
        if (storedCode != null && storedCode.equals(code)) {
            verificationCodes.remove(phoneNumber);
            logger.info("Verification successful for phone number [{}]", phoneNumber);
            return true;
        }
        logger.warn("Verification failed for phone number [{}]. Expected [{}], but got [{}]", phoneNumber, storedCode, code);
        return false;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 1000 + random.nextInt(9000);
        return Integer.toString(code);
    }
}
