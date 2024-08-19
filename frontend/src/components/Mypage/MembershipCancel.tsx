import React from 'react';
import styles from './css/MyPage.module.css';

interface MembershipCancelProps {
    onCancel: () => void; // 이 prop은 필수로 제공되어야 합니다.
}

const MembershipCancel: React.FC<MembershipCancelProps> = ({ onCancel }) => {
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
                        <button className={styles.deleteButton}>
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