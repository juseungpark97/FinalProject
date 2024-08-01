
package com.kh.last.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.last.model.vo.Users;
import com.kh.last.repository.UserRepository;

import java.time.LocalDateTime;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Users createUser(String userId, String email, String password, String status, String birthday, String username, Long vNumber) {
        Users user = new Users();
        user.setUserId(userId);
        user.setEmail(email);
        user.setPassword(password);
        user.setCreatedAt(LocalDateTime.now());
        user.setStatus(status);
        user.setBirthday(birthday);
        user.setUsername(username);
        user.setVNumber(vNumber);

        return userRepository.save(user);
    }
}
