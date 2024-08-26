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

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // sessionStorage 사용

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

  const handleClick = () => {
    navigate('/home');
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <>
      <section className={`${styles.Header} ${className}`}>
        <header className={styles.header}>
          <div className={styles.headerBackground} />
          <div onClick={handleClick}>
            <img
              className={styles.logoText2}
              loading="lazy"
              alt=""
              src="/logo-text-2@2x.png"
            />
          </div>
          <div className={styles.navigation}>
            <div className={styles.homeNav}>
              <div className={`${styles.homeButton} ${styles.iconButton}`} onClick={handleClick}>
                <img
                  className={styles.homeButtonIcon}
                  loading="lazy"
                  alt=""
                  src="/homeButton.png"
                />
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