package com.kh.last.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
                // 이미지 저장 로직
                String directory = "C:/Users/user1/Desktop/ll/FinalProject/frontend/public/profile-images";
                String profileImgFilename = profileImg.getOriginalFilename();
                Path imagePath = Paths.get(directory, profileImgFilename);
                Files.write(imagePath, profileImg.getBytes());

                // 이미지 경로를 '/profile-images/파일명' 형식으로 저장
                String imagePathToStore = "/profile-images/" + profileImgFilename;
                Profile newProfile = profileService.createProfile(user.getUserNo(), profileName, imagePathToStore);

                return ResponseEntity.status(HttpStatus.CREATED).body(newProfile);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating profile");
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

    @PostMapping("/{profileNo}/select-image")
    public ResponseEntity<String> selectProfileImage(@PathVariable Long profileNo, @RequestParam String imageName) {
        try {
            String profileImgPath = profileService.selectProfileImage(profileNo, imageName);
            return ResponseEntity.ok(profileImgPath);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/available-images")
    public ResponseEntity<List<String>> getAvailableImages() {
        try {
            List<String> imageNames = Files
                    .list(Paths.get("C:/Users/user1/Desktop/ll/FinalProject/frontend/public/profile-images"))
                    .map(path -> path.getFileName().toString()).collect(Collectors.toList());
            return ResponseEntity.ok(imageNames);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestParam("profileNo") Long profileNo,
                                           @RequestParam("profileName") String profileName,
                                           @RequestParam(value = "profileImg", required = false) MultipartFile profileImg) {
        try {
            // 프로필 가져오기
            Profile profile = profileService.getProfileById(profileNo);
            if (profile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
            }

            // 프로필 이름 업데이트
            profile.setProfileName(profileName);

            // 프로필 이미지 업데이트
            if (profileImg != null && !profileImg.isEmpty()) {
                // 이미지 저장 로직 (이미지 경로 설정 및 저장)
                String directory = "C:/Users/user1/Desktop/ll/FinalProject/frontend/public/profile-images";
                Path imagePath = Paths.get(directory, profileImg.getOriginalFilename());
                Files.write(imagePath, profileImg.getBytes());
                profile.setProfileImg("/profile-images/" + profileImg.getOriginalFilename());
            }

            // DB 업데이트
            profileService.updateProfile(profile);

            return ResponseEntity.ok(Map.of("success", true, "profileImg", profile.getProfileImg(), "profileName", profileName));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{profileNo}")
    public ResponseEntity<?> deleteProfile(@PathVariable Long profileNo) {
        try {
            profileService.deleteProfile(profileNo);
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Profile deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "Error deleting profile"));
        }
    }
}
