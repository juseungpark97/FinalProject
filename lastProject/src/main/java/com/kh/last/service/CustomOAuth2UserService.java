package com.kh.last.service;


import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.kh.last.model.vo.USERS;
import com.kh.last.repository.UserRepository;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = "id"; // 카카오는 사용자 ID를 기준으로

        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) ((Map<String, Object>) attributes.get("kakao_account")).get("email");
        String nickname = (String) ((Map<String, Object>) attributes.get("properties")).get("nickname");

        USERS user = saveOrUpdateUser(email, nickname);

        return new DefaultOAuth2User(
            Collections.singleton(new SimpleGrantedAuthority(user.getRole())),
            attributes,
            userNameAttributeName
        );
    }

    private USERS saveOrUpdateUser(String email, String nickname) {
        Optional<USERS> optionalUser = userRepository.findByEmail(email);
        USERS user;
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            user.setUsername(nickname); // 기존 사용자 정보를 업데이트할 수 있음
        } else {
            user = new USERS();
            user.setEmail(email);
            user.setUsername(nickname);
            user.setPassword(""); // 카카오 로그인에는 패스워드가 없으므로 빈 문자열로 설정
            user.setRole("user");
            user.setCreatedAt(LocalDateTime.now());
        }
        return userRepository.save(user);
    }
}
