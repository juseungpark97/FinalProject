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

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    http
	        .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
	        .authorizeHttpRequests(authorize -> authorize
	            .anyRequest().permitAll() // 모든 요청 허용
	        )
	        .oauth2Login(oauth2 -> oauth2
	            .loginPage("/login") // 사용자 정의 로그인 페이지
	            .defaultSuccessUrl("/home", true) // OAuth2 로그인 성공 후 리디렉션 경로
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
    
    @Bean
    public SecretKey secretKey() {
        // HS256 알고리즘에 맞는 SecretKey를 생성
        return Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }
}
