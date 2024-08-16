package com.kh.last.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}