package com.kh.last.model.vo;

import java.io.Serializable;
import java.util.Objects;

public class WatchLogId implements Serializable {
   
   private Profile profile;
   private Movie movie;
   
   public WatchLogId() {}
   
   public WatchLogId(Profile profile, Movie movie) {
      this.profile = profile;
      this.movie = movie;
   }
   
   @Override
   public boolean equals(Object o) {
      if (this == o) return true;
      if (o == null || getClass() != o.getClass()) return false;
      WatchLogId watchLogId = (WatchLogId) o;
      return Objects.equals(profile, watchLogId.profile) && Objects.equals(movie, watchLogId.movie);
      
   }
   
   @Override
   public int hashCode() {
      return Objects.hash(profile, movie);
   }

}

