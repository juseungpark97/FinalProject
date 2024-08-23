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
  rating: number;
  status: string;
}

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

export default function MovieManage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'disabled'>('all'); // 추가된 viewMode 상태

  const fetchMovies = async () => {
    try {
      const response = await axios.get<Movie[]>('http://localhost:8088/dashboard/getMovie');
      setMoviesData(response.data);
    } catch (error) {
      console.error("Failed to get Movie", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, viewMode, moviesData, currentPage]); // dependencies에 viewMode와 moviesData 추가

  const applyFilters = () => {
    const filtered = moviesData
      .filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((movie) => viewMode === 'all' || movie.status === 'D'); // viewMode에 따라 필터링

    setSearchResults(filtered);
    setCurrentPage(1); // 필터링 시 첫 페이지로 리셋
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    applyFilters(); // 검색 클릭 시 필터 적용
  };

  const setActivateMovie = async (movieId: number, status: string) => {
    try {
      await axios.put('http://localhost:8088/dashboard/setActivateMovie', { movieId, status });
      // 상태 변경 후 영화 목록을 다시 가져옵니다.
      await fetchMovies();
    } catch (error) {
      console.error("Failed to update Movie status", error);
    }
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
        <div>
          <a onClick={() => setViewMode('all')}>전체목록</a>&nbsp;&nbsp;|&nbsp;&nbsp;
          <a onClick={() => setViewMode('disabled')}>비활성화된 영화</a>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="영화제목"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
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
            <col style={{ width: "200px" }} />
            <col style={{ width: "300px" }} />
            <col style={{ width: "250px" }} />
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
              <th>개봉년도</th>
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
                <td>{formatArrayString(movie.tags)}</td>
                <td>{formatArrayString(movie.cast)}</td>
                <td>{movie.director}</td>
                <td>{movie.releaseYear}</td>
                <td>{movie.viewCount}</td>
                <td>{movie.rating}&nbsp;/&nbsp;5</td>
                <td>
                  <button onClick={() => setActivateMovie(movie.movieId, movie.status)}>
                    {movie.status === 'A' ? '비활성화' : '활성화'}
                  </button>
                </td>
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
