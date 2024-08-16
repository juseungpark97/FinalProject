package com.kh.last.service;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
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
        // DefaultOAuth2UserService를 통해 사용자 정보를 가져옵니다.
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // 카카오에서 제공하는 사용자 정보 추출
        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String email = (String) kakaoAccount.get("email");
        String nickname = (String) profile.get("nickname");

        // USERS 엔티티 저장 또는 업데이트
        USERS user = saveOrUpdateUser(email, nickname);

        // 새로운 DefaultOAuth2User로 사용자 정보 반환
        return new DefaultOAuth2User(oAuth2User.getAuthorities(), attributes, "email");
    }

    private USERS saveOrUpdateUser(String email, String nickname) {
        USERS user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    existingUser.setUsername(nickname); // 프로필 업데이트
                    return existingUser;
                })
                .orElse(new USERS(email, nickname)); // 신규 사용자 생성

        return userRepository.save(user);
    }
}
