
import React, { useEffect, useState } from 'react';

import HelpButtonContainer from '../../components/Mypage/HelpButtonContainer';
import styles from './css/Account.module.css';
import Header from '../../../src/components/CommonPage/Header';
import Faq from '../../components/Mypage/Faq';
import Question from '../../components/Mypage/Question';

import axios from 'axios';
import { Profile } from '../../types/Profile';


const HelpPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>('faq');
  const [profile, setProfile] = useState<Profile | null>(null);
  const profileNo = profile?.profileNo || null;

  return (
    <div className={styles.account}>
      <Header selectedProfile={profile} setSelectedProfile={setProfile} />
      <div className={styles.mainContainer}>
        <div className={styles.sidebar}>
          <HelpButtonContainer onMenuClick={setSelectedMenu} />
        </div>
        <div className={styles.content}>
          {selectedMenu === 'faq' && <Faq />}
          {selectedMenu === 'question' && <Question profileNo={profileNo} />}
        </div>
      </div>
    </div >
  );
};

export default HelpPage;