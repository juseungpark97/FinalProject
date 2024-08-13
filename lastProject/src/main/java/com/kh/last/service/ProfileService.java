package com.kh.last.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.USERS;
import com.kh.last.repository.ProfileRepository;
import com.kh.last.repository.UserRepository;

@Service
public class ProfileService {
	@Autowired
	private ProfileRepository profileRepository;

	@Autowired
	private UserRepository userRepository;

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
		String directory = "C:/Users/user1/Desktop/ll/FinalProject/lastProject/profile-images";
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

	// 닉네임 변경
	public void updateProfileName(Long profileNo, String profileName) {
		Profile profile = profileRepository.findById(profileNo)
				.orElseThrow(() -> new RuntimeException("Profile not found"));
		profile.setProfileName(profileName);
		profileRepository.save(profile);
	}

	public String updateProfileImage(Long profileNo, MultipartFile profileImg) throws java.io.IOException {
		Profile profile = profileRepository.findById(profileNo)
				.orElseThrow(() -> new RuntimeException("Profile not found"));

		// 이미지 저장 경로 설정
		String directory = "C:/Users/user1/Desktop/ll/FinalProject/lastProject/profile-images";
		Path imagePath = Paths.get(directory, profileImg.getOriginalFilename());

		// 이미지 저장
		Files.write(imagePath, profileImg.getBytes());

		// 프로필에 새로운 이미지 경로 설정 및 저장
		profile.setProfileImg(profileImg.getOriginalFilename());
		profileRepository.save(profile);

		return profileImg.getOriginalFilename();
	}
}