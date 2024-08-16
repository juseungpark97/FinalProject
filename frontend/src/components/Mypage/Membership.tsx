import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/MyPage.module.css';
import MembershipCancel from './MembershipCancel';

interface Subscription {
    startDate: string;
    endDate: string;
    subStatus: string;
}

const Membership: React.FC = () => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [showCancel, setShowCancel] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        axios.get('http://localhost:8088/api/myPage/subscription-date', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const subscriptionData: Subscription = response.data;
                setSubscription(subscriptionData);

                const today = new Date();
                const endDate = new Date(subscriptionData.endDate);
                const timeDiff = endDate.getTime() - today.getTime();
                const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
                setDaysLeft(daysRemaining);
            })
            .catch(error => {
                console.error('Error fetching subscription data:', error);
            });
    }, []);

    const handleMembershipCancelClick = () => {
        setShowCancel(true); // 멤버십 해지 페이지를 보여줌
    };

    return (
        <div className={styles.myPage}>
            {!showCancel ? (
                <>
                    <div className={styles.content}>
                        <h1>멤버십</h1>
                        <h3>멤버십 결제일</h3>
                        <div className={styles.quickLinks}>
                            {subscription ? (
                                <ul>
                                    <li>구독 시작일 : {new Date(subscription.startDate).toLocaleDateString()}
                                        <br></br>
                                        구독 마감일 : {new Date(subscription.endDate).toLocaleDateString()}</li>
                                    <li>
                                        구독 상태 :
                                        <span className={subscription.subStatus === "ACTIVE" ? styles.statusActiveText : styles.statusInactiveText}>
                                            {subscription.subStatus === "ACTIVE" ? " 활성화" : " 비활성화"}
                                        </span>
                                    </li>
                                    {daysLeft !== null && (
                                        <li>구독 만료까지 남은 일수 : {daysLeft}일</li>
                                    )}
                                </ul>
                            ) : (
                                <p>구독 정보를 불러오는 중...</p>
                            )}
                        </div>
                    </div>
                    <div className={styles.content}>
                        <h3>결제 정보</h3>
                        <div className={styles.quickLinks}>
                            <ul>
                                <li>다음 결제일</li>
                                <li><a href="/">결제 수단 관리</a></li>
                                <li><a href="/">결제 내역 확인</a></li>
                                <li>
                                    <a
                                        href="#"
                                        onClick={handleMembershipCancelClick}
                                        className={styles.link}
                                    >
                                        멤버십 해지 <span className={styles.arrow}>&gt;</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <MembershipCancel /> // 멤버십 해지 컴포넌트를 표시
            )}
        </div>
    );
};

export default Membership;