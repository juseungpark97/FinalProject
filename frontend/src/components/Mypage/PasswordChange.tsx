import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 사용
import styles from './css/MyPage.module.css';

const PasswordChange: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기

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
            const response = await axios.put('http://localhost:8088/api/users/change-password', {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // 서버로부터 success가 true로 반환되었는지 확인
            if (response.status === 200 && response.data === 'Password changed successfully') {
                alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요');

                // 로그아웃 처리
                localStorage.removeItem('authToken'); // 토큰 삭제
                sessionStorage.clear(); // 세션 스토리지 비우기

                // /login 페이지로 리다이렉트
                navigate('/login');
            } else {
                alert('비밀번호 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('네트워크 오류 또는 서버 응답 없음:', error);
            alert('네트워크 오류 또는 서버가 응답하지 않습니다.');
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