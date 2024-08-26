import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/MyPage.module.css';

interface PhoneChangeProps {
    onPhoneChangeSuccess: () => void;  // 리다이렉트 콜백을 위한 prop 추가
}

const PhoneChange: React.FC<PhoneChangeProps> = ({ onPhoneChangeSuccess }) => {
    const [currentPhone, setCurrentPhone] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const handlePhoneChange = async () => {
        if (!newPhone) {
            alert('새 핸드폰 번호를 입력해주세요.');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:8088/api/users/change-phone', {
                currentPhone,
                newPhone,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200 && response.data === 'Phone number changed successfully') {
                alert('핸드폰 번호가 성공적으로 변경되었습니다.');
                onPhoneChangeSuccess();  // 성공 시 콜백 호출하여 리다이렉트 처리
            } else {
                alert('핸드폰 번호 변경에 실패했습니다.');
            }
        } catch (error) {
            alert('핸드폰 번호 변경에 실패했습니다. 다시 입력해주세요.');
        }
    };

    return (
        <div className={styles.myPage}>
            <div className={styles.content}>
                <h1>핸드폰 번호 변경</h1>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>현재 핸드폰 번호</label>
                    <input
                        type="text"
                        value={currentPhone}
                        onChange={(e) => setCurrentPhone(e.target.value)}
                        className={styles.profilePwdInput}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>새 핸드폰 번호</label>
                    <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className={styles.profilePwdInput}
                    />
                </div>
                <button onClick={handlePhoneChange} className={styles.menuLink}>
                    핸드폰 번호 변경
                </button>
            </div>
        </div>
    );
};

export default PhoneChange;