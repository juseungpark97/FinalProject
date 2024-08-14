package com.kh.last.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.apache.velocity.exception.ResourceNotFoundException;
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
    public ResponseEntity<Void> addWatchLog(
            @RequestParam Long movieId,
            @RequestParam Long profileNo) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id " + movieId));
        Profile profile = profileRepository.findById(profileNo)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id " + profileNo));

        // 최근 시청 로그 삭제
        watchLogRepository.deleteByProfileAndMovie(profile, movie);

        // 새로운 시청 로그 추가
        WatchLog watchLog = new WatchLog(profile, movie, LocalDateTime.now());
        watchLogRepository.save(watchLog);

        return ResponseEntity.ok().build();
    }

    @Transactional
    @DeleteMapping("/watchlog")
    public ResponseEntity<Void> deleteWatchLog(
            @RequestParam Long movieId,
            @RequestParam Long profileNo) {
        try {
            Movie movie = movieRepository.findById(movieId)
                    .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id " + movieId));
            Profile profile = profileRepository.findById(profileNo)
                    .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id " + profileNo));

            watchLogRepository.deleteByProfileAndMovie(profile, movie);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // 예외 로그를 기록하고 500 오류를 반환합니다.
            System.err.println("Error deleting watch log: " + e.getMessage());
            e.printStackTrace(); // 스택 트레이스를 출력하여 문제를 파악합니다.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/recent-movies")
    public ResponseEntity<List<Movie>> getRecentMovies(@RequestParam Long profileNo) {
        List<Movie> recentMovies = watchLogRepository.findRecentMoviesByProfile(profileNo);
        if (recentMovies == null || recentMovies.isEmpty()) {
            return ResponseEntity.notFound().build(); // 404 Not Found 응답
        }
        return ResponseEntity.ok(recentMovies); // 200 OK 응답
    }

    
}
