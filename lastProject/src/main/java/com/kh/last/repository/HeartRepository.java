package com.kh.last.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kh.last.model.vo.Heart;
import com.kh.last.model.vo.HeartId;
import com.kh.last.model.vo.Movie;
import com.kh.last.model.vo.Profile;

@Repository
public interface HeartRepository extends JpaRepository<Heart, HeartId> {

    @Query("SELECT h FROM Heart h WHERE h.id.profile = :profile AND h.id.movie = :movie")
    Heart findByProfileAndMovie(@Param("profile") Profile profile, @Param("movie") Movie movie);
    
    @Query("SELECT h.movie FROM Heart h WHERE h.profile.profileNo = :profileNo")
    List<Movie> findLikedMoviesByProfileNo(@Param("profileNo") Long profileNo);
}
