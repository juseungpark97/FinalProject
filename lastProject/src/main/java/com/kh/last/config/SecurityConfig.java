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
import com.kh.last.repository.UserRepository;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;

    // 생성자 주입
    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
            .authorizeHttpRequests(authorize -> authorize
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
                .userInfoEndpoint(userInfo -> 
                    userInfo.userService(customOAuth2UserService())
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
    
    @Bean
    public CustomOAuth2UserService customOAuth2UserService() {
        // UserRepository를 주입하여 CustomOAuth2UserService 빈을 생성
        return new CustomOAuth2UserService(userRepository);
    }
}
