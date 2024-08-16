import React, { useState } from 'react';
import styles from './css/PasswordModal.module.css';  // 모달을 위한 CSS 파일 추가

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [password, setPassword] = useState('');

    const handleConfirm = () => {
        onConfirm(password);
        setPassword('');  // 비밀번호 초기화
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>비밀번호 확인</h2>
                <p>계정을 삭제하려면 비밀번호를 입력하세요.</p>
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />
                <div className={styles.modalActions}>
                    <button onClick={handleConfirm} className={styles.confirmButton}>확인</button>
                    <button onClick={onClose} className={styles.cancelButton}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;