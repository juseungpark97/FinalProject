import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';

const TotalMovie = () => {
  const [movieAmount, setMovieAmount] = useState(0);

  useEffect(() => {
    const fetchMovieCount = async () => {
      try {
        // 포트를 8088로 변경
        const response = await axios.get('http://localhost:8088/dashboard/movieCount');
        setMovieAmount(response.data);
      } catch (error) {
        console.error("Failed to fetch movie count:", error);
      }
    };

    fetchMovieCount();
  }, []);

  return (
    <div>
      <h2 className={styles.h2}>전체 영화 수</h2>
      <p>{movieAmount.toLocaleString()}편</p>
    </div>
  );
};

export default TotalMovie;