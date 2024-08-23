package com.kh.last.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.last.model.vo.Movie;
import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.USERS;
import com.kh.last.model.vo.WatchLog;
import com.kh.last.repository.MovieRepository;
import com.kh.last.repository.ProfileRepository;
import com.kh.last.repository.UserRepository;
import com.kh.last.repository.WatchLogRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private WatchLogRepository watchLogRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<Profile> getProfilesByUserNo(Long userNo) {
        USERS user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        return profileRepository.findByUserNo(user);
    }


    public Profile createProfile(Long userNo, String profileName, String profileImg) {
        USERS user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        
        // 사용자별 첫 번째 프로필은 'M', 그 외 프로필은 'S'로 설정
        String profileMain = profileRepository.countByUserNo(user) == 0 ? "M" : "S";
        
        Profile profile = new Profile();
        profile.setUserNo(user);
        profile.setProfileName(profileName);
        profile.setProfileImg(profileImg);
        profile.setProfileMain(profileMain);
        
        return profileRepository.save(profile);
    }
    
    @Transactional
    public void deleteProfile(Long profileNo) {
        Profile profile = profileRepository.findById(profileNo)
            .orElseThrow(() -> new RuntimeException("Profile not found"));

        if ("M".equals(profile.getProfileMain())) {
            throw new RuntimeException("Main profile cannot be deleted");
        }

        // 프로필과 관련된 모든 시청 기록 삭제
        watchLogRepository.deleteByProfile(profile);

        // 프로필 삭제
        profileRepository.delete(profile);
    }



    public String selectProfileImage(Long profileNo, String selectedImageName) {
        String directory = "C:/Users/hyejin/Desktop/FinalProject/frontend/public/profile-images";
        Path imagePath = Paths.get(directory, selectedImageName);

        if (!Files.exists(imagePath)) {
            throw new RuntimeException("Selected image not found in the directory");
        }

        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setProfileImg("/profile-images/" + selectedImageName);
        profileRepository.save(profile);

        return profile.getProfileImg();
    }




    public Profile getProfileById(Long profileNo) {
        return profileRepository.findById(profileNo)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }


    public void updateProfile(Profile profile) {
        profileRepository.save(profile);
    }


    public String uploadProfileImage(MultipartFile file, Long profileNo) throws Exception {
        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));

        String directory = "C:/Users/hyejin/Desktop/FinalProject/frontend/public/profile-images";
        Path imagePath = Paths.get(directory, file.getOriginalFilename());
        Files.write(imagePath, file.getBytes());

        String profileImgUrl = "/profile-images/" + file.getOriginalFilename();
        profile.setProfileImg(profileImgUrl);
        profileRepository.save(profile);

        return profileImgUrl;
    }


    public void updateProfileName(Long profileNo, String profileName) {
        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));
        profile.setProfileName(profileName);
        profileRepository.save(profile);
    }


    @Transactional
    public void updateProfileVector(Long profileId, Long movieId, Map<String, Integer> movieTags) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid movie ID"));

        boolean hasWatched = watchLogRepository.findByProfileAndMovie(profile, movie).isPresent();

        if (!hasWatched) {
            WatchLog watchLog = new WatchLog(profile, movie, java.time.LocalDateTime.now(), 0);
            watchLogRepository.save(watchLog);
        }

        Map<String, Integer> vectorMap = parseProfileVector(profile.getProfileVector());

        for (Map.Entry<String, Integer> entry : movieTags.entrySet()) {
            vectorMap.put(entry.getKey(), vectorMap.getOrDefault(entry.getKey(), 0) + entry.getValue());
        }

        try {
            String updatedVector = new ObjectMapper().writeValueAsString(vectorMap);
            profile.updateVectorList(vectorMap); // Use updateVectorList to ensure profileVector is updated
            profileRepository.save(profile);

            entityManager.flush(); // Force flush to ensure the change is written to the database
            entityManager.clear(); // Clear the persistence context to avoid caching issues
        } catch (JsonProcessingException e) {
            log.error("Error converting vector to JSON", e);
            throw new RuntimeException("Error converting vector to JSON", e);
        }
    }

    private Map<String, Integer> parseProfileVector(String profileVector) {
        if (profileVector == null || profileVector.isEmpty()) {
            return new HashMap<>();
        }
        try {
            return new ObjectMapper().readValue(profileVector, new TypeReference<Map<String, Integer>>() {});
        } catch (JsonProcessingException e) {
            log.error("Error parsing profile vector", e);
            throw new RuntimeException("Error parsing profile vector", e);
        }
    }
    
    public void lockProfile(Long profileNo, String password) {
        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));

        // 비밀번호 길이 검증은 컨트롤러에서 처리
        profile.setLocked(true);
        profile.setProfilePwd(Integer.parseInt(password));  // 비밀번호 저장 (해시 처리를 고려해야 함)

        profileRepository.save(profile);
    }

}
