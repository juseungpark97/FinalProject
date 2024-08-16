package com.kh.last.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.last.model.vo.Movie;
import com.kh.last.model.vo.Profile;
import com.kh.last.repository.MovieRepository;
import com.kh.last.repository.ProfileRepository;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    // 고정된 태그 리스트
    private static final List<String> ALL_TAGS = Arrays.asList(
        "드라마", "로맨스", "코미디", "스릴러", "미스터리", "호러", "액션", "SF", "판타지",
        "다큐멘터리", "어드벤처", "우화", "다문화", "가족", "음악", "해적", "심리적", "비극적",
        "극복", "서스펜스", "정서적", "사랑", "운명", "실화", "철학적", "형이상학적", "패러디",
        "반전", "서정적", "상상력", "유머", "혼란", "노스탤지어", "실험적", "미니멀리즘", "예술적",
        "하이테크", "가상 현실", "미래적", "고전", "전쟁", "역사적", "대체 역사", "미래", "도시",
        "자연", "실험실", "우주", "도시 전쟁", "기술", "사회적", "심리전", "성장", "관계",
        "극단적", "아동"
    );

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getRecommendations(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid profile ID"));

        // 프로필 벡터 생성
        int[] profileVector = createVectorFromTags(profile.getProfileVector());

        logger.info("Profile vector array: {}", Arrays.toString(profileVector));

        List<Movie> recommendations = new ArrayList<>();

        for (Movie movie : movieRepository.findAll()) {
            // 영화 벡터 생성
            int[] movieVector = createVectorFromTags(movie.getTags());

            logger.info("Processing movie: {}", movie.getTitle());
            logger.info("Movie vector array: {}", Arrays.toString(movieVector));

            double similarity = calculateCosineSimilarity(profileVector, movieVector);

            logger.info("Calculated similarity: {} for movie: {}", similarity, movie.getTitle());

            if (similarity > 0.1) { // 임계치 설정
                recommendations.add(movie);
            }
        }

        logger.info("Final recommendations: {}", recommendations.stream().map(Movie::getTitle).collect(Collectors.toList()));
        return recommendations;
    }

    private int[] createVectorFromTags(String tagsString) {
        int[] vector = new int[ALL_TAGS.size()];
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<String> tags = mapper.readValue(tagsString, new TypeReference<List<String>>() {});
            
            // 태그 데이터를 Map으로 변환
            Map<String, Integer> tagFrequency = tags.stream()
                .collect(Collectors.toMap(
                    tag -> tag, 
                    tag -> 1, 
                    Integer::sum
                ));

            // 고정된 태그 리스트 순서에 맞게 벡터 값을 채움
            for (int i = 0; i < ALL_TAGS.size(); i++) {
                vector[i] = tagFrequency.getOrDefault(ALL_TAGS.get(i), 0);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return vector;
    }


    // 코사인 유사도 계산 함수
    private double calculateCosineSimilarity(int[] vector1, int[] vector2) {
        double dotProduct = 0.0;
        double magnitude1 = 0.0;
        double magnitude2 = 0.0;

        for (int i = 0; i < vector1.length; i++) {
            dotProduct += vector1[i] * vector2[i];
            magnitude1 += Math.pow(vector1[i], 2);
            magnitude2 += Math.pow(vector2[i], 2);
        }

        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);

        if (magnitude1 == 0 || magnitude2 == 0) {
            return 0.0;
        }

        return dotProduct / (magnitude1 * magnitude2);
    }
}
