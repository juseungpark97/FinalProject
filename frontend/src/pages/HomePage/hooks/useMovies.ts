import { useState, useEffect, useCallback } from 'react';
import { fetchMovies, fetchRecentMovies, fetchRecommendedMovies } from '../services/api';
import { Movie } from '../services/interfaces';

export const useMovies = (profileNo: number | null) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [mostWatchedGenre, setMostWatchedGenre] = useState<string | null>(null); // 가장 많이 본 장르 상태 추가
  const [moviesByMostWatchedGenre, setMoviesByMostWatchedGenre] = useState<Movie[]>([]); // 해당 장르의 영화들

  useEffect(() => {
    const loadMovies = async () => {
      const movieData = await fetchMovies();
      setMovies(movieData);
      setFilteredMovies(movieData);

      // 가장 많이 본 장르 계산
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

        // 해당 장르의 영화를 필터링
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

  const filterMovies = useCallback((searchTerm: string) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = movies.filter(movie => {
      const titleMatch = movie.title.toLowerCase().includes(lowerCaseSearchTerm);
      const tagMatch = movie.tagList.some(tag => tag.toLowerCase() === lowerCaseSearchTerm);
      return titleMatch || tagMatch;
    });
    setFilteredMovies(filtered);
  }, [movies]);

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
