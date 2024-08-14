package com.kh.last.controller;

import com.kh.last.model.vo.Movie;
import com.kh.last.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/{profileId}")
    public List<Movie> getRecommendations(@PathVariable Long profileId) {
        return recommendationService.getRecommendations(profileId);
    }
}
