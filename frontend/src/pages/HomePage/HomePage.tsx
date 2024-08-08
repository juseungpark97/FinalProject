import React from 'react';
import Slider from 'react-slick';
import Header from '../../../src/components/CommonPage/Header';
import Frame from '../../../src/components/HomePage/HomeFrame';
import VideoThumbnail from '../../../src/components/HomePage/VideoThumbnail';
import SearchOverlay from '../../../src/components/HomePage/SearchOverlay';
import styles from './css/HomePage.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import Footer from '../../components/CommonPage/Footer';

interface Movie {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  tagList: string[];
  genre: string | null;
  castList: string[];
  director: string;
  rating: number;
  releaseYear: number;
}

const HomePage: React.FC = () => {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = React.useState<Movie[]>([]);
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Predefined tags
  const predefinedTags = [
    '드라마', '로맨스', '코미디', '스릴러', '미스터리', '호러', '액션', 'SF', '판타지',
    '다큐멘터리', '어드벤처', '우화', '다문화', '가족', '음악', '해적', '심리적', '비극적',
    '극복', '서스펜스', '정서적', '사랑', '운명', '실화', '철학적', '형이상학적', '패러디',
    '반전', '서정적', '상상력', '유머', '혼란', '노스탤지어', '실험적', '미니멀리즘', '예술적',
    '하이테크', '가상 현실', '미래적', '고전', '전쟁', '역사적', '대체 역사', '미래', '도시',
    '자연', '실험실', '우주', '도시 전쟁', '기술', '사회적', '심리전', '성장', '관계',
    '극단적', '아동'
  ];

  React.useEffect(() => {
    axios.get('http://localhost:8088/api/movies')
      .then(response => {
        console.log('Fetched movies:', response.data);
        const formattedMovies = response.data.map((movie: any) => ({
          ...movie,
          tagList: movie.tagList || [],
        }));
        setMovies(formattedMovies);
        setFilteredMovies(formattedMovies);
      })
      .catch(error => {
        console.error('There was an error fetching the movies!', error);
      });
  }, []);

  React.useEffect(() => {
    filterMovies();
  }, [searchTerm, movies]);

  const filterMovies = () => {
    let filtered = movies;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    filtered = filtered.filter(movie => {
      const titleMatch = movie.title.toLowerCase().includes(lowerCaseSearchTerm);
      const tagMatch = movie.tagList.some(tag => tag.toLowerCase() === lowerCaseSearchTerm);

      return titleMatch || tagMatch;
    });

    setFilteredMovies(filtered);
  };

  const handleSearchClick = () => {
    setIsSearchVisible(true);
  };

  const handleCloseSearch = () => {
    setIsSearchVisible(false);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    handleCloseSearch();
  };

  const CustomPrevArrow = (props: any) => {
    const { className, onClick } = props;
    return (
      <button className={`${className} ${styles.arrowButton} ${styles.left}`} onClick={onClick}>
        &lt;
      </button>
    );
  };

  const CustomNextArrow = (props: any) => {
    const { className, onClick } = props;
    return (
      <button className={`${className} ${styles.arrowButton} ${styles.right}`} onClick={onClick}>
        &gt;
      </button>
    );
  };

  const getSliderSettings = (movieCount: number) => ({
    dots: false,
    infinite: movieCount > 4,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 2,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: movieCount > 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: movieCount > 1
        }
      }
    ]
  });

  const renderSection = (title: string, movies: Movie[], keyPrefix: string, additionalClass: string = '') => (
    <div className={`${styles.section} ${additionalClass}`} key={keyPrefix}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <Slider {...getSliderSettings(movies.length)} className={styles.tileRows}>
        {movies.map((movie, index) => (
          <div className={styles.tile} key={`${keyPrefix}-${index}`}>
            <VideoThumbnail video={movie} />
          </div>
        ))}
      </Slider>
    </div>
  );

  return (
    <div className={styles.main}>
      <img className={styles.titleImageIcon} alt="Title" src="/titleimage@2x.png" />
      <Header onSearchClick={handleSearchClick} />
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
              <Slider {...getSliderSettings(filteredMovies.length)} className={styles.tileRows}>
                {filteredMovies.map((movie, index) => (
                  <div className={styles.tile} key={`search-${index}`}>
                    <VideoThumbnail video={movie} />
                  </div>
                ))}
              </Slider>
            ) : (
              <p className={styles.noResults}>검색된 영화가 없습니다.</p>
            )}
          </>
        ) : (
          <>
            {renderSection('영화 이어보기', filteredMovies, 'section-1')}
            <Frame />
            {renderSection('시네마 클라우드 추천작', filteredMovies, 'section-2')}
            <Frame />
            {renderSection('밤늦게 즐기는 스릴러', filteredMovies, 'section-3')}
          </>
        )}
      </section>
      {isSearchVisible && <SearchOverlay onClose={handleCloseSearch} onSearch={handleSearch} />}
      <Footer />
    </div>
  );
};

export default HomePage;
