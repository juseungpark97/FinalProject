import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './css/Header.module.css';

export type HeaderProps = {
  className?: string;
  onSearchClick?: () => void;
  selectedProfile: Profile | null;
  setSelectedProfile: (profile: Profile | null) => void;
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
    console.log('Header selectedProfile:', selectedProfile);
  }, [selectedProfile]);

  useEffect(() => {
    // 1. sessionStorage에서 selectedProfile을 먼저 가져옵니다.
    const selectedProfileData = sessionStorage.getItem('selectedProfile');
    console.log('Session storage selectedProfile at the start:', selectedProfileData);

    if (selectedProfileData) {
      const profile = JSON.parse(selectedProfileData);
      setSelectedProfile(profile);
      console.log('Profile loaded in Header from sessionStorage:', profile);
    } else {
      console.warn('Profile not found in sessionStorage');
    }

    // 2. 사용자 인증 정보를 가져옵니다.
    const token = sessionStorage.getItem('authToken');
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
          console.log('User data loaded:', response.data);
        })
        .catch(error => {
          console.error("Error fetching user data", error);
        });
    } else {
      console.warn('No authToken found in sessionStorage');
    }

  }, []);

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
    sessionStorage.removeItem('authToken');
    setSelectedProfile(null);
    sessionStorage.removeItem('selectedProfile');
    navigate('/login');
  };

  useEffect(() => {
    if (selectedProfile) {
      sessionStorage.setItem('selectedProfile', JSON.stringify(selectedProfile));
      console.log('Profile saved to sessionStorage:', selectedProfile);
    }
  }, [selectedProfile]);

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
                  {/* 프로필 이미지 및 이름 표시 */}
                  <img
                    className={styles.profileBackgroundIcon}
                    loading="lazy"
                    alt="Profile"
                    src={selectedProfile?.profileImg || '/profile.png'}  // profileImg가 제대로 설정되어 있는지 확인
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