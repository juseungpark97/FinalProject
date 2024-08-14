import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/ProfileImageSelectorModal.module.css';

interface ProfileImageSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (imageName: string) => void;
}

const ProfileImageSelectorModal: React.FC<ProfileImageSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:8088/api/profiles/available-images');
                console.log('Fetched images:', response.data); // 응답 데이터 확인
                if (Array.isArray(response.data)) {
                    setImages(response.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                    setError('서버에서 예상치 못한 응답을 받았습니다.');
                }
            } catch (error) {
                console.error('Error fetching images:', error);
                setError('이미지를 불러오는 중 오류가 발생했습니다.');
            }
        };

        if (isOpen) {
            setImages([]);
            setError(null);
            fetchImages();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>프로필 이미지 선택</h2>
                {error ? (
                    <p className={styles.errorMessage}>{error}</p>
                ) : (
                    <div className={styles.imageGrid}>
                        {images.length > 0 ? (
                            images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:8088/profile-images/${image}`}
                                    alt={`Profile option ${index + 1}`}
                                    className={styles.imageOption}
                                    onClick={() => onSelect(image)}
                                />
                            ))
                        ) : (
                            <p>이미지가 없습니다.</p>
                        )}
                    </div>
                )}
                <div className={styles.modalActions}>
                    <button onClick={onClose} className={styles.cancelButton}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileImageSelectorModal;