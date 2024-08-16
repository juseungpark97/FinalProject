import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './css/HelpButtonContainer.module.css';

interface Props {
  onMenuClick: (menu: string) => void;
}

const HelpButtonContainer: React.FC<Props> = ({ onMenuClick }) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('faq');
  const pathToMenuMap: Record<string, string> = {
    '/faq': 'faq',
    '/question': 'question'
  };

  useEffect(() => {
    const menu = pathToMenuMap[location.pathname] || 'faq';
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
          <div className='faq'>
            <button
              onClick={() => { onMenuClick('faq'); setActiveMenu('faq'); }}
              className={`${styles.menuItem} ${activeMenu === 'faq' ? styles.active : ''}`}
            >
              <img src="homeButton2.png" alt="자주하는 질문" className={styles.icon} />
              FAQ
            </button>
          </div>
        </li>
        <li>
          <div className='question'>
            <button
              onClick={() => {setActiveMenu('question');  onMenuClick('question');  }}
              className={`${styles.menuItem} ${activeMenu === 'question' ? styles.active : ''}`}
            >
              <img src="myPage2.png" alt="1:1문의" className={styles.icon} />
              1:1문의
            </button>
          </div>
        </li>

      </ul>
    </div>
  );
};

export default HelpButtonContainer;