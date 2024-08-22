import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';

const TotalUsers = () => {
  const [totalUsers, settotalUsers] = useState(0);

  useEffect(() => {
    const fetchMovieCount = async () => {
      try {
        // 포트를 8088로 변경
        const response = await axios.get('http://localhost:8088/dashboard/allUserCount');
        settotalUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
      }
    };

    fetchMovieCount();
  }, []);

  return (
    <div>
      <h2 className={styles.h2}>전체 회원 수</h2>
      <p>{totalUsers.toLocaleString()}명</p>
    </div>
  );
};

export default TotalUsers;