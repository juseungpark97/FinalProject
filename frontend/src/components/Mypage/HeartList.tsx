import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './css/MyPage.module.css';  // 스타일을 임포트합니다.

interface Movie {
    id: number;
    title: string;
    thumbnailUrl: string;
}

const HeartList: React.FC<{ profileNo: number }> = ({ profileNo }) => {
    const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikedMovies = async () => {
            try {
                const response = await axios.get(`http://localhost:8088/api/myPage/liked-movies`, {
                    params: { profileNo }
                });
                console.log("Fetched liked movies:", response.data); // 응답 데이터 확인
                setLikedMovies(response.data); // 응답 데이터가 영화 목록 배열이라고 가정
            } catch (error) {
                console.error('Failed to fetch liked movies', error);
            }
        };

        fetchLikedMovies();
    }, [profileNo]);

    // 영화 클릭 시, MovieDetailPage로 이동하는 함수
    const handleMovieClick = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };

    return (
        <div className={styles.myPage}>
            <h2>내가 좋아한 영상</h2>
            <ul className={styles.quickLinks}>
                {likedMovies.length > 0 ? (
                    likedMovies.map(movie => (
                        <li
                            key={movie.id}
                            className={styles.menuLink}
                            onClick={() => handleMovieClick(movie.id)}  // 영화 클릭 시 이동
                        >
                            <img src={movie.thumbnailUrl} alt={movie.title} className={styles.thumbnail} />
                            <div>{movie.title}</div>
                        </li>
                    ))
                ) : (
                    <p>좋아요한 영상이 없습니다.</p>
                )}
            </ul>
        </div>
    );
};

export default HeartList;