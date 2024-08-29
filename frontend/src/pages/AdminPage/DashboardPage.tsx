import React, { useState } from 'react';
import SideMenu from '../../../src/components/AdminPage/SideMenu';
import styles from './css/DashboardPage.module.css';
import Header from '../../../src/components/CommonPage/Header';
import ManageMain from '../../../src/components/AdminPage/ManageMain';
import { Route, Routes } from 'react-router-dom';
import MovieManage from '../../../src/components/AdminPage/MovieManage';
import MemverManage from '../../../src/components/AdminPage/MemberManage';
import ManageFAQ from '../../../src/components/AdminPage/ManageFAQ';
import InsertFAQ from '../../../src/components/AdminPage/InsertFAQ';
import ChattingList from '../../../src/components/AdminPage/ChattingList';
import UploadMovie from './UploadMovie';
import { Profile } from '../../types/Profile';

const DashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  return (
    <>
      <div className={styles.dashboardPage}>
        <SideMenu />
        <div className={styles.content}>
          <Routes>
            {/* 기본 경로: /dashboard */}
            <Route path="/" element={<ManageMain />} />

            {/* 하위 경로들: /dashboard/... */}
            <Route path="/movieManage" element={<MovieManage />} />
            <Route path="/insertMovie" element={<UploadMovie />} />
            <Route path="/memberManage" element={<MemverManage />} />
            <Route path="/FAQManage" element={<ManageFAQ />} />
            <Route path="/FAQManage/:page" element={<ManageFAQ />} />
            <Route path="/FAQManage/InsertFAQ" element={<InsertFAQ />} />
            <Route path="/FAQManage/InsertFAQ/:id" element={<InsertFAQ />} />
            <Route path="/1on1chat" element={<ChattingList />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
