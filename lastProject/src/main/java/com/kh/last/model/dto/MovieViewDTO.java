package com.kh.last.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor // 모든 필드를 포함하는 생성자 추가
@NoArgsConstructor
public class MovieViewDTO {
	private Long movieId;
	private String title;
	private String director;
	private int releaseYear;
	private float rating;
	private String tags;
	private String cast;
	private String status;
	private Long viewCount;
}
