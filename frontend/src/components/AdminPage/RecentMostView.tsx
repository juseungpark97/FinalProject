import React, { useEffect, useState } from 'react';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';
import axios from 'axios';

export interface recentMovieProps {
  title: string;
  tags: string;
  releaseYear: number;
  director: string;
  cast: string;
  viewCount: number;
};

const formatArrayString = (arrayString: string): string => {
  try {
    const array = JSON.parse(arrayString);
    if (Array.isArray(array)) {
      return array.join(', '); // 원하는 구분자나 포맷으로 수정 가능
    }
    return '';
  } catch (error) {
    console.error('Error parsing array string', error);
    return '';
  }
};

const RecentMostView = () => {
  const [data, setData] = useState<recentMovieProps[]>([]);

  useEffect(() => {
    axios.get<recentMovieProps[]>('http://localhost:8088/dashboard/recentMostView')
        .then((req) => {
          setData(req.data);
        })
  }, [])

  return (
    <div className={styles.recentTop}>
      <h2 className={styles.recentTitle}>최근 많이 본 영화 (30일 내 100건 이상)</h2>
      <table className={styles.recentMoviesTable}>
        <thead>
          <tr>
            <th>영화 제목</th>
            <th>장르</th>
            <th>감독</th>
            <th>배우</th>
            <th>한달조회수</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{formatArrayString(item.tags)}</td>
              <td>{item.director}</td>
              <td>{formatArrayString(item.cast)}</td>
              <td>{item.viewCount}회</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentMostView;
