import React from 'react';
import styles from './css/MyPage.module.css';
import axios from 'axios';

interface MembershipCancelProps {
    onCancel: () => void; // 이 prop은 필수로 제공되어야 합니다.
}

const MembershipCancel: React.FC<MembershipCancelProps> = ({ onCancel }) => {

    const handleMembershipCancel = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:8088/api/users/cancel-subscription', null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                alert('멤버십이 성공적으로 해지되었습니다. 해지하더라도 만료일까지 서비스를 계속 이용하실 수 있습니다.');
                onCancel(); // 성공적으로 해지된 후 onCancel 호출하여 이전 페이지로 돌아가기
            } else {
                alert('멤버십 해지에 실패했습니다.');
            }
        } catch (error) {
            console.error('네트워크 오류 또는 서버 응답 없음:', error);
            alert('네트워크 오류 또는 서버가 응답하지 않습니다.');
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
                    <div className={styles.buttonContainer}>
                        <button className={styles.deleteButton} onClick={handleMembershipCancel}>
                            멤버십 해지
                        </button>
                        <button onClick={onCancel} className={styles.cancelButton}>
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembershipCancel;