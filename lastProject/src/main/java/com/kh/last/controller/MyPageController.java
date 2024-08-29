package com.kh.last.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.last.model.vo.Movie;
import com.kh.last.model.vo.Subscription;
import com.kh.last.repository.HeartRepository;
import com.kh.last.service.MyPageService;


@RestController
@RequestMapping("/api/myPage")
public class MyPageController {

    private final MyPageService myPageService;
    private final HeartRepository heartRepository;

    public MyPageController(MyPageService myPageService, HeartRepository heartRepository){
        this.myPageService = myPageService;
        this.heartRepository = heartRepository;
    }

    @GetMapping("/subscription-date")
    public ResponseEntity<Subscription> getSubscriptionDate(@RequestHeader("Authorization") String token) {
        Optional<Subscription> subscription = myPageService.getSubscriptionDetails(token);
        return subscription.map(ResponseEntity::ok)
                           .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/liked-movies")
    public ResponseEntity<List<MovieDTO>> getLikedMovies(@RequestParam Long profileNo) {
        // 좋아요한 영화 목록 조회
        List<Movie> movies = heartRepository.findLikedMoviesByProfileNo(profileNo);

        if (movies.isEmpty()) {
            return ResponseEntity.noContent().build(); // 좋아요한 영화가 없으면 204 응답
        }

        // Movie 엔터티를 DTO로 변환
        List<MovieDTO> movieDTOs = movies.stream()
            .map(movie -> new MovieDTO(movie.getId(), movie.getTitle(), movie.getThumbnailUrl()))
            .collect(Collectors.toList());

        return ResponseEntity.ok(movieDTOs); // 200 OK 응답
    }

    // MovieDTO 내부 클래스 정의
    private static class MovieDTO {
        private Long id;
        private String title;
        private String thumbnailUrl;

        public MovieDTO(Long id, String title, String thumbnailUrl) {
            this.id = id;
            this.title = title;
            this.thumbnailUrl = thumbnailUrl;
        }

        // Getter 메소드들
        public Long getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public String getThumbnailUrl() {
            return thumbnailUrl;
        }
    }
}