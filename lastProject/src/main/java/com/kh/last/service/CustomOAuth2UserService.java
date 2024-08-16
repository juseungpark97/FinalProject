package com.kh.last.service;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.stereotype.Service;

import com.kh.last.model.vo.USERS;
import com.kh.last.repository.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        String provider = userRequest.getClientRegistration().getRegistrationId(); // "kakao"인지 확인
        String email = null;
        String username = null;

        if (provider.equals("kakao")) {
            // 카카오 계정 정보에서 email과 nickname 가져오기
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            email = (String) kakaoAccount.get("email");
            username = (String) profile.get("nickname");
        }

        // 이메일로 사용자 검색
        Optional<USERS> userOptional = userRepository.findByEmail(email);
        USERS user;

        if (userOptional.isPresent()) {
            // 기존 사용자 업데이트
            user = userOptional.get();
            user.setUsername(username);
        } else {
            // 새로운 사용자 생성
            user = new USERS();
            user.setEmail(email);
            user.setUsername(username);
            user.setRole("user");
            user.setStatus("A"); // 상태를 활성화로 설정 (A)
        }

        userRepository.save(user); // 사용자 정보 저장

        Set<OAuth2UserAuthority> authorities = Collections.singleton(new OAuth2UserAuthority(oAuth2User.getAttributes()));
        return new DefaultOAuth2User(authorities, oAuth2User.getAttributes(), "email");
    }
}
