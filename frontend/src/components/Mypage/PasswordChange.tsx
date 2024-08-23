import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/MyPage.module.css';

const PasswordChange: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:8088/api/users/change-password',
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

            if (response.status === 200 && response.data.success) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
            } else {
                alert('비밀번호 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('비밀번호 변경 중 오류 발생:', error);
            alert('비밀번호 변경 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.myPage}>
            <div className={styles.content}>
                <h1>비밀번호 변경</h1>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>현재 비밀번호</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={styles.profilePwdInput}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>새 비밀번호</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={styles.profilePwdInput}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>새 비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.profilePwdInput}
                    />
                </div>
                <button onClick={handlePasswordChange} className={styles.menuLink}>
                    비밀번호 변경
                </button>
            </div>
        </div>
    );
};

export default PasswordChange;