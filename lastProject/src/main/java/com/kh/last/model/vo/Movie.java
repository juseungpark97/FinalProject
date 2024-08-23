package com.kh.last.model.vo;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@SequenceGenerator(name = "movie_seq", sequenceName = "seq_movie_no", allocationSize = 1)
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "movie_seq")
    private Long id;

    private String title;
    private String director;
    private int releaseYear;
    private String url;
    private String thumbnailUrl;
    private float rating;
    private String genre;
    private String status;

    @Lob
    private String tags;

    @Transient
    private List<String> tagList;

    @Lob
    private String cast;

    @Transient
    private List<String> castList;
    
    @Column(name = "view_count")
    private Long viewCount;

    @PostLoad
    private void postLoad() {
        if (tags != null) {
            this.tagList = parseJsonArray(tags);
        }
        if (cast != null) {
            this.castList = parseJsonArray(cast);
        }
    }

    @PrePersist
    @PreUpdate
    private void prePersist() {
        if (tagList != null) {
            this.tags = stringifyJsonArray(tagList);
        }
        if (castList != null) {
            this.cast = stringifyJsonArray(castList);
        }
        if (this.status == null) {
            this.status = "A"; // 엔티티 생성 시 기본값 설정
        }
    }

    private List<String> parseJsonArray(String jsonArray) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(jsonArray, new TypeReference<List<String>>(){});
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String stringifyJsonArray(List<String> jsonArray) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(jsonArray);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Movie movie = (Movie) o;
        return id != null && id.equals(movie.id);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
