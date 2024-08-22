import React, { useEffect, useState } from 'react';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';
import Pagination from './Pagination'; // Pagination 컴포넌트를 import 합니다.
import axios from 'axios';

interface Movie {
  movieId: number;
  title: string;
  tags: string;
  cast: string;
  director: string;
  releaseYear: string;
  viewCount: number;
  rating: number
}

export default function MovieManage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await axios.get<Movie[]>('http://localhost:8088/dashboard/getMovie');
        setMoviesData(response.data);
        setSearchResults(response.data); // 초기 로딩 시 검색 결과를 전체 데이터로 설정
      } catch (error) {
        console.error("Failed to get Movie", error);
      }
    };

    getMovie();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    const filtered = moviesData.filter(
      (movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filtered);
    setCurrentPage(1); // 검색 시 첫 페이지로 돌아가도록 설정
  };

  // 페이지네이션을 위한 현재 페이지의 영화 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.movimanage}>영화 관리</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="영화제목"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className={styles.searchInput}
          />
          <button onClick={handleSearchClick} className={styles.searchButton}>검색</button>
        </div>
      </div>
      <div>
        <table className={styles.tg}>
          <colgroup>
            <col style={{ width: "100px" }} />
            <col style={{ width: "300px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "300px" }} />
            <col style={{ width: "250px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr id={styles.firstrow}>
              <th>영화번호</th>
              <th>제목</th>
              <th>장르</th>
              <th>출연배우</th>
              <th>감독</th>
              <th>상영시간</th>
              <th>등록일자</th>
              <th>조회수</th>
              <th>평점</th>
              <th>삭제하기</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((movie) => (
              <tr key={movie.movieId}>
                <td>{movie.movieId}</td>
                <td>{movie.title}</td>
                <td>{movie.tags}</td>
                <td>{movie.cast}</td>
                <td>{movie.director}</td>
                <td>0</td>
                <td>{movie.releaseYear}</td>
                <td>{movie.viewCount}</td>
                <td>{movie.rating}&nbsp;/&nbsp;5</td>
                <td><button>delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={searchResults.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
