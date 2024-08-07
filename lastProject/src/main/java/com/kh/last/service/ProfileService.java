package com.kh.last.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.kh.last.model.vo.Profile;
import com.kh.last.repository.ProfileRepository;
import com.kh.last.repository.UserRepository;

import jakarta.annotation.PostConstruct;

@Service
public class ProfileService {
    private final Path fileStorageLocation = Paths.get("profile-images").toAbsolutePath().normalize();

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public Profile createProfile(Long userNo, MultipartFile file, String name) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (fileName.contains("..")) {
                throw new RuntimeException(fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Profile profile = new Profile();
            profile.setImage(fileName);
            profile.setName(name);
            profile.setUser(userRepository.findById(userNo).orElseThrow(() -> new RuntimeException("User not found")));
            return profileRepository.save(profile);
        } catch (Exception ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public List<Profile> getProfilesByUserId(Long userNo) {
        return profileRepository.findByUserUserNo(userNo);
    }
}