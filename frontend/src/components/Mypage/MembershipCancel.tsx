import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './css/MyPage.module.css';

const MembershipCancel: React.FC = () => {
    const navigate = useNavigate();

    const handleMembershipCancel = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:8088/api/myPage/cancel-subscription', null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                alert('멤버십이 성공적으로 해지되었습니다.');
                navigate('/'); // 홈 페이지로 리디렉션
            } else {
                alert('멤버십 해지에 실패했습니다.');
            }
        } catch (error) {
            console.error('멤버십 해지 중 오류 발생:', error);
            alert('멤버십 해지 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.myPage}>
            <div className={styles.content}>
                <h1>멤버십 해지</h1>
                <h3>멤버십 정보 삭제</h3>
                <div className={styles.quickLinks}>
                    <ul>
                        <li>정말로 멤버십을 해지하시겠습니까?</li>
                    </ul>
                    <ul>
                        <li>해지하셔도 만료일까지 사용하실 수 있습니다.</li>
                    </ul>
                    <button onClick={handleMembershipCancel} className={styles.deleteButton}>멤버십 해지</button>
                </div>
            </div>
        </div>
    );
};

export default MembershipCancel;