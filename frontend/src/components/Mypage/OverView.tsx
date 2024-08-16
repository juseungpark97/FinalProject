import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/MyPage.module.css';

interface Subscription {
    startDate: string;
    endDate: string;
    subStatus: string;
}

const OverView: React.FC = () => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        axios.get('http://localhost:8088/api/subscription', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const subscriptionData: Subscription = response.data;
                setSubscription(subscriptionData);

                // 남은 일수 계산
                const today = new Date();
                const endDate = new Date(subscriptionData.endDate);
                const timeDiff = endDate.getTime() - today.getTime();
                const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24)); // 하루는 1000밀리초 * 3600초 * 24시간
                setDaysLeft(daysRemaining);
            })
            .catch(error => {
                console.error('Error fetching subscription data:', error);
            });
    }, []);

    return (
        <div className={styles.myPage}>
            <div className={styles.content}>
                <h1>개요</h1>
                <h3>멤버십 결제일</h3>
                <div className={styles.quickLinks}>
                    {subscription && (
                        <ul>
                            <li>구독 시작일: {new Date(subscription.startDate).toLocaleDateString()}</li>
                            <li>구독 마감일: {new Date(subscription.endDate).toLocaleDateString()}</li>
                            {daysLeft !== null && (
                                <li>구독 만료까지 남은 일수: {daysLeft}일</li>
                            )}
                        </ul>
                    )}
                    {!subscription && <p>구독 정보를 불러오는 중...</p>}
                </div>
            </div>
        </div>
    );
};

export default OverView;