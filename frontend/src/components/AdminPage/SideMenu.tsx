import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './css/Dashboard.module.css';

const SideMenu: React.FC = () => {
  return (
    <div className={styles.sideMenu}>
      <h1 className={styles.logo}>CINEMA CLOUD</h1>
      <ul className={styles.menu}>
        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/movieManage"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`
            }
          >
            영화관리
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/memberManage"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`
            }
          >
            회원관리
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/FAQManage"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`
            }
          >
            자주하는질문(FAQ)
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/1on1chat"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`
            }
          >
            1대1채팅
          </NavLink>
        </li>
        <li className={styles.menuSeparator} />
        <li>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`
            }
          >
            영화 추가
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
