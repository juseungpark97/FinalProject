import React, { useEffect, useState } from 'react';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';
import Pagination from './Pagination';
import axios from 'axios';
import StopModal from './stopAccountModal';
import UnstopModal from './UnstopAccountModal';

interface User {
  userNo: number;
  username: string;
  status: string;
  email: string;
  birthday: string;
  phone: string;
  createdAt: string;
}

interface Profile {
  profileNo: number;
  profileName: string;
  profileVector: string | null;
  userNo: { userNo: number };
}

interface StopInfo {
  reason: string;
  stopDate: string;
}

const formatProfileVector = (profileVector: string | null): string => {
  if (!profileVector) {
    return ''; // profileVector가 null일 경우 빈 문자열 반환
  }

  try {
    // profileVector를 JSON 객체로 파싱
    const profileObject: { [key: string]: number } = JSON.parse(profileVector);
    if (typeof profileObject === 'object' && profileObject !== null) {
      // Object.entries를 사용하여 객체의 키-값 쌍을 배열로 변환
      const entries = Object.entries(profileObject) as [string, number][];

      // 값을 기준으로 내림차순 정렬
      const sortedEntries = entries.sort((a, b) => b[1] - a[1]);

      // 최대 4개의 항목 추출
      const topEntries = sortedEntries.slice(0, 4);

      // 결과를 문자열로 변환하여 반환
      return topEntries.map(entry => `${entry[0]}: ${entry[1]}`).join(', ');
    }
    return '';
  } catch (error) {
    console.error('Error parsing profile vector', error);
    return '';
  }
};

export default function MemberManage() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [membersData, setMembersData] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]); // 검색 결과를 저장할 상태
  const [profilesData, setProfilesData] = useState<{ [key: number]: Profile[] }>({});
  const [selectedUserNo, setSelectedUserNo] = useState<number | null>(null);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isUnstopModalOpen, setIsUnstopModalOpen] = useState(false);
  const [stopInfo, setStopInfo] = useState<StopInfo | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'stopped'>('all');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8088/dashboard/getUser');
      console.log('Response data:', response.data);

      const { userList, profileList } = response.data;

      if (!Array.isArray(userList) || !Array.isArray(profileList)) {
        throw new Error('Invalid data format');
      }

      const updatedMembers = userList.map((item: User) => ({
        ...item,
        phone: item.phone && item.phone.length === 11
          ? `${item.phone.slice(0, 3)}-${item.phone.slice(3, 7)}-${item.phone.slice(7)}`
          : item.phone,
        createdAt: item.createdAt ? item.createdAt.substring(0, 10) : 'N/A'
      }));

      const profilesByUser: { [key: number]: Profile[] } = profileList.reduce((acc: { [key: number]: Profile[] }, profile: Profile) => {
        const userNo = profile.userNo ? profile.userNo.userNo : -1;
        if (!acc[userNo]) {
          acc[userNo] = [];
        }
        acc[userNo].push(profile);
        return acc;
      }, {});

      setMembersData(updatedMembers);
      setFilteredMembers(updatedMembers); // 초기 상태로 필터링된 데이터 설정
      setProfilesData(profilesByUser);
    } catch (error) {
      console.error("Failed to get user data", error);
    }
  };

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    // 검색 버튼 클릭 시 필터링된 데이터 업데이트
    const filtered = membersData
      .filter((member) => member.username.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((member) => viewMode === 'all' || member.status === 'S');
    setFilteredMembers(filtered);
    setCurrentPage(1); // 검색 후 첫 페이지로 리셋
  };

  const filteredMembersWithMode = filteredMembers
    .filter((member) => viewMode === 'all' || member.status === 'S');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMembersWithMode.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const stopAccount = async (userNo: number, event: React.MouseEvent) => {
    event.preventDefault(); // 기본 동작을 막음
    event.stopPropagation(); // 이벤트 전파를 막음

    const selectedMember = membersData.find(member => member.userNo === userNo);

    if (selectedMember?.status === 'A') {
      setSelectedUserNo(userNo);
      setIsStopModalOpen(true);
    } else if (selectedMember?.status === 'S') {
      try {
        const response = await axios.get(`http://localhost:8088/dashboard/getStopInfo/${userNo}`);
        const { reason, stopDate } = response.data;
        setStopInfo({ reason, stopDate });
        setSelectedUserNo(userNo);
        setIsUnstopModalOpen(true);
      } catch (error) {
        console.error('Failed to fetch stop info', error);
      }
    }
  };

  const handleConfirmStop = async (reason: string) => {
    if (selectedUserNo !== null) {
      try {
        await axios.post('http://localhost:8088/dashboard/stopAccount', {
          reason,
          userNo: selectedUserNo
        });
        // 데이터 새로고침
        await fetchData();
      } catch (error) {
        console.error("정지하기 기능 수행 중 에러가 발생했습니다:", error);
      }
    }
    setIsStopModalOpen(false);
  };

  const handleConfirmUnstop = async () => {
    if (selectedUserNo !== null) {
      try {
        await axios.post('http://localhost:8088/dashboard/unstopAccount', { userNo: selectedUserNo });
        // 데이터 새로고침
        await fetchData();
      } catch (error) {
        console.error("정지 해제 기능 수행 중 에러가 발생했습니다:", error);
      }
    }
    setIsUnstopModalOpen(false);
  };

  const handleCancelUnstop = () => {
    setIsUnstopModalOpen(false);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.movimanage}>회원 관리</h1>
        <a onClick={() => setViewMode('all')}>전체회원</a>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a onClick={() => setViewMode('stopped')}>정지회원</a>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="회원명"
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button type="button" onClick={handleSearchClick} className={styles.searchButton}>
            검색
          </button>
        </div>
      </div>
      <div>
        <table className={styles.tg}>
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr id={styles.firstrow}>
              <th>회원번호</th>
              <th>닉네임</th>
              <th>아이디 / 이메일</th>
              <th>핸드폰번호</th>
              <th>생년월일</th>
              <th>가입일</th>
              <th>정지여부</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((member) => (
              <>
                <tr onClick={() => handleRowClick(member.userNo)} key={member.userNo}>
                  <td>{member.userNo}</td>
                  <td>{member.username}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{member.birthday}</td>
                  <td>{member.createdAt}</td>
                  <td>
                    <button onClick={(e) => stopAccount(member.userNo, e)}>
                      {member.status === 'A' ? '정지하기' : '정지해제'}
                    </button>
                  </td>
                </tr>
                {expandedRow === member.userNo && (
                  <tr>
                    <td colSpan={7} className={styles.expandedRow}>
                      <table>
                        <thead>
                          <tr>
                            <th>프로필 번호</th>
                            <th>프로필 이름</th>
                            <th>선호장르</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profilesData[member.userNo]?.map((profile) => (
                            <tr key={profile.profileNo}>
                              <td>{profile.profileNo}</td>
                              <td>{profile.profileName}</td>
                              <td>{formatProfileVector(profile.profileVector)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredMembersWithMode.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      <StopModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        onConfirm={handleConfirmStop}
      />
      <UnstopModal
        isOpen={isUnstopModalOpen}
        onClose={handleCancelUnstop}
        stopInfo={stopInfo}
        onConfirm={handleConfirmUnstop}
      />
    </div>
  );
}
