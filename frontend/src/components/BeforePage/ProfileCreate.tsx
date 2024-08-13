import React, { useState } from 'react';
import axios from 'axios';
import ProfileImageSelectorModal from '../CommonPage/ProfileImageSelectorModal'; // 모달 컴포넌트 임포트
import styles from '../../components/BeforePage/css/ProfileCreate.module.css';

interface Profile {
    profileNo: number;
    profileImg: string;
    profileName: string;
}

interface ProfileCreateProps {
    onProfileCreated: (newProfile: Profile) => void;
    onCancel: () => void; // 취소 버튼 클릭 시 호출되는 콜백
}

const ProfileCreate: React.FC<ProfileCreateProps> = ({ onProfileCreated, onCancel }) => {
    const [newProfileName, setNewProfileName] = useState('');
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null); // 이미지 파일을 위한 상태
    const [newProfileImagePreview, setNewProfileImagePreview] = useState<string | null>(null); // 미리보기 이미지 URL을 위한 상태
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

    const handleCreateProfile = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('로그인이 필요합니다.');
            return;
        }

        if (!newProfileName || !newProfileImage) {
            setError('프로필 이름과 이미지를 모두 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('profileName', newProfileName);
        formData.append('profileImg', newProfileImage as Blob); // 이미지 파일을 FormData에 추가

        try {
            const response = await axios.post('http://localhost:8088/api/profiles/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                const createdProfile: Profile = response.data;
                onProfileCreated(createdProfile);
                setNewProfileName('');
                setNewProfileImage(null);
                setNewProfileImagePreview(null); // 미리보기 이미지 초기화
                setError(null);
            } else {
                setError('프로필 생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('프로필 생성 중 오류 발생:', error);
            setError('프로필 생성 중 오류가 발생했습니다.');
        }
    };

    const handleSelectImage = (imageName: string) => {
        const fileUrl = `http://localhost:8088/profile-images/${imageName}`;
        fetch(fileUrl)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], imageName, { type: blob.type });
                setNewProfileImage(file); // 이미지 파일 상태에 설정
                setNewProfileImagePreview(URL.createObjectURL(file)); // 미리보기 이미지 URL 설정
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error('이미지 로드 중 오류 발생:', error);
            });
    };

    return (
        <div className={styles.profileCreate}>
            <h2>새 프로필을 생성하세요</h2>
            <input
                type="text"
                placeholder="프로필 이름"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className={styles.input}
            />
            <button onClick={() => setIsModalOpen(true)} className={styles.selectImageButton}>
                프로필 이미지 선택
            </button>

            {/* 선택한 프로필 이미지 미리보기 */}
            {newProfileImagePreview && (
                <div className={styles.previewContainer}>

                    <img src={newProfileImagePreview} alt="Profile Preview" className={styles.profileImage} />
                </div>
            )}

            <button onClick={handleCreateProfile} className={styles.createButton}>프로필 생성</button>
            <button onClick={onCancel} className={styles.cancelButton}>취소</button>
            {error && <p className={styles.error}>{error}</p>}

            {/* 모달 컴포넌트 */}
            <ProfileImageSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectImage}
            />
        </div>
    );
};

export default ProfileCreate;