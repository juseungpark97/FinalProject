package com.kh.last.config;

import javax.crypto.SecretKey;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.kh.last.service.CustomOAuth2UserService;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
            .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers("/paypal/success", "/paypal/cancel").permitAll() // 성공 및 취소 URL 접근 허용
                    .requestMatchers("/login", "/oauth2/authorization/**").permitAll() // 로그인 및 OAuth2 인증 요청 허용
                    .anyRequest().authenticated() // 나머지 요청은 인증 필요
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
                    redirection.baseUri("/login/oauth2/code/{registrationId}") // OAuth2 리디렉션 엔드포인트
                )
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService) // 사용자 정의 OAuth2UserService 등록
                )
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecretKey secretKey() {
        return Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }
}
