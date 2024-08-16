import React, { useState, useEffect } from 'react';
import CinemaCloudButtonContainer from '../../components/Mypage/CinemaCloudButtonContainer';
import styles from './css/Account.module.css';
import Header from '../../../src/components/CommonPage/Header';
import OverView from '../../../src/components/Mypage/OverView';
import Membership from '../../../src/components/Mypage/Membership';
import Security from '../../../src/components/Mypage/Security';
import ProfileManagement from '../../../src/components/Mypage/ProfileManagement';
import AccountDelete from '../../../src/components/Mypage/AccountDelete';

const Account: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>('overview');
  const [profile, setProfile] = useState<{ profileImg: string; profileName: string; profileNo: number } | null>(null);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('selectedProfile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const handleProfileUpdate = (updatedProfile: { profileImg: string; profileName: string }) => {
    if (profile) {
      const updated = { ...profile, ...updatedProfile };
      setProfile(updated);
      sessionStorage.setItem('selectedProfile', JSON.stringify(updated));
    }
  };

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

  return (
    <div className={styles.account}>
      <Header selectedProfile={profile} setSelectedProfile={setProfile} />
      <div className={styles.mainContainer}>
        <div className={styles.sidebar}>
          <CinemaCloudButtonContainer onMenuClick={setSelectedMenu} />
        </div>
        <div className={styles.content}>
          {selectedMenu === 'profile' && profile && (
            <ProfileManagement profile={profile} onMenuClick={setSelectedMenu} onProfileUpdate={handleProfileUpdate} />
          )}
          {selectedMenu === 'overview' && <OverView />}
          {selectedMenu === 'membership' && <Membership />}
          {selectedMenu === 'security' && <Security />}
          {selectedMenu === 'accountDelete' && <AccountDelete />}
        </div>
      </div>
    </div>
  );
};

export default Account;