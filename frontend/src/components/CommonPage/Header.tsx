import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './css/Header.module.css';

export type HeaderProps = {
  className?: string;
  onSearchClick?: () => void;
  selectedProfile: Profile | null;  // 기존 상태를 props로 받도록 수정
  setSelectedProfile: (profile: Profile | null) => void;  // 기존 상태 업데이트 함수를 props로 받도록 수정
};

interface Profile {
  profileNo: number;
  profileImg: string;
  profileName: string;
}

const Header: React.FC<HeaderProps> = ({ className = "", onSearchClick, selectedProfile, setSelectedProfile }) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedUser = decodeJWT(token);
      setUser(decodedUser);

      if (decodedUser) {
        axios.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(response => {
            setUser(response.data);

            // 선택된 프로필 정보를 localStorage에서 가져옴
            const selectedProfileData = localStorage.getItem('selectedProfile');
            if (selectedProfileData) {
              const profile = JSON.parse(selectedProfileData);
              setSelectedProfile(profile);
            } else {
              setSelectedProfile(null); // 기본 프로필 이미지를 사용할 경우
            }
          })
          .catch(error => console.error("Error fetching user data", error));
      }
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedProfile');
    setSelectedProfile(null);
    navigate('/login');
  };

  return (
    <>
      <section className={`${styles.Header} ${className}`}>
        <header className={styles.header}>
          <div className={styles.headerBackground} />
          <Link to="/home">
            <img
              className={styles.logoText2}
              loading="lazy"
              alt=""
              src="/logo-text-2@2x.png"
            />
          </Link>
          <div className={styles.navigation}>
            <div className={styles.homeNav}>
              <div className={`${styles.homeButton} ${styles.iconButton}`}>
                <Link to="/home" className={styles.a}>
                  <img
                    className={styles.homeButtonIcon}
                    loading="lazy"
                    alt=""
                    src="/homeButton.png"
                  />
                </Link>
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
                    src={selectedProfile?.profileImg || '/profile.png'}
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