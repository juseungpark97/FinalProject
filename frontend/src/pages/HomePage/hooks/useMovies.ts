import { useState, useEffect, useCallback } from 'react';
import { fetchMovies, fetchRecentMovies } from '../services/api';
import { Movie } from '../services/interfaces';

export const useMovies = (profileNo: number | null) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);

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
      loadRecentMovies();
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

  return { movies, filteredMovies, recentMovies, filterMovies };
};
