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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.USERS;
import com.kh.last.service.ProfileService;
import com.kh.last.service.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import com.fasterxml.jackson.core.type.TypeReference;

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

//    @PostMapping("/upload")
//    public ResponseEntity<?> uploadProfileImage(@RequestParam("profileImg") MultipartFile file,
//                                                @RequestParam("profileNo") Long profileNo) {
//        try {
//            String profileImgUrl = profileService.uploadProfileImage(file, profileNo);
//            return ResponseEntity.ok().body(Map.of("success", true, "profileImg", profileImgUrl));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("success", false, "message", e.getMessage()));
//        }
//    }

//    @PutMapping("/update-name")
//    public ResponseEntity<?> updateProfileName(@RequestBody Map<String, String> request) {
//        try {
//            Long profileNo = Long.parseLong(request.get("profileNo"));
//            String profileName = request.get("profileName");
//            profileService.updateProfileName(profileNo, profileName);
//            return ResponseEntity.ok().body(Map.of("success", true));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("success", false, "message", e.getMessage()));
//        }
//    }

    @PostMapping("/update-vector")
    public ResponseEntity<?> updateProfileVector(@RequestBody Map<String, Object> request) {
        try {
            Long profileId = Long.parseLong(request.get("profileId").toString());
            Long movieId = Long.parseLong(request.get("movieId").toString());
            String movieTagsJson = request.get("movieTags").toString();

            // JSON 문자열을 List<String>으로 변환
            ObjectMapper mapper = new ObjectMapper();
            List<String> movieTags = mapper.readValue(movieTagsJson, new TypeReference<List<String>>() {});

            // movieTags를 Map<String, Integer>로 변환
            Map<String, Integer> movieTagsMap = movieTags.stream()
                    .collect(Collectors.toMap(tag -> tag, tag -> 1, (a, b) -> a));

            // ProfileService의 메서드를 호출할 때 movieTagsMap을 전달
            profileService.updateProfileVector(profileId, movieId, movieTagsMap);

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
                    .list(Paths.get("C:/finalProject/FinalProject/frontend/public/profile-images"))
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
                String directory = "C:/finalProject/FinalProject/frontend/public/profile-images";
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
}
