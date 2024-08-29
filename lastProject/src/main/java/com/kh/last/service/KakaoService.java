package com.kh.last.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class KakaoService {

    public String getKakaoUserEmail(String accessToken) {
        String requestUrl = "https://kapi.kakao.com/v2/user/me";

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        // HttpEntity에 헤더 추가
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // RestTemplate을 사용해 카카오 API 호출
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(requestUrl, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                // JSON 응답을 파싱하여 이메일 추출
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode kakaoAccountNode = rootNode.path("kakao_account");

                if (kakaoAccountNode.path("is_email_valid").asBoolean() && kakaoAccountNode.path("is_email_verified").asBoolean()) {
                    return kakaoAccountNode.path("email").asText();
                } else {
                    return null; // 이메일이 유효하지 않거나 인증되지 않았을 때 처리
                }
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        } else {
            return null; // 요청이 실패했을 때 처리
        }
    }
}
