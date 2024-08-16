package com.kh.last.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.last.model.vo.Movie;
import com.kh.last.model.vo.Profile;
import com.kh.last.repository.MovieRepository;
import com.kh.last.repository.ProfileRepository;

@Service
public class RecommendationService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private MovieRepository movieRepository;

    private static final List<String> ALL_TAGS = Arrays.asList(
        "드라마", "로맨스", "코미디", "스릴러", "미스터리", "호러", "액션", "SF", "판타지",
        "다큐멘터리", "어드벤처", "우화", "다문화", "가족", "음악", "해적", "심리적", "비극적",
        "극복", "서스펜스", "정서적", "사랑", "운명", "실화", "철학적", "형이상학적", "패러디",
        "반전", "서정적", "상상력", "유머", "혼란", "노스탤지어", "실험적", "미니멀리즘", "예술적",
        "하이테크", "가상 현실", "미래적", "고전", "전쟁", "역사적", "대체 역사", "미래", "도시",
        "자연", "실험실", "우주", "도시 전쟁", "기술", "사회적", "심리전", "성장", "관계",
        "극단적", "아동"
    );

    public List<Movie> getRecommendations(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));

        Map<String, Integer> profileTags = parseJsonToMap(profile.getProfileVector());

        List<Movie> recommendations = new ArrayList<>();
        for (Movie movie : movieRepository.findAll()) {
            List<String> movieTags = parseJsonToList(movie.getTags());
            double similarity = calculateCosineSimilarity(profileTags, movieTags);
            if (similarity > 0.1) {  // 임계치 예시
                recommendations.add(movie);
            }
        }
        return recommendations;
    }

    private double calculateCosineSimilarity(Map<String, Integer> profileTags, List<String> movieTags) {
        int[] profileVector = createVectorFromTags(profileTags);
        int[] movieVector = createVectorFromTags(movieTags);

        double dotProduct = 0.0;
        double profileMagnitude = 0.0;
        double movieMagnitude = 0.0;

        // Compute dot product and magnitudes
        for (int i = 0; i < profileVector.length; i++) {
            dotProduct += profileVector[i] * movieVector[i];
            profileMagnitude += Math.pow(profileVector[i], 2);
            movieMagnitude += Math.pow(movieVector[i], 2);
        }

        profileMagnitude = Math.sqrt(profileMagnitude);
        movieMagnitude = Math.sqrt(movieMagnitude);

        // Debugging output
        System.out.println("Dot Product: " + dotProduct);
        System.out.println("Profile Magnitude: " + profileMagnitude);
        System.out.println("Movie Magnitude: " + movieMagnitude);

        if (profileMagnitude == 0 || movieMagnitude == 0) {
            System.out.println("One of the vectors has zero magnitude, returning similarity of 0.0");
            return 0.0;  // Avoid division by zero
        }

        double similarity = dotProduct / (profileMagnitude * movieMagnitude);
        System.out.println("Raw Cosine Similarity: " + similarity);

        // Ensure similarity is within [0, 1]
        double clampedSimilarity = Math.min(Math.max(similarity, 0.0), 1.0);
        System.out.println("Clamped Cosine Similarity: " + clampedSimilarity);
        
        return clampedSimilarity;
    }


    private int[] createVectorFromTags(Map<String, Integer> tags) {
        int[] vector = new int[ALL_TAGS.size()];
        for (int i = 0; i < ALL_TAGS.size(); i++) {
            vector[i] = tags.getOrDefault(ALL_TAGS.get(i), 0);
        }
        return vector;
    }

    private int[] createVectorFromTags(List<String> tags) {
        int[] vector = new int[ALL_TAGS.size()];
        for (int i = 0; i < ALL_TAGS.size(); i++) {
            vector[i] = tags.contains(ALL_TAGS.get(i)) ? 1 : 0;
        }
        return vector;
    }

    private Map<String, Integer> parseJsonToMap(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(json, new TypeReference<Map<String, Integer>>() {});
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new HashMap<>();  // Return empty map on error
        }
    }

    private List<String> parseJsonToList(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ArrayList<>();  // Return empty list on error
        }
    }
}
