package com.kh.last.service;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.last.model.vo.USERS;
import com.kh.last.repository.UserRepository;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        // 사용자 정보를 가져오는 로직을 직접 구현
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        // 카카오에서 제공하는 사용자 정보 추출
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String kakaoId = String.valueOf(attributes.get("id")); // 카카오 고유 ID 가져오기

        // USERS 엔티티 저장 또는 업데이트
        USERS user = saveOrUpdateUser(kakaoId);

        // 새로운 DefaultOAuth2User로 사용자 정보 반환
        return new DefaultOAuth2User(oAuth2User.getAuthorities(), attributes, "id");
    }

    private USERS saveOrUpdateUser(String kakaoId) {
        USERS user = userRepository.findByEmail(kakaoId)
                .map(existingUser -> {
                    // 필요시 추가 업데이트 작업
                    return existingUser;
                })
                .orElse(new USERS(kakaoId, kakaoId)); // 신규 사용자 생성

        return userRepository.save(user);
    }
}
