package com.kh.last.model.vo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@IdClass(WatchLogId.class)
public class WatchLog {

    @Id
    @ManyToOne
    @JoinColumn(name ="profile_no", nullable = false)
    private Profile profile;

    @Id
    @ManyToOne
    @JoinColumn(name ="movie_id", nullable = false)
    private Movie movie;

    @Column(name = "viewed_at", nullable = false)
    private LocalDateTime viewedAt;

    @Column(name = "progress_time", nullable = false)
    private Float progressTime; // 시청 진행 시간 (초 단위)

    public WatchLog() {
    }

    public WatchLog(Profile profile, Movie movie, LocalDateTime viewedAt, Float progressTime) {
        this.profile = profile;
        this.movie = movie;
        this.viewedAt = viewedAt;
        this.progressTime = progressTime;
    }
}
