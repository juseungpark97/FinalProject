import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/MyPage.module.css';
import MembershipCancel from './MembershipCancel';

interface Subscription {
    startDate: string;
    endDate: string;
    subStatus: string;
    cancelled: boolean;  // 여기서 필드 이름을 "cancelled"로 수정합니다.
}

const Membership: React.FC = () => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [showCancel, setShowCancel] = useState<boolean>(false);

    useEffect(() => {
        const fetchSubscriptionData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8088/api/myPage/subscription-date', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Subscription data:', response.data); // 로그 추가

                if (response.status === 200) {
                    const subscriptionData: Subscription = response.data;
                    setSubscription(subscriptionData);

                    const today = new Date();
                    const endDate = new Date(subscriptionData.endDate);
                    const timeDiff = endDate.getTime() - today.getTime();
                    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    setDaysLeft(daysRemaining);
                } else {
                    console.error('Failed to fetch subscription data:', response.status);
                    alert('구독 정보를 불러오지 못했습니다.');
                }
            } catch (error) {
                console.error('Error fetching subscription data:', error);
                alert('구독 정보를 가져오는 중 오류가 발생했습니다.');
            }
        };

        fetchSubscriptionData();
    }, []);

    const handleMembershipCancelClick = () => {
        setShowCancel(true);
    };

    const handleCancel = () => {
        setShowCancel(false);

        const token = localStorage.getItem('authToken');
        if (token) {
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
        }
    };

    const handleMembershipReactivateClick = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:8088/api/users/reactivate-subscription', null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                console.log('Reactivation Response:', response.data); // 로그 추가
                alert('멤버십이 성공적으로 재활성화되었습니다.');
                setSubscription(prevState => {
                    if (prevState) {
                        const updatedState = { ...prevState, cancelled: false }; // 필드 이름을 "cancelled"로 수정합니다.
                        console.log('Updated State:', updatedState); // 상태 업데이트 로그 추가
                        return updatedState;
                    }
                    return null;
                });

                // 상태가 변경된 후 컴포넌트 리렌더링 강제
                setShowCancel(false);
            } else {
                alert('멤버십 재활성화에 실패했습니다.');
            }
        } catch (error) {
            console.error('네트워크 오류 또는 서버 응답 없음:', error);
            alert('네트워크 오류 또는 서버가 응답하지 않습니다.');
        }
    };

    useEffect(() => {
        if (subscription) {
            console.log('Subscription state updated:', subscription); // 상태 변화 추적용 로그
        }
    }, [subscription]);

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
                                        <span className={subscription.cancelled ? styles.statusInactiveText : styles.statusActiveText}>
                                            {subscription.cancelled ? " 비활성화" : " 활성화"}
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
                                <li>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className={styles.menuLink}
                                    >
                                        결제 수단 관리 <span className={styles.arrow}>&gt;</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className={styles.menuLink}
                                    >
                                        결제 내역 확인 <span className={styles.arrow}>&gt;</span>
                                    </button>
                                </li>
                                {subscription?.cancelled ? (
                                    <li>
                                        <button
                                            onClick={handleMembershipReactivateClick}
                                            className={styles.menuLink}
                                        >
                                            멤버십 재활성화 <span className={styles.arrow}>&gt;</span>
                                        </button>
                                    </li>
                                ) : (
                                    <li>
                                        <button
                                            onClick={handleMembershipCancelClick}
                                            className={styles.menuLink}
                                        >
                                            멤버십 해지 <span className={styles.arrow}>&gt;</span>
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <MembershipCancel onCancel={handleCancel} />
            )}
        </div>
    );
};

export default Membership;