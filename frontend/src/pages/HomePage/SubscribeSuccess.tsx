import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './css/SubscribeSuccess.module.css';

const SubscribeSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [hasRequested, setHasRequested] = useState(false);

    useEffect(() => {
        if (hasRequested) return;

        setHasRequested(true);

        console.log("useEffect 실행");

        const token = localStorage.getItem('authToken');

        if (!token) {
            console.error('JWT 토큰이 없습니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
            return;
        }

        const subscribeUser = async () => {
            try {
                const response = await axios.post('http://localhost:8088/api/users/subscribe', null, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: {
                        months: 1,
                    }
                });

                console.log('구독이 성공적으로 처리되었습니다:', response.data);

                // user 객체에서 이메일 추출
                const userEmail = response.data.user.email;
                console.log('사용자 이메일:', userEmail);

                // 구독 성공 이메일 발송
                if (userEmail) {
                    try {
                        await axios.post('http://localhost:8088/api/email/send-subscribe-success', { email: userEmail });
                        console.log('구독 성공 이메일이 발송되었습니다.');
                    } catch (error) {
                        console.error('구독 성공 이메일 발송 중 오류 발생:', error);
                    }
                }

                setTimeout(() => {
                    navigate('/profiles');
                }, 5000);

            } catch (error) {
                console.error('구독 처리 중 오류 발생:', error);
            }
        };

        subscribeUser();

    }, [hasRequested, navigate]);

    return (
        <div className={styles.subscribeSuccess}>
            <h1>구독이 성공적으로 완료되었습니다!</h1>
            <p>곧 프로필 페이지로 이동합니다...</p>
        </div>
    );
};

export default SubscribeSuccess;
