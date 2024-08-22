import React, { useState, useCallback, useMemo } from 'react';
import Header from '../../../src/components/CommonPage/Header';
import Frame from '../../components/HomePage/HomeFrame';
import SliderSection from '../../components/HomePage/SliderSection';
import SearchOverlay from '../../../src/components/HomePage/SearchOverlay';
import { useMovies } from './hooks/useMovies';
import { Profile } from './services/interfaces';
import styles from './css/HomePage.module.css';
import Footer from '../../components/CommonPage/Footer';

const HomePage: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const profileNo = selectedProfile?.profileNo || null;
  const {
    movies,
    filteredMovies,
    recentMovies,
    recommendedMovies,
    filterMovies,
    mostWatchedGenre,
    moviesByMostWatchedGenre
  } = useMovies(profileNo);

  const predefinedTags = useMemo(() => [
    '드라마', '로맨스', '코미디', '스릴러', '미스터리', '호러', '액션', 'SF', '판타지',
    '다큐멘터리', '어드벤처', '우화', '다문화', '가족', '음악', '해적', '심리적', '비극적',
    '극복', '서스펜스', '정서적', '사랑', '운명', '실화', '철학적', '형이상학적', '패러디',
    '반전', '서정적', '상상력', '유머', '혼란', '노스탤지어', '실험적', '미니멀리즘', '예술적',
    '하이테크', '가상 현실', '미래적', '고전', '전쟁', '역사적', '대체 역사', '미래', '도시',
    '자연', '실험실', '우주', '도시 전쟁', '기술', '사회적', '심리전', '성장', '관계',
    '극단적', '아동'
  ], []);
  React.useEffect(() => {
    filterMovies(searchTerm);
  }, [searchTerm, filterMovies]);

  const handleSearchClick = useCallback(() => setIsSearchVisible(true), []);
  const handleCloseSearch = useCallback(() => setIsSearchVisible(false), []);
  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
    handleCloseSearch();
  }, [handleCloseSearch]);

  return (
    <div className={styles.main}>
      <img className={styles.titleImageIcon} alt="Title" src="/titleimage@2x.png" />
      <Header
        onSearchClick={handleSearchClick}
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
      />
      <div className={styles.heroContent}>
        {/* 여기에 Hero Content 내용 추가 */}
      </div>
      <section className={styles.content}>
        {searchTerm ? (
          <>
            <h2 className={styles.searchResultsSection}>
              {predefinedTags.includes(searchTerm)
                ? `${searchTerm} 장르인 영상`
                : `제목이 ${searchTerm}인 영상`}
            </h2>
            {filteredMovies.length > 0 ? (
              <SliderSection title="검색 결과" movies={filteredMovies} />
            ) : (
              <p className={styles.noResults}>검색된 영화가 없습니다.</p>
            )}
          </>
        ) : (
          <>
            <SliderSection title="최근 시청한 영상" movies={recentMovies} />
            <Frame />
            <SliderSection title="영화 이어보기" movies={filteredMovies} />
            <Frame />
            {mostWatchedGenre && moviesByMostWatchedGenre.length > 0 && (
              <>
                <SliderSection
                  title={`${mostWatchedGenre} 장르인 영상`}
                  movies={moviesByMostWatchedGenre}
                />
                <Frame />
              </>
            )}
            <SliderSection title="이런 영화는 어떠세요?" movies={recommendedMovies} />
            <Frame />
            <SliderSection title="밤늦게 즐기는 스릴러" movies={filteredMovies} />
          </>
        )}
      </section>
      {isSearchVisible && <SearchOverlay onClose={handleCloseSearch} onSearch={handleSearch} />}
      <Footer />
    </div>
  );
};

export default HomePage;