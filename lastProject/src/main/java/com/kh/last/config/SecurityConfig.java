package com.kh.last.config;

import javax.crypto.SecretKey;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .authorizeHttpRequests(authorize -> authorize          
                    .requestMatchers("/paypal/success", "/paypal/cancel").permitAll() // 성공 및 취소 URL 접근 허용
                    .anyRequest().permitAll() // 모든 요청에 대해 인증 필요 없음
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
            );
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecretKey secretKey() {
        // HS256 알고리즘에 맞는 SecretKey를 생성
        return Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }


}
