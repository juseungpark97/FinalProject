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

// 추천 영화를 가져오는 API 함수 추가
export const fetchRecommendedMovies = async (profileNo: number): Promise<Movie[]> => {
    try {
        const response = await axios.get(`http://localhost:8088/api/recommendations/${profileNo}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recommended movies:', error);
        return [];
    }
};
