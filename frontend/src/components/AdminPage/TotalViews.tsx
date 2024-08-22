import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';

const TotalViews: React.FC = () => {
  const [dailyViewCount, setDailyViewCount] = useState<number>(0);

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        // 포트를 8088로 변경
        const response = await axios.get('http://localhost:8088/dashboard/viewCount');
        setDailyViewCount(response.data);
      } catch (error) {
        console.error("Failed to fetch view count:", error);
      }
    };

    fetchViewCount();
  }, []);

  return (
    <div>
      <h2 className={styles.h2}>금일 영상 조회수</h2>
      <p>{dailyViewCount.toLocaleString()}회</p>
    </div>
  );
};

export default TotalViews;
