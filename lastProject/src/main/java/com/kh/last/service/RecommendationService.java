package com.kh.last.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.last.model.vo.Movie;
import com.kh.last.model.vo.Profile;
import com.kh.last.repository.MovieRepository;
import com.kh.last.repository.ProfileRepository;

import java.util.Arrays;

@Service
public class RecommendationService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getRecommendations(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));

        String profileVector = profile.getProfileVector();

        List<Movie> recommendations = new ArrayList<>();
        for (Movie movie : movieRepository.findAll()) {
            String movieTags = movie.getTags();
            double similarity = calculateCosineSimilarity(profileVector, movieTags);
            if (similarity > 0.1) {  // 임계치 예시
                recommendations.add(movie);
            }
        }
        return recommendations;
    }

    private double calculateCosineSimilarity(String profileVector, String movieTags) {
        // 프로필 벡터와 영화 태그 벡터를 벡터화
    	List<String> allTags = Arrays.asList("코미디", "기술", "미스터리", "액션");
        int[] profileVectorArray = vectorize(profileVector, allTags);
        int[] movieVectorArray = vectorize(movieTags, allTags);
        
        // 코사인 유사도 계산
        double dotProduct = 0.0;
        double profileMagnitude = 0.0;
        double movieMagnitude = 0.0;
        
        for (int i = 0; i < profileVectorArray.length; i++) {
            dotProduct += profileVectorArray[i] * movieVectorArray[i];
            profileMagnitude += Math.pow(profileVectorArray[i], 2);
            movieMagnitude += Math.pow(movieVectorArray[i], 2);
        }
        
        profileMagnitude = Math.sqrt(profileMagnitude);
        movieMagnitude = Math.sqrt(movieMagnitude);
        
        if (profileMagnitude == 0 || movieMagnitude == 0) {
            return 0.0;
        }
        
        return dotProduct / (profileMagnitude * movieMagnitude);
    }

    private int[] vectorize(String vectorString, List<String> allTags) {
        int[] vector = new int[allTags.size()];
        List<String> tags = Arrays.asList(vectorString.split(","));
        
        for (int i = 0; i < allTags.size(); i++) {
            if (tags.contains(allTags.get(i))) {
                vector[i] = 1;
            } else {
                vector[i] = 0;
            }
        }
        
        return vector;
    }
}
