import React, { useState, useEffect } from 'react';
import CinemaCloudButtonContainer from '../../components/Mypage/CinemaCloudButtonContainer';
import styles from './css/Account.module.css';
import Header from '../../../src/components/CommonPage/Header';
import OverView from '../../../src/components/Mypage/OverView';
import Membership from '../../../src/components/Mypage/Membership';
import Security from '../../../src/components/Mypage/Security';
import ProfileManagement from '../../../src/components/Mypage/ProfileManagement';
import AccountDelete from '../../../src/components/Mypage/AccountDelete';
import { Profile } from '../../types/Profile';
import PasswordChange from '../../components/Mypage/PasswordChange';
import ProfileLock from '../../components/Mypage/ProfileLock';
import PhoneChange from '../../components/Mypage/PhoneChange';
import HeartList from '../../components/Mypage/HeartList';

const Account: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>('overview');
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    try {
      const storedProfile = sessionStorage.getItem('selectedProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Failed to parse stored profile:', error);
    }
  }, []);

  const handleProfileUpdate = (updatedProfile: { profileImg: string; profileName: string }) => {
    if (profile) {
      const updated = { ...profile, ...updatedProfile };
      setProfile(updated);
      sessionStorage.setItem('selectedProfile', JSON.stringify(updated));
    } else {
      console.warn('No profile available to update');
    }
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const handlePhoneChangeSuccess = () => {
    setSelectedMenu('security');  // 핸드폰 변경 성공 시 Security 메뉴로 리다이렉트
  };

  return (
    <div className={styles.account}>
      <Header selectedProfile={profile} setSelectedProfile={setProfile} />
      <div className={styles.mainContainer}>
        <div className={styles.sidebar}>
          <CinemaCloudButtonContainer onMenuClick={setSelectedMenu} profileMain={profile?.profileMain || 'S'} />
        </div>
        <div className={styles.content}>
          {selectedMenu === 'profile' && profile && (
            <ProfileManagement profile={profile} onMenuClick={setSelectedMenu} onProfileUpdate={handleProfileUpdate} />
          )}
          {selectedMenu === 'overview' && <OverView />}
          {selectedMenu === 'membership' && <Membership />}
          {selectedMenu === 'security' && <Security onMenuClick={handleMenuClick} />}
          {selectedMenu === 'passwordChange' && <PasswordChange />}
          {selectedMenu === 'phoneChange' && <PhoneChange onPhoneChangeSuccess={handlePhoneChangeSuccess} />}
          {selectedMenu === 'accountDelete' && profile?.profileMain === 'M' && <AccountDelete />}
          {selectedMenu === 'profileLock' && profile && (
            <ProfileLock profileId={profile.profileNo} />
          )}
          {selectedMenu === 'likedMovies' && profile && <HeartList profileNo={profile.profileNo} />}
        </div>
      </div>
    </div>
  );
};

export default Account;