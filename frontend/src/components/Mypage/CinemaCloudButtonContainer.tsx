import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './css/CinemaCloudButtonContainer.module.css';

interface Props {
  onMenuClick: (menu: string) => void;
  profileMain: string; // 'M' for Main, 'S' for Sub
}

const CinemaCloudButtonContainer: React.FC<Props> = ({ onMenuClick, profileMain }) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('overview'); // 기본적으로 '개요'가 활성화

  // 경로와 메뉴의 매핑을 명시적으로 타입 지정
  const pathToMenuMap: Record<string, string> = {
    '/home': 'overview',
    '/profile': 'profile',
    '/membership': 'membership',
    '/security': 'security',
    '/accountDelete': 'accountDelete',
  };

  useEffect(() => {
    const menu = pathToMenuMap[location.pathname] || 'overview';
    setActiveMenu(menu);
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <ul className={styles.menuList}>
        <li>
          <div className='home'>
            <Link to="/home" className={styles.backToHome}>
              &larr; 시네마클라우드로 돌아가기
            </Link>
          </div>
        </li>
        <li>
          <div className='overView'>
            <button
              onClick={() => { onMenuClick('overview'); setActiveMenu('overview'); }}
              className={`${styles.menuItem} ${activeMenu === 'overview' ? styles.active : ''}`}
            >
              <img src="homeButton2.png" alt="개요" className={styles.icon} />
              개요
            </button>
          </div>
        </li>
        <li>
          <div className='profile'>
            <button
              onClick={() => { onMenuClick('profile'); setActiveMenu('profile'); }}
              className={`${styles.menuItem} ${activeMenu === 'profile' ? styles.active : ''}`}
            >
              <img src="myPage2.png" alt="프로필 관리" className={styles.icon} />
              프로필 관리
            </button>
          </div>
        </li>
        <li>
          <div className='membership'>
            <button
              onClick={() => { onMenuClick('membership'); setActiveMenu('membership'); }}
              className={`${styles.menuItem} ${activeMenu === 'membership' ? styles.active : ''}`}
            >
              <img src="membership2.png" alt="멤버십" className={styles.icon} />
              멤버십
            </button>
          </div>
        </li>
        <li>
          <div className='security'>
            <button
              onClick={() => { onMenuClick('security'); setActiveMenu('security'); }}
              className={`${styles.menuItem} ${activeMenu === 'security' ? styles.active : ''}`}
            >
              <img src="security2.png" alt="보안" className={styles.icon} />
              보안
            </button>
          </div>
        </li>
        {profileMain === 'M' && (
          <li>
            <div className='accountDelete'>
              <button
                onClick={() => { onMenuClick('accountDelete'); setActiveMenu('accountDelete'); }}
                className={`${styles.menuItem} ${activeMenu === 'accountDelete' ? styles.active : ''}`}
              >
                <img src="logout2.png" alt="회원탈퇴" className={styles.icon} />
                회원탈퇴
              </button>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default CinemaCloudButtonContainer;