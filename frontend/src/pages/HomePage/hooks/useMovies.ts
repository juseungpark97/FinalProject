import { useState, useEffect, useCallback } from 'react';
import { fetchMovies, fetchRecentMovies, fetchRecommendedMovies } from '../services/api';
import { Movie } from '../services/interfaces';

export const useMovies = (profileNo: number | null) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]); // 추천 영화 상태 추가

  useEffect(() => {
    const loadMovies = async () => {
      const movieData = await fetchMovies();
      setMovies(movieData);
      setFilteredMovies(movieData);
    };
    loadMovies();
  }, []);

  useEffect(() => {
    if (profileNo) {
      const loadRecentMovies = async () => {
        const recentMoviesData = await fetchRecentMovies(profileNo);
        setRecentMovies(recentMoviesData);
      };
      const loadRecommendedMovies = async () => { // 추천 영화 로드 함수 추가
        const recommendedMoviesData = await fetchRecommendedMovies(profileNo);
        setRecommendedMovies(recommendedMoviesData);
      };
      loadRecentMovies();
      loadRecommendedMovies(); // 추천 영화 로드
    }
  }, [profileNo]);

  const filterMovies = useCallback((searchTerm: string) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = movies.filter(movie => {
      const titleMatch = movie.title.toLowerCase().includes(lowerCaseSearchTerm);
      const tagMatch = movie.tagList.some(tag => tag.toLowerCase() === lowerCaseSearchTerm);
      return titleMatch || tagMatch;
    });
    setFilteredMovies(filtered);
  }, [movies]);

  return { movies, filteredMovies, recentMovies, recommendedMovies, filterMovies };
};
