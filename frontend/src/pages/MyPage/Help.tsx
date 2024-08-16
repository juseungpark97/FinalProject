
import React, { useEffect, useState } from 'react';

import HelpButtonContainer from '../../components/Mypage/HelpButtonContainer';
import styles from './css/Account.module.css';
import Header from '../../../src/components/CommonPage/Header';
import Faq from '../../components/Mypage/Faq';
import Question from '../../components/Mypage/Question';

import axios from 'axios';


const HelpPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>('faq');

  return (
    <div className={styles.account}>
      <Header />
      <div className={styles.mainContainer}>
        <div className={styles.sidebar}>
          <HelpButtonContainer onMenuClick={setSelectedMenu} />
        </div>
        <div className={styles.content}>

          {selectedMenu === 'faq' && <Faq />}
          {selectedMenu === 'question' && <Question />}


        </div>

      </div>
    </div >
  );
};

export default HelpPage;