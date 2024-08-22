import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './css/MyPage.module.css';

const ProfileLock: React.FC<{ profileId: number }> = ({ profileId }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        // 프로필 잠금 상태를 불러오기
        const fetchProfileStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8088/api/profiles/${profileId}`);
                if (response.data) {
                    setIsLocked(response.data.locked); // 서버에서 받은 잠금 상태 설정
                }
            } catch (error) {
                console.error('프로필 상태 조회 중 오류 발생:', error);
            }
        };

        fetchProfileStatus();
    }, [profileId]);

    const handleSetLock = async () => {
        if (password.length !== 4) {
            alert('비밀번호는 4자리여야 합니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.put(`http://localhost:8088/api/profiles/${profileId}/lock`, { password });
            if (response.status === 200) {
                alert('프로필 잠금이 설정되었습니다. 프로필 선택창으로 돌아갑니다.');
                navigate('/profiles');  // 프로필 선택 페이지나 적절한 경로로 리다이렉트
            } else {
                alert('프로필 잠금 설정에 실패했습니다.');
            }
        } catch (error) {
            console.error('프로필 잠금 설정 중 오류 발생:', error);
            alert('프로필 잠금 설정 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnlockProfile = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.put(`http://localhost:8088/api/profiles/${profileId}/unlock`);
            if (response.status === 200) {
                alert('프로필 잠금이 해제되었습니다.');
                setIsLocked(false);  // 잠금 해제 후 상태 업데이트
            } else {
                alert('프로필 잠금 해제에 실패했습니다.');
            }
        } catch (error) {
            console.error('프로필 잠금 해제 중 오류 발생:', error);
            alert('프로필 잠금 해제 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.myPage}>
            <div className={styles.content}>
                <h1>프로필 잠금 설정</h1>
                {isLocked ? (
                    <>
                        <p>이 프로필은 현재 잠금 상태입니다.</p>
                        <button onClick={handleUnlockProfile} className={styles.link} disabled={isSubmitting}>
                            프로필 잠금 해제
                        </button>
                    </>
                ) : (
                    <>
                        <p>비밀번호를 설정해주세요.</p>
                        <input
                            type="password"
                            maxLength={4}
                            placeholder="4자리 비밀번호 입력"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={styles.input}
                        />
                        <button onClick={handleSetLock} className={styles.link} disabled={isSubmitting}>
                            잠금 설정
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileLock;