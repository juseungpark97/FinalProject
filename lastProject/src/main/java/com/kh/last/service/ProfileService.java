package com.kh.last.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.last.model.vo.Movie;
import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.USERS;
import com.kh.last.model.vo.WatchLog;
import com.kh.last.repository.MovieRepository;
import com.kh.last.repository.ProfileRepository;
import com.kh.last.repository.UserRepository;
import com.kh.last.repository.WatchLogRepository;

@Service
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
	
	// 프로필 벡터 업데이트

    // 프로필 벡터 업데이트
    public void updateProfileVector(Long profileId, Long movieId, List<String> movieTags) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid movie ID"));

        // 이미 이 영화를 시청했는지 확인
        boolean hasWatched = watchLogRepository.findByProfileAndMovie(profile, movie).isPresent();
        
//        // 이미 시청한 영화라면 벡터를 업데이트하지 않음 (해당 부분을 상황에 따라 변경 가능)
//        if (hasWatched) {
//            return;
//        }

        // 시청 기록 추가 (시청 시간이 필요 없다면 0으로 기본 설정)
        WatchLog watchLog = new WatchLog(profile, movie, java.time.LocalDateTime.now(), 0);
        watchLogRepository.save(watchLog);

        // 기존 프로필 벡터를 맵 형태로 변환하여 유지
        Map<String, Integer> vectorMap = parseProfileVector(profile.getProfileVector());

        // 새로운 영화의 태그들을 벡터에 반영
        for (String tag : movieTags) {
            vectorMap.put(tag, vectorMap.getOrDefault(tag, 0) + 1);
        }

        // 맵을 다시 벡터 형태로 변환하여 저장
        String updatedVector = vectorMap.entrySet().stream()
                .map(entry -> entry.getKey() + ":" + entry.getValue())
                .collect(Collectors.joining(","));

        profile.setProfileVector(updatedVector);
        profileRepository.save(profile);
    }

    private Map<String, Integer> parseProfileVector(String profileVector) {
        Map<String, Integer> vectorMap = new HashMap<>();
        if (profileVector != null && !profileVector.isEmpty()) {
            String[] tagsArray = profileVector.split(",");
            for (String tagEntry : tagsArray) {
                String[] tagCount = tagEntry.split(":");
                if (tagCount.length == 2) {
                    try {
                        String tag = tagCount[0];
                        int count = Integer.parseInt(tagCount[1]);
                        vectorMap.put(tag, count);
                    } catch (NumberFormatException e) {
                        // 잘못된 형식이 있을 경우 로그 기록 후 무시 (또는 예외 처리)
                        System.err.println("Invalid vector entry: " + tagEntry);
                    }
                }
            }
        }
        return vectorMap;
    }
}