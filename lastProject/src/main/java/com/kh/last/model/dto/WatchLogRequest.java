package com.kh.last.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatchLogRequest {
    private Long movieId;
    private Long profileNo;
    private Float progressTime;
}
