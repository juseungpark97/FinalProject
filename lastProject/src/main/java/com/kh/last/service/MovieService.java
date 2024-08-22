package com.kh.last.service;

import java.io.IOException;
import java.util.List;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.kh.last.model.vo.Movie;
import com.kh.last.repository.MovieRepository;
import com.kh.last.repository.WatchLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final AmazonS3 amazonS3;
    private final MovieRepository movieRepository;
    private final WatchLogRepository watchLogRepository;

    @Value("${aws.s3.bucketName}")
    private String awsS3BucketName;

    public Movie uploadMovie(MultipartFile file, MultipartFile thumbnail, String title, String director, String cast,
            int releaseYear, String synopsis, float rating, String tags) throws IOException {
        // S3 키에 폴더 경로를 포함시킴
        String videoKey = "movies/" + file.getOriginalFilename();
        String thumbnailKey = "thumbnail/" + thumbnail.getOriginalFilename();

        // 비디오 파일의 메타데이터 설정
        ObjectMetadata videoMetadata = new ObjectMetadata();
        videoMetadata.setContentType("video/mp4"); // 비디오 파일의 MIME 타입 설정

        // 썸네일 파일의 메타데이터 설정
        ObjectMetadata thumbnailMetadata = new ObjectMetadata();
        thumbnailMetadata.setContentType("image/jpeg"); // 썸네일 이미지의 MIME 타입 설정

        // S3에 파일 업로드
        amazonS3.putObject(new PutObjectRequest(awsS3BucketName, videoKey, file.getInputStream(), videoMetadata));
        amazonS3.putObject(new PutObjectRequest(awsS3BucketName, thumbnailKey, thumbnail.getInputStream(), thumbnailMetadata));

        // S3 URL 생성
        String videoUrl = amazonS3.getUrl(awsS3BucketName, videoKey).toString();
        String thumbnailUrl = amazonS3.getUrl(awsS3BucketName, thumbnailKey).toString();
        
        // Movie 객체 생성 및 설정
        Movie movie = new Movie();
        movie.setTitle(title);
        movie.setDirector(director);
        movie.setReleaseYear(releaseYear);
        movie.setUrl(videoUrl);
        movie.setThumbnailUrl(thumbnailUrl);
        movie.setRating(rating);
        movie.setGenre(""); // 기본값으로 빈 문자열 설정

        // JSON 문자열로 변환하여 설정
        movie.setTagList(Arrays.asList(tags.split(",")));
        movie.setCastList(Arrays.asList(cast.split(",")));

        // Movie 객체를 저장하고 반환
        return movieRepository.save(movie);
    }

    public List<Movie> findAllMovies() {
        return movieRepository.findAll();
    }

    public List<Movie> findMoviesByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }
    
    public List<Movie> findMoviesByTag(String tag) {
        return movieRepository.findByTagsContaining(tag);
    }

    public List<Movie> findMoviesByCast(String cast) {
        return movieRepository.findByCastContaining(cast);
    }
}
