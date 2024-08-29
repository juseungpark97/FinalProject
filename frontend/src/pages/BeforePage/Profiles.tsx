import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCreate from '../../components/BeforePage/ProfileCreate';
import ProfileSelect from '../../components/BeforePage/ProfileSelect';
import ConfirmModal from '../../components/BeforePage/ConfirmModal';
import ProfilePasswordModal from '../../components/BeforePage/ProfilePasswordModal';
import styles from './css/Profiles.module.css';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../../types/Profile';

const ProfilePage: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<string>('select');
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // 비밀번호 모달 상태 추가
    const navigate = useNavigate();

    const highestScoreProfile = profiles.reduce((maxProfile, profile) => {
        return profile.tetrisHighScore > (maxProfile?.tetrisHighScore || 0) ? profile : maxProfile;
    }, null as Profile | null);



    useEffect(() => {
        // URL에서 토큰 추출
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // 로컬 스토리지에 토큰 저장
            localStorage.setItem('kakaoAccessToken', token);
        }
    }, [location]);



    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const kakaoAccessToken = localStorage.getItem("kakaoAccessToken");

        if (token) {
            axios.get('http://localhost:8088/api/users/subscription-status', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    const isSubscribed = response.data.isSubscribed;
                    if (!isSubscribed) {
                        navigate('/subscribe'); // 구독자가 아니라면 구독 페이지로 리디렉션
                    }
                    else {
                        axios.get('http://localhost:8088/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } })
                            .then(response => {
                                const userNo = response.data.userNo;
                                axios.get(`http://localhost:8088/api/profiles/user/${userNo}`, { headers: { 'Authorization': `Bearer ${token}` } })
                                    .then(response => {
                                        if (Array.isArray(response.data)) {
                                            const profilesWithLockedStatus = response.data.map((profile: any) => ({
                                                ...profile,
                                                isLocked: profile.locked, // 서버에서 받은 locked 필드를 isLocked로 매핑
                                            }));
                                            setProfiles(profilesWithLockedStatus);
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
                    }
                }
                )
        } else if (kakaoAccessToken) {
            axios.get('http://localhost:8088/api/users/subscription-status-kakao', {
                headers: { 'Authorization': `Bearer ${kakaoAccessToken}` }
            })
                .then(response => {
                    const isSubscribed = response.data.isSubscribed;
                    if (!isSubscribed) {
                        navigate('/subscribe'); // 구독자가 아니라면 구독 페이지로 리디렉션
                    }
                    else {
                        axios.get('http://localhost:8088/api/users/meKaKao', { headers: { 'Authorization': `Bearer ${kakaoAccessToken}` } })
                            .then(response => {
                                const userNo = response.data.userNo;
                                axios.get(`http://localhost:8088/api/profiles/user/${userNo}`, { headers: { 'Authorization': `Bearer ${kakaoAccessToken}` } })
                                    .then(response => {
                                        if (Array.isArray(response.data)) {
                                            const profilesWithLockedStatus = response.data.map((profile: any) => ({
                                                ...profile,
                                                isLocked: profile.locked, // 서버에서 받은 locked 필드를 isLocked로 매핑
                                            }));
                                            setProfiles(profilesWithLockedStatus);
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
                    }
                }
                )

        }


        else {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        if (selectedMenu === 'select') {
            sessionStorage.removeItem('selectedProfile');
        }
    }, [selectedMenu]);

    const handleProfileSelect = (profile: Profile) => {
        if (profile.isLocked) {
            setSelectedProfile(profile);
            setIsPasswordModalOpen(true); // 비밀번호 모달을 열기
        } else {
            proceedToSelectProfile(profile); // 잠금이 없으면 바로 프로필 선택
        }
    };

    const proceedToSelectProfile = (profile: Profile) => {
        setSelectedProfile(profile);
        sessionStorage.setItem('selectedProfile', JSON.stringify(profile));
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

    const handleProfileDelete = (profileNo: number) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            axios.delete(`http://localhost:8088/api/profiles/${profileNo}`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(response => {
                    if (response.status === 200) {
                        setProfiles(profiles.filter(profile => profile.profileNo !== profileNo));
                        console.log('Profile deleted:', profileNo);
                    } else {
                        console.error('Failed to delete profile');
                    }
                })
                .catch(error => {
                    console.error('Error deleting profile:', error);
                });
        } else {
            console.error('토큰이 없습니다');
        }
    };

    const openDeleteModal = (profile: Profile) => {
        if (profile.profileMain === 'M') { // 메인 계정인지 확인
            alert('메인 계정은 삭제할 수 없습니다.');
        } else {
            setProfileToDelete(profile);
            setModalOpen(true);
        }
    };

    const confirmDelete = () => {
        if (profileToDelete) {
            handleProfileDelete(profileToDelete.profileNo);
            setModalOpen(false);
        }
    };

    const handlePasswordVerified = () => {
        if (selectedProfile) {
            setIsPasswordModalOpen(false);
            proceedToSelectProfile(selectedProfile); // 비밀번호 검증이 완료되면 프로필 선택 진행
        }
    };

    return (
        <div className={styles.profilePage}>
            {selectedMenu === 'create' && <ProfileCreate onProfileCreated={handleProfileCreated} onCancel={handleCancelCreate} />}
            {selectedMenu === 'select' && (
                <>
                    <ProfileSelect
                        profiles={profiles}
                        onProfileSelect={handleProfileSelect}
                        onAddProfile={handleAddProfile}
                        onProfileDelete={openDeleteModal} // 삭제 모달 오픈 함수 전달
                        highestScoreProfile={highestScoreProfile} // 하이스코어 프로필 전달
                    />
                    <ConfirmModal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onConfirm={confirmDelete}
                        message="정말로 삭제하시겠습니까?"
                    />
                    {selectedProfile && (
                        <ProfilePasswordModal
                            profile={selectedProfile}
                            isOpen={isPasswordModalOpen}
                            onClose={() => setIsPasswordModalOpen(false)}
                            onPasswordVerified={handlePasswordVerified}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ProfilePage;