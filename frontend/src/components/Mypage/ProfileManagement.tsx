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
        profileMain: string; // profileMain 속성 추가
    };
    onProfileUpdate: (updatedProfile: { profileImg: string; profileName: string }) => void;
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

            // 이미지가 제공되었는지 확인하고 추가
            if (newProfileImage) {
                formData.append('imageName', newProfileImage);  // 새로운 이미지가 있는 경우에만 추가
            } else {
                console.log('No new profile image provided. Keeping the existing image.');
            }

            // 프로필 이름이 변경되었는지 확인하고 추가
            if (newProfileName && newProfileName !== selectedProfile.profileName) {
                formData.append('profileName', newProfileName);
            }

            // 서버로 요청 전송
            const response = await axios.put(`http://localhost:8088/api/profiles/${selectedProfile.profileNo}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 && response.data.success) {
                const updatedProfile = {
                    ...selectedProfile,
                    profileImg: response.data.profileImg || selectedProfile.profileImg,  // 이미지가 업데이트되지 않은 경우 기존 이미지 유지
                    profileName: response.data.profileName || selectedProfile.profileName,  // 이름이 업데이트되지 않은 경우 기존 이름 유지
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
        console.log("Selected Image URL: ", imageUrl); // 디버그용
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
                        <button onClick={handleProfileUpdate} className={styles.link}>프로필 저장</button><br></br>
                        {/* profileMain이 'M'일 경우에만 비밀번호 변경 버튼 표시 */}
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
                            <button onClick={() => window.location.href = '/payment-info'} className={styles.menuLink}>
                                결제정보 <span className={styles.arrow}>&gt;</span>
                            </button>
                        </li>
                        <li>
                            <a
                                href=""
                                onClick={(e) => {
                                    e.preventDefault();
                                    onMenuClick('profileLock');
                                }}
                                className={styles.menuLink}
                            >
                                프로필 잠금 <span className={styles.arrow}>&gt;</span>
                            </a>
                        </li>
                        {selectedProfile.profileMain !== 'S' && (
                            <li>
                                <a
                                    href=""
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onMenuClick('accountDelete');
                                    }}
                                    className={styles.menuLink}
                                >
                                    회원 탈퇴 <span className={styles.arrow}>&gt;</span>
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagement;