package com.kh.last.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.apache.http.auth.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kh.last.model.vo.USERS;
import com.kh.last.repository.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // 보안 키 생성

    public USERS createUser(String userId, String email, String password, String status, String birthday, String username, Long vNumber) {
        USERS user = new USERS();
        user.setUserId(userId);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // 비밀번호 인코딩
        user.setStatus(status);
        user.setBirthday(birthday);
        user.setUsername(username);
        user.setVNumber(vNumber);
        return userRepository.save(user);
    }

    public String loginUser(String email, String password) throws InvalidCredentialsException {
        Optional<USERS> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            USERS user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return generateToken(user);
            }
        }
        throw new InvalidCredentialsException("Invalid email or password");
    }

    private String generateToken(USERS user) {
        long now = System.currentTimeMillis();
        long expirationTime = 1000 * 60 * 60; // 1 hour

        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expirationTime))
                .signWith(key) // 서명에 사용할 키
                .compact();
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public boolean checkPassword(String password) {
        List<USERS> uSERS = userRepository.findAll();
        for (USERS user : uSERS) {
            if (passwordEncoder.matches(password, user.getPassword())) {
                return true;
            }
        }
        return false;
    }
}
