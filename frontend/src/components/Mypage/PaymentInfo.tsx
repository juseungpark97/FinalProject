import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCreditCard } from 'react-icons/fa';  // FaCreditCard 아이콘을 임포트
import styles from '../Mypage/css/MyPage.module.css';

interface PaymentInfoProps {
    profileId: number;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ profileId }) => {
    const [paymentInfo, setPaymentInfo] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8088/paypal/payment-info', {
                    params: { cardNumber: '1234567812345678' } //수정필요, 제가 할수있는 영역이 아닌듯합니다
                });
                if (response.status === 200) {
                    setPaymentInfo(response.data.maskedCardNumber);
                } else {
                    alert('결제 정보를 가져오지 못했습니다.');
                }
            } catch (error) {
                console.error('결제 정보를 가져오는 중 오류가 발생했습니다.', error);
            }
        };

        fetchPaymentInfo();
    }, [profileId]);

    return (
        <div className={styles.paymentInfoContainer}>
            <h3>결제 정보</h3>
            {paymentInfo ? (
                <p>
                    <FaCreditCard style={{ marginRight: '8px' }} /> {/* 카드 아이콘 추가 */}
                    Card Number: {paymentInfo}
                </p>
            ) : (
                <p>결제 정보를 불러오는 중...</p>
            )}
        </div>
    );
};

export default PaymentInfo;
