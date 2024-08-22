import React, { useState } from 'react';
import axios from 'axios';
import { Profile } from '../../types/Profile';
import styles from '../BeforePage/css/ConfirmModal.module.css';

interface ProfilePasswordModalProps {
    profile: Profile;
    isOpen: boolean;
    onClose: () => void;
    onPasswordVerified: () => void;
}

const ProfilePasswordModal: React.FC<ProfilePasswordModalProps> = ({ profile, isOpen, onClose, onPasswordVerified }) => {
    const [password, setPassword] = useState('');

    const handlePasswordSubmit = async () => {
        try {
            const response = await axios.post(`http://localhost:8088/api/profiles/${profile.profileNo}/verify-password`, { password });  // 확인된 올바른 URL
            if (response.data.success) {
                onPasswordVerified();
            } else {
                alert('잘못된 비밀번호입니다.');
            }
        } catch (error) {
            alert('비밀번호 검증에 실패했습니다.');
            console.error('Password verification error:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handlePasswordSubmit();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h4>프로필 비밀번호 입력</h4>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    maxLength={4}  // 최대 입력 길이 4글자로 제한
                    onKeyDown={handleKeyDown}
                />
                <div>
                    <button onClick={handlePasswordSubmit} className={styles.confirmButton}>확인</button>
                    <button onClick={onClose} className={styles.cancelButton}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePasswordModal;