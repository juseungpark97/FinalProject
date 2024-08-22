package com.kh.last.common;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GenreMapping {

    private static final Map<String, List<String>> genreToCategories = new HashMap<>();

    static {
        genreToCategories.put("액션 영화", Arrays.asList("액션", "전쟁", "도시 전쟁", "기술", "극단적", "하이테크", "해적"));
        genreToCategories.put("범죄 영화", Arrays.asList("심리적", "사회적"));
        genreToCategories.put("SF 영화", Arrays.asList("SF", "미래적", "가상 현실", "우주", "미래", "대체 역사", "실험실", "하이테크", "기술"));
        genreToCategories.put("코미디 영화", Arrays.asList("코미디", "패러디", "유머"));
        genreToCategories.put("스릴러 영화", Arrays.asList("스릴러", "서스펜스", "반전", "혼란"));
        genreToCategories.put("공포 영화", Arrays.asList("호러", "심리적", "미스터리"));
        genreToCategories.put("전쟁 영화", Arrays.asList("전쟁", "역사적"));
        genreToCategories.put("판타지 영화", Arrays.asList("판타지", "상상력", "가상 현실", "서정적", "해적"));
        genreToCategories.put("음악 영화", Arrays.asList("음악", "예술적"));
        genreToCategories.put("멜로 영화", Arrays.asList("로맨스", "사랑", "운명", "정서적", "비극적", "우화", "서정적"));
        genreToCategories.put("가족 영화", Arrays.asList("가족", "아동", "관계", "정서적", "우화"));
        genreToCategories.put("다큐멘터리 영화", Arrays.asList("다큐멘터리", "실화", "역사적", "철학적", "자연", "사회적", "다문화", "미래적"));
        genreToCategories.put("드라마 영화", Arrays.asList("드라마", "극복", "실험적", "실화", "미니멀리즘", "서정적", "정서적", "혼란", "노스탤지어", "심리적", "도시"));
    }

    public static Map<String, List<String>> getGenreToCategories() {
        return genreToCategories;
    }
}