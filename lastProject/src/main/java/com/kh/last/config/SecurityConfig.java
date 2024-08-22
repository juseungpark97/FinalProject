package com.kh.last.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.kh.last.service.CustomOAuth2UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/login", "/oauth2/authorization/**").permitAll() // 로그인 및 OAuth2 인증 URL 접근 허용
                .anyRequest().authenticated() // 다른 모든 요청은 인증 필요
            )
            .formLogin(form -> form
                .loginPage("/login") // 사용자 정의 로그인 페이지
                .defaultSuccessUrl("/home", true) // 로그인 성공 후 리디렉션 경로
                .failureUrl("/login?error=true") // 로그인 실패 시 리디렉션 경로
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/login") // 사용자 정의 로그인 페이지
                .defaultSuccessUrl("/home", true) // 로그인 성공 후 리디렉션 경로
                .failureUrl("/login?error=true") // 로그인 실패 시 리디렉션 경로
                .authorizationEndpoint(authorization ->
                    authorization.baseUri("/oauth2/authorization") // OAuth2 인증 요청 기본 URI
                )
                .redirectionEndpoint(redirection ->
                    redirection.baseUri("/oauth2/callback") // OAuth2 리디렉션 엔드포인트
                )
                .userInfoEndpoint(userInfo ->
                    userInfo.userService(customOAuth2UserService()) // 사용자 정보 서비스 설정
                )
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 비밀번호 인코더
    }

    @Bean
    public CustomOAuth2UserService customOAuth2UserService() {
        return new CustomOAuth2UserService(); // CustomOAuth2UserService를 빈으로 등록
    }
}
