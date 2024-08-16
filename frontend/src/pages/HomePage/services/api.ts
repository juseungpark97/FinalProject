// src/pages/HomePage/services/api.ts

import axios from 'axios';
import { Movie } from './interfaces';

export const fetchMovies = async (): Promise<Movie[]> => {
    try {
        const response = await axios.get('http://localhost:8088/api/movies');
        return response.data.map((movie: any) => ({
            ...movie,
            tagList: movie.tagList || [],
        }));
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};

export const fetchRecentMovies = async (profileNo: number): Promise<Movie[]> => {
    try {
        const response = await axios.get(`http://localhost:8088/api/movies/recent-movies?profileNo=${profileNo}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent movies:', error);
        return [];
    }
};
