import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, IconButton, Slider as MuiSlider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './css/MovieDetailPage.module.css';
import useRelatedMovies from '../../components/Movies/useRelatedMovies';
import useMoviesByCast from '../../components/Movies/useMoviesByCast';
import { Movie } from '../../types/Movie';
import VideoThumbnail from '../../../src/components/HomePage/VideoThumbnail';

const MovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCast, setSelectedCast] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const { relatedMovies } = useRelatedMovies(selectedTag || '');
  const { moviesByCast } = useMoviesByCast(selectedCast || '');

  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [previousVolume, setPreviousVolume] = useState(0);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeSliderTimeoutRef = useRef<number | null>(null);
  const hideControlsTimeoutRef = useRef<number | null>(null);

  // 비디오가 로드되었을 때 메타데이터를 통해 총 길이 계산
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  // 영화 데이터 가져오기
  useEffect(() => {
    if (movieId) {
      const movieIdNumber = parseInt(movieId, 10);
      if (!isNaN(movieIdNumber)) {
        axios.get(`http://localhost:8088/api/movies/${movieIdNumber}`)
          .then(response => {
            setMovie(response.data);
            setLoading(false);
          })
          .catch(() => {
            setError('영화 세부 정보를 로드하는 중 오류가 발생했습니다.');
            setLoading(false);
          });
      } else {
        setError('유효한 숫자가 아닌 영화 ID입니다.');
        setLoading(false);
      }
    } else {
      setError('영화 ID가 누락되었습니다.');
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    if (movie && videoRef.current) {
      videoRef.current.src = movie.url;
    }
  }, [movie]);

  // 시청 기록 업데이트
  useEffect(() => {
    if (movieId) {
      const storedProfile = sessionStorage.getItem('selectedProfile');
      const profileNo = storedProfile ? JSON.parse(storedProfile).profileNo : null;

      if (profileNo) {
        axios.get('http://localhost:8088/api/movies/watchlog', {
          params: { movieId: parseInt(movieId, 10), profileNo }
        })
          .then(response => {
            if (videoRef.current && response.data !== 0) {
              videoRef.current.addEventListener('loadedmetadata', () => {
                setTimeout(() => {
                  videoRef.current!.currentTime = response.data;
                }, 100);  // 100ms 지연
              });
            }
          })
          .catch(() => {
            console.error("Failed to fetch watch progress");
          });
      }
    }
  }, [movieId]);

  // 시청 기록 기반으로 이어보기
  useEffect(() => {
    if (movieId) {
      const storedProfile = sessionStorage.getItem('selectedProfile');
      const profileNo = storedProfile ? JSON.parse(storedProfile).profileNo : null;

      if (profileNo) {
        axios.get('http://localhost:8088/api/movies/watchlog', {
          params: { movieId: parseInt(movieId, 10), profileNo }
        })
          .then(response => {
            if (videoRef.current && response.data !== 0) {
              // 딜레이를 추가하여 비디오 로드 후 이어보기 기능 적용
              setTimeout(() => {
                videoRef.current!.currentTime = response.data;
              }, 130);
            }
          })
          .catch(() => {
            console.error("Failed to fetch watch progress");
          });
      }
    }
  }, [movieId]);

  // 뒤로가기 버튼 처리
  const handleBack = useCallback(() => {
    const storedProfile = sessionStorage.getItem('selectedProfile');
    const profileNo = storedProfile ? JSON.parse(storedProfile).profileNo : null;
    if (movieId) {
      const movieIdNumber = parseInt(movieId, 10);

      if (videoRef.current && profileNo) {
        const currentTime = videoRef.current.currentTime;

        axios.post('http://localhost:8088/api/movies/watchlog', null, {
          params: {
            movieId: movieIdNumber,
            profileNo,
            progressTime: currentTime
          },
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(() => {
            navigate("/home");
          })
          .catch(() => {
            console.error("Failed to save watch progress");
          });
      } else {
        console.error("Profile number is missing. Unable to save watch progress.");
      }
    }
  }, [navigate, movieId]);

  // 비디오 자동 재생 및 음소거 설정
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      setMuted(true);
      videoRef.current.play();
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    setPlaying(prev => !prev);
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [playing]);

  const handleVolumeChange = useCallback((event: Event, newValue: number | number[]) => {
    const adjustedVolume = Math.min(newValue as number, 1);
    setVolume(adjustedVolume);
    setMuted(adjustedVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = adjustedVolume;
    }
  }, []);

  const handleMute = useCallback(() => {
    if (muted) {
      setVolume(previousVolume);
      setMuted(false);
      if (videoRef.current) {
        videoRef.current.volume = previousVolume;
      }
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setMuted(true);
      if (videoRef.current) {
        videoRef.current.volume = 0;
      }
    }
  }, [muted, previousVolume, volume]);

  const handleVolumeClick = () => {
    handleMute();
    toggleVolumeSlider();
  };

  const toggleVolumeSlider = useCallback(() => {
    setShowVolumeSlider(prev => !prev);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!fullscreen) {
      if (wrapperRef.current?.requestFullscreen) {
        wrapperRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullscreen(!fullscreen);
  }, [fullscreen]);

  const handleProgress = useCallback(() => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      setPlayed(videoRef.current.currentTime / videoRef.current.duration);
    }
  }, []);

  const handleDuration = useCallback(() => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleSeekChange = useCallback((event: Event, newValue: number | number[]) => {
    const adjustedSeek = Math.min(newValue as number, 1);
    if (videoRef.current) {
      videoRef.current.currentTime = adjustedSeek * videoRef.current.duration;
      setPlayed(adjustedSeek);
    }
  }, []);

  const handleForward10 = useCallback(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const remainingTime = duration - currentTime;
      if (remainingTime > 10) {
        videoRef.current.currentTime = currentTime + 10;
      } else {
        videoRef.current.currentTime = duration;
        setPlaying(false);
      }
    }
  }, [duration]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m > 9 ? m : (h ? '0' + m : m || '0'), s > 9 ? s : '0' + s]
      .filter(a => a)
      .join(':');
  };

  const handleMouseLeaveVolumeControl = useCallback(() => {
    volumeSliderTimeoutRef.current = window.setTimeout(() => {
      setShowVolumeSlider(false);
    }, 2000);
  }, []);

  const handleMouseEnterVolumeControl = useCallback(() => {
    if (volumeSliderTimeoutRef.current) {
      clearTimeout(volumeSliderTimeoutRef.current);
      volumeSliderTimeoutRef.current = null;
    }
    setShowVolumeSlider(true);
  }, []);

  useEffect(() => {
    if (showVolumeSlider) {
      volumeSliderTimeoutRef.current = window.setTimeout(() => {
        setShowVolumeSlider(false);
      }, 2000);
    } else {
      if (volumeSliderTimeoutRef.current) {
        clearTimeout(volumeSliderTimeoutRef.current);
        volumeSliderTimeoutRef.current = null;
      }
    }
  }, [showVolumeSlider]);

  const showControls = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.classList.add(styles.visible);
    }
    if (backButtonRef.current) {
      backButtonRef.current.classList.add(styles.visible);
    }
    document.body.style.cursor = 'default';
  }, []);

  const hideControls = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.classList.remove(styles.visible);
    }
    if (backButtonRef.current) {
      backButtonRef.current.classList.remove(styles.visible);
    }
    document.body.style.cursor = 'none';
  }, []);

  const handleMouseMove = useCallback(() => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    showControls();
    hideControlsTimeoutRef.current = window.setTimeout(hideControls, 5000);
  }, [showControls, hideControls]);

  const handleEnded = useCallback(() => {
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (fullscreen) {
      document.addEventListener('mousemove', handleMouseMove);
      hideControlsTimeoutRef.current = window.setTimeout(hideControls, 5000);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      document.body.style.cursor = 'default';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [fullscreen, handleMouseMove, hideControls]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleCastClick = (cast: string) => {
    setSelectedCast(cast);
  };

  const handleLikeClick = useCallback(() => {
    if (movie && movieId) {
      const newLikedStatus = !liked;
      setLiked(newLikedStatus);

      const storedProfile = sessionStorage.getItem('selectedProfile');

      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const profileNo = profile.profileNo;
        const movieIdNumber = parseInt(movieId, 10);

        if (!isNaN(movieIdNumber)) {
          axios.post('http://localhost:8088/api/movies/toggle-like', null, {
            params: {
              movieId: movieIdNumber,
              profileNo
            },
            headers: {
              'Content-Type': 'application/json',
            }
          })
            .then(() => {
              console.log('Like status updated successfully');
            })
            .catch(error => {
              console.error('Error updating like status:', error.response?.data || error.message);
            });
        } else {
          console.error('movieId is not a valid number');
        }
      } else {
        console.error('No profile information found in session storage');
      }
    } else {
      console.error('movieId or movie is not available');
    }
  }, [movie, liked, movieId]);

  const getSliderSettings = (movieCount: number) => ({
    dots: false,
    infinite: movieCount > 2,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    draggable: false,
    arrows: movieCount > 2,
  });

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Box className={styles.container} onMouseEnter={showControls} onMouseLeave={hideControls}>
      <Box ref={backButtonRef} className={styles.backButton}>
        <IconButton onClick={handleBack} className={styles.controlButton}>
          <ArrowBackIcon style={{ color: 'white' }} />
        </IconButton>
      </Box>

      <Typography variant="h3" className={styles.title}>
        {movie?.title}
      </Typography>
      <Box className={styles.playerWrapper} ref={wrapperRef}>
        <video
          ref={videoRef}
          className={styles.reactPlayer}
          controls={false}
          onTimeUpdate={handleProgress}
          onLoadedMetadata={handleLoadedMetadata}
          muted={true} // 비디오 자동 재생을 위한 초기 음소거 설정
          onEnded={handleEnded}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onCanPlay={() => {
            videoRef.current?.play(); // 비디오가 재생 가능할 때 자동 재생
          }}
          autoPlay
          preload="auto"
        />

        <Box className={styles.controls} ref={controlsRef}>
          <IconButton onClick={handlePlayPause} className={styles.controlButton} sx={{ color: 'white' }}>
            {playing ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton onClick={() => videoRef.current!.currentTime -= 10} className={styles.controlButton} sx={{ color: 'white' }}>
            <Replay10Icon />
          </IconButton>
          <IconButton onClick={handleForward10} className={styles.controlButton} sx={{ color: 'white' }}>
            <Forward10Icon />
          </IconButton>
          <MuiSlider
            value={isNaN(played) ? 0 : played}
            onChange={handleSeekChange}
            aria-labelledby="progress-slider"
            className={styles.progressSlider}
            min={0}
            max={0.91}
            step={0.01}
            style={{ color: '#d6a060', width: '80%' }}
          />
          <Box
            className={`${styles.volumeControl} ${showVolumeSlider ? styles.showSlider : ''}`}
            onMouseEnter={handleMouseEnterVolumeControl}
            onMouseLeave={handleMouseLeaveVolumeControl}
          >
            <IconButton onClick={handleVolumeClick} className={styles.controlButton} sx={{ color: 'white' }}>
              {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
            <MuiSlider
              orientation="vertical"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-labelledby="continuous-slider"
              className={styles.volumeSlider}
              min={0}
              max={0.91}
              step={0.01}
              sx={{
                width: '6px',
                height: '80px',
                position: 'absolute',
                right: '5px',
                bottom: '50px',
                '& .MuiSlider-thumb': {
                  width: '12px',
                  height: '12px',
                  backgroundColor: "#d6a060",
                },
                '& .MuiSlider-track': {
                  border: 'none',
                  backgroundColor: '#d6a060',
                },
                '& .MuiSlider-rail': {
                  opacity: 0.5,
                  backgroundColor: '#bfbfbf',
                },
              }}
            />
          </Box>
          <Typography className={styles.time}>
            {formatTime(played * duration)} / {formatTime(duration)}
          </Typography>
          <IconButton onClick={handleFullscreen} className={styles.controlButton} sx={{ color: 'white' }}>
            <FullscreenIcon />
          </IconButton>
        </Box>
      </Box>

      <Box className={styles.likeButtonWrapper}>
        <IconButton onClick={handleLikeClick} className={styles.likeButton}>
          {liked ? <ThumbUpIcon style={{ color: 'white' }} /> : <ThumbUpOffAltIcon style={{ color: 'white' }} />}
        </IconButton>
      </Box>

      <Typography variant="body1" className={styles.description}>
        {movie?.description}
      </Typography>
      <Box className={styles.bottomSection}>
        <Box className={styles.section}>
          <Typography variant="h6" className={styles.subtitle}>
            배우
          </Typography>
          <ul className={styles.list}>
            {movie?.castList.map((actor, index) => (
              <li key={index} className={styles.listItem}>
                <button onClick={() => handleCastClick(actor)} className={styles.tagButton}>
                  {actor}
                </button>
              </li>
            ))}
          </ul>
          {moviesByCast.length > 0 && (
            <Box className={`${styles.sliderContainer} my-custom-slider`}>
              <Slider {...getSliderSettings(moviesByCast.length)} className={styles.tileRows}>
                {moviesByCast.map((movie, index) => (
                  <div className={styles.tile} key={index}>
                    <VideoThumbnail video={movie} />
                  </div>
                ))}
              </Slider>
            </Box>
          )}
        </Box>
        <Box className={styles.section}>
          <Typography variant="h6" className={styles.subtitle}>
            태그
          </Typography>
          <ul className={styles.list}>
            {movie?.tagList.map((tag, index) => (
              <li key={index} className={styles.listItem}>
                <button onClick={() => handleTagClick(tag)} className={styles.tagButton}>
                  {tag}
                </button>
              </li>
            ))}
          </ul>
          {relatedMovies.length > 0 && (
            <Box className={`${styles.sliderContainer} my-custom-slider`}>
              <Slider {...getSliderSettings(relatedMovies.length)} className={styles.tileRows}>
                {relatedMovies.map((movie, index) => (
                  <div className={styles.tile} key={index}>
                    <VideoThumbnail video={movie} />
                  </div>
                ))}
              </Slider>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MovieDetailPage;
