import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileImageSelectorModal from '../CommonPage/ProfileImageSelectorModal';
import PaymentInfo from './PaymentInfo';
import styles from './css/MyPage.module.css';
import { FaPen } from 'react-icons/fa';

interface ProfileManagementProps {
    onMenuClick: (menu: string) => void;
    profile: {
        profileImg: string;
        profileName: string;
        profileNo: number;
        profileMain: string;
    };
    onProfileUpdate: (updatedProfile: { profileImg: string; profileName: string }) => void;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ onMenuClick, profile, onProfileUpdate }) => {
    const [selectedProfile, setSelectedProfile] = useState(profile);
    const [newProfileName, setNewProfileName] = useState<string>(profile.profileName);
    const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showPaymentInfo, setShowPaymentInfo] = useState<boolean>(false);

    useEffect(() => {
        setSelectedProfile(profile);
    }, [profile]);

    const handleProfileUpdate = async () => {
        try {
            const formData = new FormData();

            if (newProfileImage) {
                formData.append('imageName', newProfileImage);
            }

            if (newProfileName && newProfileName !== selectedProfile.profileName) {
                formData.append('profileName', newProfileName);
            }

            const response = await axios.put(`http://localhost:8088/api/profiles/${selectedProfile.profileNo}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 && response.data.success) {
                const updatedProfile = {
                    ...selectedProfile,
                    profileImg: response.data.profileImg || selectedProfile.profileImg,
                    profileName: response.data.profileName || selectedProfile.profileName,
                };

                setSelectedProfile(updatedProfile);
                onProfileUpdate(updatedProfile);
                alert('프로필이 성공적으로 업데이트되었습니다.');
            } else {
                console.error('Failed to update profile:', response.data);
                alert('프로필 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('프로필 업데이트 중 오류가 발생했습니다.');
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
        const imageUrl = `/profile-images/${imageName}`;
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
                            src={previewImage || selectedProfile.profileImg}
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
                        <button onClick={handleProfileUpdate} className={styles.link}>프로필 저장</button><br></br>
                        {selectedProfile.profileMain === 'M' && (
                            <button onClick={() => onMenuClick('passwordChange')} className={styles.link}>
                                비밀번호 변경
                            </button>
                        )}
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
                        <li>
                            <button
                                onClick={() => onMenuClick('likedMovies')}  // 좋아요 한 영상 메뉴 클릭 시 실행
                                className={styles.menuLink}
                            >
                                좋아요 한 영상 <span className={styles.arrow}>&gt;</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                                className={styles.menuLink}
                            >
                                결제정보 <span className={styles.arrow}>&gt;</span>
                            </button>
                            {showPaymentInfo && <PaymentInfo profileId={selectedProfile.profileNo} />}
                        </li>
                        <li>
                            <button
                                onClick={() => onMenuClick('profileLock')}
                                className={styles.menuLink}
                            >
                                프로필 잠금 <span className={styles.arrow}>&gt;</span>
                            </button>
                        </li>
                        {selectedProfile.profileMain !== 'S' && (
                            <li>
                                <button
                                    onClick={() => onMenuClick('accountDelete')}
                                    className={styles.menuLink}
                                >
                                    회원 탈퇴 <span className={styles.arrow}>&gt;</span>
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagement;