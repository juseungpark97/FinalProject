package com.kh.last.controller;

import java.util.List;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.USERS;
import com.kh.last.service.ProfileService;
import com.kh.last.service.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserService userService;

    private final SecretKey key;

    @Autowired
    public ProfileController(UserService userService) {
        this.userService = userService;
        this.key = userService.getKey(); // UserService로부터 SecretKey 주입
    }

    @GetMapping("/user/{userNo}")
    public ResponseEntity<List<Profile>> getProfilesByUserNo(@PathVariable Long userNo) {
        List<Profile> profiles = profileService.getProfilesByUserNo(userNo);
        return ResponseEntity.ok(profiles);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProfile(@RequestParam String profileName, @RequestParam MultipartFile profileImg,
                                           @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
            String email = claims.getSubject();
            USERS user = userService.getUserByEmail(email);
            if (user != null) {
                String profileImgFilename = profileImg.getOriginalFilename(); // 실제로는 파일을 저장해야 합니다.
                Profile newProfile = profileService.createProfile(user.getUserNo(), profileName, profileImgFilename);
                return ResponseEntity.status(HttpStatus.CREATED).body(newProfile);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating profile");
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("profileImg") MultipartFile file,
                                                @RequestParam("profileNo") Long profileNo) {
        try {
            String profileImgUrl = profileService.uploadProfileImage(file, profileNo);
            return ResponseEntity.ok().body(Map.of("success", true, "profileImg", profileImgUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/update-name")
    public ResponseEntity<?> updateProfileName(@RequestBody Map<String, String> request) {
        try {
            Long profileNo = Long.parseLong(request.get("profileNo"));
            String profileName = request.get("profileName");
            profileService.updateProfileName(profileNo, profileName);
            return ResponseEntity.ok().body(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/update-vector")
    public ResponseEntity<?> updateProfileVector(@RequestBody Map<String, Object> request) {
        try {
            Long profileId = Long.parseLong(request.get("profileId").toString());
            Long movieId = Long.parseLong(request.get("movieId").toString()); // movieId 추가
            List<String> movieTags = (List<String>) request.get("movieTags");

            // ProfileService의 메서드를 호출할 때 movieId도 함께 전달
            profileService.updateProfileVector(profileId, movieId, movieTags);

            return ResponseEntity.ok().body(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

}
