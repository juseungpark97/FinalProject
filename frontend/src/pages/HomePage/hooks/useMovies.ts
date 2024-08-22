import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { fetchMovies, fetchRecentMovies, fetchRecommendedMovies } from '../services/api';
import { Movie } from '../services/interfaces';

export const useMovies = (profileNo: number | null) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [mostWatchedGenre, setMostWatchedGenre] = useState<string | null>(null);
  const [moviesByMostWatchedGenre, setMoviesByMostWatchedGenre] = useState<Movie[]>([]);

  const predefinedTags = useMemo(() => [
    '드라마', '로맨스', '코미디', '스릴러', '미스터리', '호러', '액션', 'SF', '판타지',
    '다큐멘터리', '어드벤처', '우화', '다문화', '가족', '음악', '해적', '심리적', '비극적',
    '극복', '서스펜스', '정서적', '사랑', '운명', '실화', '철학적', '형이상학적', '패러디',
    '반전', '서정적', '상상력', '유머', '혼란', '노스탤지어', '실험적', '미니멀리즘', '예술적',
    '하이테크', '가상 현실', '미래적', '고전', '전쟁', '역사적', '대체 역사', '미래', '도시',
    '자연', '실험실', '우주', '도시 전쟁', '기술', '사회적', '심리전', '성장', '관계',
    '극단적', '아동'
  ], []);

  useEffect(() => {
    const loadMovies = async () => {
      const movieData = await fetchMovies();
      setMovies(movieData);
      setFilteredMovies(movieData);

      const genreCount: Record<string, number> = {};
      movieData.forEach((movie: Movie) => {
        movie.tagList.forEach((tag) => {
          genreCount[tag] = (genreCount[tag] || 0) + 1;
        });
      });

      const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
      if (sortedGenres.length > 0) {
        const topGenre = sortedGenres[0][0];
        setMostWatchedGenre(topGenre);

        const moviesByGenre = movieData.filter((movie: Movie) =>
          movie.tagList.includes(topGenre)
        );
        setMoviesByMostWatchedGenre(moviesByGenre);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    if (profileNo) {
      const loadRecentMovies = async () => {
        const recentMoviesData = await fetchRecentMovies(profileNo);
        setRecentMovies(recentMoviesData);
      };

      const loadRecommendedMovies = async () => {
        const recommendedMoviesData = await fetchRecommendedMovies(profileNo);
        setRecommendedMovies(recommendedMoviesData);
      };

      loadRecentMovies();
      loadRecommendedMovies();
    }
  }, [profileNo]);

  const filterMovies = useCallback(async (searchTerm: string) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = movies.filter(movie => {
      const titleMatch = movie.title.toLowerCase().includes(lowerCaseSearchTerm);
      const tagMatch = movie.tagList.some(tag => tag.toLowerCase() === lowerCaseSearchTerm);
      return titleMatch || tagMatch;
    });
    setFilteredMovies(filtered);

    // 태그가 predefinedTags에 있는지 확인하고, 있으면 프로필 벡터를 업데이트
    if (predefinedTags.includes(searchTerm)) {
      try {
        // 태그와 관련된 영화를 가져옵니다. 여기서는 첫 번째 영화를 예시로 사용합니다.
        const relatedMovie = filtered[0];

        if (relatedMovie) {
          await axios.post('http://localhost:8088/api/profiles/update-vector', {
            profileId: profileNo,
            movieId: relatedMovie.id, // 선택된 영화 ID
            movieTags: JSON.stringify([searchTerm]), // 태그를 전송
          });

          console.log('Profile vector updated successfully');
        }
      } catch (error) {
        console.error('Error updating profile vector:', error);
      }
    }
  }, [movies, predefinedTags, profileNo]);

  return {
    movies,
    filteredMovies,
    recentMovies,
    recommendedMovies,
    filterMovies,
    mostWatchedGenre,
    moviesByMostWatchedGenre
  };
};
