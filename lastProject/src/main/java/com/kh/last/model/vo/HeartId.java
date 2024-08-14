package com.kh.last.model.vo;

import java.io.Serializable;
import java.util.Objects;

public class HeartId implements Serializable {

    private Profile profile;
    private Movie movie;

    // default constructor
    public HeartId() {}

    public HeartId(Profile profile, Movie movie) {
        this.profile = profile;
        this.movie = movie;
    }

    // equals() and hashCode() methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HeartId heartId = (HeartId) o;
        return Objects.equals(profile, heartId.profile) && Objects.equals(movie, heartId.movie);
    }

    @Override
    public int hashCode() {
        return Objects.hash(profile, movie);
    }

    // getters and setters
}
