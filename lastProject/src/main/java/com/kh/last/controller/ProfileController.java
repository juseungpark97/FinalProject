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

    @GetMapping("/{profileNo}")
    public ResponseEntity<Profile> getProfileById(@PathVariable Long profileNo) {
        Profile profile = profileService.getProfileById(profileNo);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(profile);
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
                String directory = "C:/Users/user1/Desktop/ll/FinalProject/frontend/public/profile-images";
                String profileImgFilename = profileImg.getOriginalFilename();
                Path imagePath = Paths.get(directory, profileImgFilename);
                Files.write(imagePath, profileImg.getBytes());
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

    @PutMapping("/{profileNo}/update-image")
    public ResponseEntity<?> updateProfileImage(@PathVariable Long profileNo, @RequestParam("imageName") String imageName) {
        try {
            // 데이터베이스에서 프로필 정보 가져오기
            Profile profile = profileService.getProfileById(profileNo);
            if (profile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
            }
            
            // 프로필 이미지 경로 업데이트
            String imagePath = "/profile-images/" + imageName;
            profile.setProfileImg(imagePath);

            // DB 업데이트
            profileService.updateProfile(profile);

            return ResponseEntity.ok(Map.of("success", true, "profileImg", profile.getProfileImg()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", e.getMessage()));
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
    
    @PutMapping("/{profileNo}/lock")
    public ResponseEntity<?> lockProfile(@PathVariable Long profileNo, @RequestBody Map<String, String> request) {
        try {
            String password = request.get("password");
            if (password == null || password.length() != 4) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Password must be 4 digits"));
            }

            Profile profile = profileService.getProfileById(profileNo);
            if (profile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
            }

            profile.setLocked(true);
            profile.setProfilePwd(Integer.parseInt(password));

            profileService.updateProfile(profile);

            return ResponseEntity.ok(Map.of("success", true, "message", "Profile locked successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "Error locking profile"));
        }
    }
    
    @PostMapping("/{profileNo}/verify-password")
    public ResponseEntity<?> verifyProfilePassword(@PathVariable Long profileNo, @RequestBody Map<String, String> request) {
        String password = request.get("password");
        Profile profile = profileService.getProfileById(profileNo);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Profile not found"));
        }

        // 비밀번호 검증
        if (profile.isLocked() && profile.getProfilePwd() == Integer.parseInt(password)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Password verified successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Invalid password"));
        }
    }
    @PutMapping("/{profileNo}/unlock")
    public ResponseEntity<?> unlockProfile(@PathVariable Long profileNo) {
        try {
            Profile profile = profileService.getProfileById(profileNo);
            if (profile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
            }

            // 프로필 잠금 해제
            profile.setLocked(false);  // 잠금 해제
            profile.setProfilePwd(null);  // 비밀번호 초기화

            profileService.updateProfile(profile);

            return ResponseEntity.ok(Map.of("success", true, "message", "Profile unlocked successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "Error unlocking profile"));
        }
    }
 
}
