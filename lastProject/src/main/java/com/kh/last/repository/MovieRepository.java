package com.kh.last.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kh.last.model.dto.MovieViewDTO;
import com.kh.last.model.vo.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

	List<Movie> findByGenre(String genre);

	List<Movie> findByTagsContaining(String tag);

	// JSON 문자열 형태의 필드에서 특정 값을 포함하는지 확인하는 메서드
	List<Movie> findByCastContaining(String cast);

	@Query("SELECT new com.kh.last.model.dto.MovieViewDTO(" + "m.id, " + // Long
			"m.title, " + // String
			"m.director, " + // String
			"m.releaseYear, " + // Integer
			"m.rating, " + // Double
			"m.tags, " + // String
			"m.cast, " + // String
			"m.status, " + // String			
			"(SELECT COUNT(w) FROM WatchLog w WHERE w.movie.id = m.id) "
			+ // Long
			") " + "FROM Movie m ORDER BY ID DESC")
	List<MovieViewDTO> findAllMoviesAndView();

	@Query("SELECT new com.kh.last.model.dto.MovieViewDTO(" + 
	        "m.id, " + 
	        "m.title, " + 
	        "m.director, " + 
	        "m.releaseYear, " + 
	        "m.rating, " + 
	        "m.tags, " + 
	        "m.cast, " + 
	        "m.status, " + 
	        "(SELECT COUNT(w) FROM WatchLog w WHERE w.movie.id = m.id AND w.viewedAt BETWEEN :startDate AND :endDate) viewCount " + 
	        ") " + 
	        "FROM Movie m " +
	        "WHERE (SELECT COUNT(w) FROM WatchLog w WHERE w.movie.id = m.id AND w.viewedAt BETWEEN :startDate AND :endDate) >= 1 " +
	        "ORDER BY viewCount DESC")
	Page<MovieViewDTO> findMoviesWithViewCountAbove100(@Param("startDate") LocalDateTime startDate,
	                                                   @Param("endDate") LocalDateTime endDate,
	                                                   Pageable pageable);
	
	List<Movie> findByStatus(String status);
}