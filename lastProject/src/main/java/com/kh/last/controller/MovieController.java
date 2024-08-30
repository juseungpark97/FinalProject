package com.kh.last.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kh.last.model.vo.Heart;
import com.kh.last.model.vo.HeartId;
import com.kh.last.model.vo.Movie;
import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.WatchLog;
import com.kh.last.repository.HeartRepository; // 추가
import com.kh.last.repository.MovieRepository;
import com.kh.last.repository.ProfileRepository; // 추가
import com.kh.last.repository.WatchLogRepository;
import com.kh.last.service.MovieService;

import edu.emory.mathcs.backport.java.util.Collections;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/movies")
public class MovieController {
    private final MovieService movieService;
    private final MovieRepository movieRepository;
    private final HeartRepository heartRepository; // 추가
    private final ProfileRepository profileRepository; // 추가
    private final WatchLogRepository watchLogRepository; // 추가
    
    @PostMapping("/upload")
    public Movie uploadMovie(
            @RequestParam("file") MultipartFile file,
            @RequestParam("thumbnail") MultipartFile thumbnail,
            @RequestParam("title") String title,
            @RequestParam("director") String director,
            @RequestParam("cast") String cast,
            @RequestParam("releaseYear") int releaseYear,
            @RequestParam("synopsis") String synopsis,
            @RequestParam("rating") float rating,
            @RequestParam("tags") String tags) throws IOException {

        return movieService.uploadMovie(file, thumbnail, title, director, cast, releaseYear, synopsis, rating, tags);
    }

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.findAllMovies();
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable("id") Long id) {
        Optional<Movie> movie = movieRepository.findById(id);
        if (movie.isPresent()) {
            return movie.get();
        } else {
            throw new ResourceNotFoundException("Movie not found with id " + id);
        }
    }
    
    @GetMapping("/tag")
    public List<Movie> getMoviesByTag(@RequestParam("tag") String tag) {
        return movieService.findMoviesByTag(tag);
    }

    @GetMapping("/cast")
    public List<Movie> getMoviesByCast(@RequestParam("cast") String cast) {
        return movieService.findMoviesByCast(cast);
    }
    
    @PostMapping("/toggle-like")
    public ResponseEntity<?> toggleLike(@RequestParam Long movieId, @RequestParam Long profileNo) {
        System.out.println("MovieId: " + movieId);
        System.out.println("ProfileNo: " + profileNo);

        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id " + profileNo));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id " + movieId));

        HeartId heartId = new HeartId(profile, movie);
        Optional<Heart> heartOpt = heartRepository.findById(heartId);

        if (heartOpt.isPresent()) {
            heartRepository.delete(heartOpt.get());
        } else {
            Heart heart = new Heart(profile, movie);
            heartRepository.save(heart);
        }

        return ResponseEntity.ok().build(); // 응답을 반환합니다.
    }
    @Transactional
    @PostMapping("/watchlog")
    public ResponseEntity<Void> addOrUpdateWatchLog(
            @RequestParam Long movieId,
            @RequestParam Long profileNo,
            @RequestParam Float progressTime) {  // 시청 시간을 추가로 받음

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id " + movieId));
        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id " + profileNo));

        Optional<WatchLog> existingLog = watchLogRepository.findByProfileAndMovie(profile, movie);

        WatchLog watchLog = existingLog.orElseGet(() -> new WatchLog(profile, movie, LocalDateTime.now(), progressTime));
        watchLog.setProgressTime(progressTime);
        watchLog.setViewedAt(LocalDateTime.now()); // 업데이트된 시간으로 갱신
        watchLogRepository.save(watchLog);

        return ResponseEntity.ok().build();
    }

    
    @GetMapping("/watchlog")
    public ResponseEntity<Float> getWatchLog(
            @RequestParam Long movieId,
            @RequestParam Long profileNo) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id " + movieId));
        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id " + profileNo));

        Optional<WatchLog> watchLog = watchLogRepository.findByProfileAndMovie(profile, movie);
        if (watchLog.isPresent()) {
            return ResponseEntity.ok(watchLog.get().getProgressTime()); // 시청 시간 반환
        } else {
            return ResponseEntity.ok(0f); // 시청 기록이 없으면 0 반환
        }
    }

    
    @GetMapping("/recent-movies")
    public ResponseEntity<List<Movie>> getRecentMovies(@RequestParam Long profileNo) {
        List<Movie> recentMovies = watchLogRepository.findRecentMoviesByProfile(profileNo);
        
        // status가 'A'인 영화만 필터링
        List<Movie> filteredMovies = recentMovies.stream()
                .filter(movie -> "A".equals(movie.getStatus()))
                .collect(Collectors.toList());

        if (filteredMovies.isEmpty()) {
            Logger logger = LoggerFactory.getLogger(MovieController.class);
            logger.info("No recent movies found for profileNo: {}", profileNo); // 로그 출력
            return ResponseEntity.ok(Collections.emptyList()); // 빈 목록 반환
        }

        return ResponseEntity.ok(filteredMovies); // 200 OK 응답
    }
   
}
