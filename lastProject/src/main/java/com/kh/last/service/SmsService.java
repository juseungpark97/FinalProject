package com.kh.last.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {
    @Value("${coolsms.api_key}")
    private String apiKey;

    @Value("${coolsms.api_secret}")
    private String apiSecret;

    @Value("${coolsms.from}")
    private String from;

    private static final String SMS_URL = "https://api.coolsms.co.kr/messages/v4/send";

    public void sendVerificationCode(String to, String code) throws IOException {
        OkHttpClient client = new OkHttpClient();
        ObjectMapper objectMapper = new ObjectMapper();

        Map<String, Object> message = new HashMap<>();
        message.put("to", to);
        message.put("from", from);
        message.put("text", "Your verification code is " + code);
        message.put("type", "SMS");

        Map<String, Object> body = new HashMap<>();
        body.put("messages", new Object[]{message});

        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), objectMapper.writeValueAsString(body));
        Request request = new Request.Builder()
            .url(SMS_URL)
            .post(requestBody)
            .addHeader("Content-Type", "application/json")
            .addHeader("Authorization", "Basic " + Credentials.basic(apiKey, apiSecret))
            .build();

        Response response = client.newCall(request).execute();
        if (!response.isSuccessful()) {
            throw new IOException("Unexpected code " + response);
        }
    }
}
