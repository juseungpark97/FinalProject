import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCreate from '../../components/BeforePage/ProfileCreate';
import ProfileSelect from '../../components/BeforePage/ProfileSelect';
import styles from './css/Profiles.module.css';
import { useNavigate } from 'react-router-dom';

interface Profile {
    profileNo: number;
    profileImg: string;
    profileName: string;
}

const ProfilePage: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<string>('select');
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            axios.get('http://localhost:8088/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } })
                .then(response => {
                    const userNo = response.data.userNo;
                    axios.get(`http://localhost:8088/api/profiles/user/${userNo}`, { headers: { 'Authorization': `Bearer ${token}` } })
                        .then(response => {
                            if (Array.isArray(response.data)) {
                                setProfiles(response.data);
                                if (response.data.length > 0) {
                                    setSelectedMenu('select');
                                }
                            } else {
                                console.error('프로필 데이터가 배열이 아닙니다:', response.data);
                            }
                        })
                        .catch(error => {
                            console.error('프로필 조회 중 오류 발생:', error);
                        });
                })
                .catch(error => {
                    console.error('사용자 정보 조회 중 오류 발생:', error);
                    if (error.response && error.response.status === 403) {
                        navigate('/subscribe');  // 구독이 필요하면 구독 페이지로 리디렉션
                    }
                });
        } else {
            console.error('토큰이 없습니다');
        }
    }, [navigate]);

    useEffect(() => {
        // 프로필 선택 화면으로 돌아올 때 세션 스토리지에서 selectedProfile 정보 삭제
        if (selectedMenu === 'select') {
            sessionStorage.removeItem('selectedProfile');
        }
    }, [selectedMenu]);

    const handleProfileSelect = (profile: Profile) => {
        setSelectedProfile(profile);
        console.log('Selected profile:', profile);

        // 선택된 프로필 정보를 sessionStorage에 저장
        sessionStorage.setItem('selectedProfile', JSON.stringify(profile));

        // home 페이지로 이동
        navigate('/home');
    };

    const handleProfileCreated = (newProfile: Profile) => {
        setProfiles([...profiles, newProfile]);
        setSelectedMenu('select');
    };

    const handleAddProfile = () => {
        setSelectedMenu('create');
    };

    const handleCancelCreate = () => {
        setSelectedMenu('select');
    };

    return (
        <div className={styles.profilePage}>
            {selectedMenu === 'create' && <ProfileCreate onProfileCreated={handleProfileCreated} onCancel={handleCancelCreate} />}
            {selectedMenu === 'select' && <ProfileSelect profiles={profiles} onProfileSelect={handleProfileSelect} onAddProfile={handleAddProfile} />}
        </div>
    );
};

export default ProfilePage;
