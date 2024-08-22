import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';

const TodayVisit = () => {
  const [todayVisit, setTodayVisit] = useState(0);

  useEffect(() => {
    const fetchMovieCount = async () => {
      try {
        // 포트를 8088로 변경
        const response = await axios.get('http://localhost:8088/dashboard/todayVisit');
        setTodayVisit(response.data);
      } catch (error) {
        console.error("Failed to fetch visit count:", error);
      }
    };

    fetchMovieCount();
  }, []);
  return (
    <div>
      <h2 className={styles.h2}>일 방문 수</h2>
      <p>{todayVisit.toLocaleString()}명</p>
    </div>
  );
};

export default TodayVisit;

