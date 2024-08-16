import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileImageSelectorModal from '../CommonPage/ProfileImageSelectorModal';
import styles from './css/MyPage.module.css';
import { FaPen } from 'react-icons/fa';

interface ProfileManagementProps {
    onMenuClick: (menu: string) => void;
    profile: {
        profileImg: string;
        profileName: string;
        profileNo: number;
    };
    onProfileUpdate: (updatedProfile: { profileImg: string; profileName: string }) => void; // 여기에 추가
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ onMenuClick, profile, onProfileUpdate }) => {
    const [selectedProfile, setSelectedProfile] = useState(profile);
    const [newProfileName, setNewProfileName] = useState<string>(profile.profileName);
    const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setSelectedProfile(profile);
    }, [profile]);

    const handleProfileUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('profileNo', String(selectedProfile.profileNo));
            formData.append('profileName', newProfileName);

            if (newProfileImage) {
                const imageBlob = await fetch(newProfileImage).then(r => r.blob());
                formData.append('profileImg', imageBlob, newProfileImage.split('/').pop());
            }

            const response = await axios.put('http://localhost:8088/api/profiles/update-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 && response.data.success) {
                const updatedProfile = {
                    ...selectedProfile,
                    profileName: response.data.profileName,
                    profileImg: response.data.profileImg
                };

                setSelectedProfile(updatedProfile);
                onProfileUpdate(updatedProfile); // 부모 컴포넌트 또는 Header에 업데이트를 전달
                setIsModalOpen(false);
                alert('프로필 변경이 완료되었습니다.');
            } else {
                console.error('Failed to update profile:', response.data);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPreviewImage(null);
    };

    const handleSelectImage = (imageName: string) => {
        const imageUrl = `http://localhost:8088/profile-images/${imageName}`;
        setPreviewImage(imageUrl);
        setNewProfileImage(imageName);
        setIsModalOpen(false);
    };

    return (
        <div className={styles.profileManagementPage}>
            <div className={styles.content}>
                <h1>프로필 관리</h1>
                <h3>프로필 상세 정보</h3>
                <div className={styles.profileSection}>
                    <div className={styles.profileImageContainer}>
                        <img
                            src={previewImage || (selectedProfile.profileImg)}
                            alt="Profile"
                            className={styles.profileImage}
                            onClick={openModal}
                        />
                        <div className={styles.editIconContainer} onClick={openModal}>
                            <FaPen className={styles.editIcon} />
                        </div>
                    </div>
                    <div className='profile'>
                        <div className={styles.profileActions}>
                            <input
                                type="text"
                                value={newProfileName}
                                onChange={(e) => setNewProfileName(e.target.value)}
                                className={styles.nameInput}
                            />
                        </div>
                        <a href="#" onClick={handleProfileUpdate} className={styles.link}>프로필 저장</a>
                        <a href="/password-change" className={styles.link}>비밀번호 변경</a>
                    </div>
                </div>
            </div>

            <ProfileImageSelectorModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSelect={handleSelectImage}
            />

            <div className={styles.content}>
                <h3>프로필 설정</h3>
                <div className={styles.quickLinks}>
                    <ul>
                        <li><a href="/watch-settings">시청 제한 <span className={styles.arrow}>&gt;</span></a></li>
                        <li><a href="/watch-history">시청 기록 <span className={styles.arrow}>&gt;</span></a></li>
                        <li><a href="/payment-info">결제정보 <span className={styles.arrow}>&gt;</span></a></li>
                        <li><a href="/privacy-policy">개인정보 및 데이터 설정 <span className={styles.arrow}>&gt;</span></a></li>
                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onMenuClick('accountDelete');
                                }}
                                className={styles.link}
                            >
                                회원 탈퇴 <span className={styles.arrow}>&gt;</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagement;