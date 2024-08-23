import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './css/Header.module.css';
import { Profile } from '../../types/Profile';

export type HeaderProps = {
  className?: string;
  onSearchClick?: () => void;
  selectedProfile: Profile | null;
  setSelectedProfile: (profile: Profile | null) => void;
};

const Header: React.FC<HeaderProps> = ({ className = "", onSearchClick, selectedProfile, setSelectedProfile }) => {
  const [user, setUser] = useState<any>(null);
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedProfileData = sessionStorage.getItem('selectedProfile');
    if (selectedProfileData) {
      const profile = JSON.parse(selectedProfileData);
      setSelectedProfile(profile);
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedUser = decodeJWT(token);
      setUser(decodedUser);

      axios.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error("Error fetching user data", error);
        });
    }

  }, [setSelectedProfile]);

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const handleProfileChange = () => {
    navigate('/profiles');
  };

  const handleLogout = async () => {
    try {
      // 일반 로그인 토큰 제거
      localStorage.removeItem('authToken');
      setSelectedProfile(null);
      sessionStorage.removeItem('selectedProfile');

      // 카카오 로그아웃 처리
      const clientId = "3cd0dba35845286d817669df88d06d12"; // 클라이언트 ID
      const logoutRedirectUri = "http://localhost:3000"; // 로그아웃 후 리디렉션될 URI

      // 카카오 로그아웃 URL 생성
      const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${encodeURIComponent(logoutRedirectUri)}`;

      // 브라우저 리디렉션을 통해 카카오 로그아웃 요청
      window.location.href = logoutUrl;

    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    if (selectedProfile) {
      sessionStorage.setItem('selectedProfile', JSON.stringify(selectedProfile));
      console.log('Profile saved to sessionStorage:', selectedProfile);
    }
  }, [selectedProfile]);

  const handleHomeClick = () => {
    setClickCount(prev => prev + 1);

    if (timer) {
      clearTimeout(timer);
    }

    setTimer(setTimeout(() => {
      setClickCount(0); // 일정 시간 후 클릭 카운트 초기화
    }, 1000)); // 1초 내에 클릭을 3번 이상 하지 않으면 카운트를 초기화

    if (clickCount + 1 === 3) {
      navigate('/easterEgg'); // 3번 클릭 시 이동할 경로
      setClickCount(0); // 클릭 카운트 초기화
    } else {
      navigate('/home'); // 기본적으로는 홈으로 이동
    }
  };

  return (
    <>
      <section className={`${styles.Header} ${className}`}>
        <header className={styles.header}>
          <div className={styles.headerBackground} />
          <div onClick={handleHomeClick}>
            <img
              className={styles.logoText2}
              loading="lazy"
              alt=""
              src="/logo-text-2@2x.png"
            />
          </div>
          <div className={styles.navigation}>
            <div className={styles.homeNav}>
              <div className={`${styles.homeButton} ${styles.iconButton}`}>
                <div onClick={handleHomeClick} className={styles.a}>
                  <img
                    className={styles.homeButtonIcon}
                    loading="lazy"
                    alt=""
                    src="/homeButton.png"
                  />
                </div>
              </div>
              <div
                className={`${styles.searchNav} ${styles.iconButton}`}
                onClick={onSearchClick}
              >
                <img
                  className={styles.fesearchIcon}
                  loading="lazy"
                  alt=""
                  src="/fesearch.svg"
                />
              </div>
              <div className={`${styles.notificationsNav} ${styles.iconButton}`}>
                <Link to="/notifications">
                  <img
                    className={styles.faSolidbellIcon}
                    loading="lazy"
                    alt=""
                    src="/fasolidbell.svg"
                  />
                </Link>
              </div>
              <div className={`${styles.profileNav} ${styles.iconButton}`}>
                <div className={styles.clickableDiv}>
                  <img
                    className={styles.profileBackgroundIcon}
                    loading="lazy"
                    alt="Profile"
                    src={selectedProfile?.profileImg ? (selectedProfile.profileImg) : '/profile.png'}
                  />
                  <img
                    className={styles.antDesigncaretDownFilledIcon}
                    loading="lazy"
                    alt=""
                    src="/antdesigncaretdownfilled.svg"
                  />
                  <div className={styles.dropdownMenu}>
                    {selectedProfile && (
                      <div className={`${styles.dropdownItem} ${styles.disabledItem}`}>
                        <h3>{selectedProfile.profileName} 님</h3>
                      </div>
                    )}
                    <div className={styles.dropdownItem} onClick={handleProfileChange}>
                      계정 전환
                    </div>
                    <Link to="/account" className={styles.dropdownItem}>
                      계정
                    </Link>
                    <Link to="/help" className={styles.dropdownItem}>
                      고객센터
                    </Link>
                    <div
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      로그아웃
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </section>
    </>
  );
};

export default Header;
