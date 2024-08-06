package com.kh.last.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

<<<<<<< HEAD
=======
import okhttp3.Credentials;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

>>>>>>> origin/main
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

        MediaType JSON = MediaType.get("application/json; charset=utf-8");
        RequestBody requestBody = RequestBody.create(objectMapper.writeValueAsString(body), JSON);
        String credential = Credentials.basic(apiKey, apiSecret);

        Request request = new Request.Builder()
                .url(SMS_URL)
                .post(requestBody)
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", credential)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
        }
    }
}
