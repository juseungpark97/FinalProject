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

    public List<Profile> getProfilesByUserNo(Long userNo) {
        USERS user = userRepository.findById(userNo).orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        return profileRepository.findByUserNo(user);
    }

    public Profile createProfile(Long userNo, String profileName, String profileImg) {
        USERS user = userRepository.findById(userNo).orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        Profile profile = new Profile();
        profile.setUserNo(user);
        profile.setProfileName(profileName);
        profile.setProfileImg(profileImg);
        return profileRepository.save(profile);
    }

    public String selectProfileImage(Long profileNo, String selectedImageName) {
        // 지정된 디렉토리에서 이미지 선택
        String directory = "C:/Users/user1/Desktop/ll/FinalProject/frontend/public/profile-images";
        Path imagePath = Paths.get(directory, selectedImageName);

        if (!Files.exists(imagePath)) {
            throw new RuntimeException("Selected image not found in the directory");
        }

        // 데이터베이스에서 프로필을 찾아 이미지 경로 업데이트
        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setProfileImg("/profile-images/" + selectedImageName);
        profileRepository.save(profile);

        return profile.getProfileImg();
    }


    public Profile getProfileById(Long profileNo) {
        return profileRepository.findById(profileNo).orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public void updateProfile(Profile profile) {
        profileRepository.save(profile);
    }

    // 새로운 메서드 추가: 프로필 이미지 업로드
    public String uploadProfileImage(MultipartFile file, Long profileNo) throws Exception {
        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));

        String directory = "C:/Users/user1/Desktop/ll/FinalProject/frontend/public/profile-images";
        Path imagePath = Paths.get(directory, file.getOriginalFilename());
        Files.write(imagePath, file.getBytes());

        String profileImgUrl = "/profile-images/" + file.getOriginalFilename();
        profile.setProfileImg(profileImgUrl);
        profileRepository.save(profile);

        return profileImgUrl;
    }

    // 새로운 메서드 추가: 프로필 이름 업데이트
    public void updateProfileName(Long profileNo, String profileName) {
        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));
        profile.setProfileName(profileName);
        profileRepository.save(profile);
    }

    
    @Transactional
    public void updateProfileVector(Long profileId, Long movieId, Map<String, Integer> movieTags) {
        // 프로필 찾기
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));

        // 영화 찾기
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid movie ID"));
        
        // 시청 로그가 없는 경우 새로 추가
        boolean hasWatched = watchLogRepository.findByProfileAndMovie(profile, movie).isPresent();
        if (!hasWatched) {
            WatchLog watchLog = new WatchLog(profile, movie, java.time.LocalDateTime.now(), 0);
            watchLogRepository.save(watchLog);
        }

        // 기존 벡터를 완전히 대체하는 방식으로 업데이트
        try {
            // 새로운 태그 정보를 사용해 프로필 벡터를 업데이트
            String updatedVector = new ObjectMapper().writeValueAsString(movieTags);
            System.out.println(updatedVector);
            profile.setProfileVector(updatedVector);
            
            // 엔티티 저장
            profileRepository.save(profile);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting vector to JSON", e);
        }
    }


    private Map<String, Integer> parseProfileVector(String profileVector) {
        if (profileVector == null || profileVector.isEmpty()) {
            return new HashMap<>(); // 빈 맵 반환
        }
        try {
            return new ObjectMapper().readValue(profileVector, new TypeReference<Map<String, Integer>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing profile vector", e);
        }
    }

}