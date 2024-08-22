import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PasswordModal from './PasswordModal';  // 모달 컴포넌트 임포트
import styles from './css/MyPage.module.css';

const AccountDelete: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAccountDelete = async (password: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.delete('http://localhost:8088/api/users/delete', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                alert('회원 탈퇴가 완료되었습니다.');
                sessionStorage.clear();
                localStorage.clear();
                navigate('/login');
            } else {
                alert('회원 탈퇴에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원 탈퇴 중 오류 발생:', error);
            alert('회원 탈퇴 중 오류가 발생했습니다.');
        }
    }

    return (
        <div className={styles.myPage}>
            <div className={styles.content}>
                <h1>회원 탈퇴</h1>
                <h3>회원 정보 삭제</h3>
                <div className={styles.quickLinks}>
                    <ul>
                        <li>정말로 회원을 탈퇴하시겠습니까? </li>
                    </ul>
                    <ul>
                        <li>한번 탈퇴하면 돌이킬 수 없습니다.</li>
                    </ul>
                    <button onClick={() => setIsModalOpen(true)} className={styles.deleteButton}>회원 탈퇴</button>
                </div>
            </div>

            {/* 비밀번호 모달 */}
            <PasswordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={(password) => {
                    setIsModalOpen(false);
                    handleAccountDelete(password);
                }}
            />
        </div>
    );
};

export default AccountDelete;