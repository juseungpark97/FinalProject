package com.kh.last.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.last.model.vo.Movie;
import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.WatchLog;
import com.kh.last.model.vo.WatchLogId;

public interface WatchLogRepository extends JpaRepository<WatchLog, WatchLogId> {
    void deleteByProfileAndMovie(Profile profile, Movie movie);

    List<WatchLog> findAllByProfileOrderByViewedAtDesc(Profile profile);
    
    @Query("SELECT wl.movie FROM WatchLog wl WHERE wl.profile.id = :profileId ORDER BY wl.viewedAt DESC")
    List<Movie> findRecentMoviesByProfile(@Param("profileId") Long profileId);
    
    Optional<WatchLog> findByProfileAndMovie(Profile profile, Movie movie);
}
