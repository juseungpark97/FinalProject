import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../pages/BeforePage/css/LoginPage.module.css';

const FindIdForm: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVerificationCode(e.target.value);
    };

    const handleSendCode = async () => {
        try {
            await axios.post('http://localhost:8088/api/verification/send-code', { phone });
            setMessage('인증번호가 휴대폰으로 전송되었습니다.');
            setError('');
            setIsCodeSent(true);
        } catch (error) {
            setError('휴대폰 번호 확인 후 다시 시도해주세요.');
            setMessage('');
        }
    };

    const handleVerifyCode = async () => {
        try {
            const verifyResponse = await axios.post('http://localhost:8088/api/verification/verify-code', { phone, code: verificationCode });
            if (verifyResponse.status === 200) {
                // Once the code is verified, retrieve the email associated with the phone number
                const emailResponse = await axios.get('http://localhost:8088/api/verification/get-email', { params: { phone } });
                setUserEmail(emailResponse.data);  // Assuming the email is returned in response.data
                setIsVerified(true);
                setMessage('인증이 완료되었습니다. 이메일: ' + emailResponse.data);
                setError('');
            }
        } catch (error) {
            setError('인증번호가 올바르지 않습니다. 다시 시도해주세요.');
            setMessage('');
        }
    };

    return (
        <form className={styles.loginForm}>
            <div className={styles.formContent}>
                <h1 className={styles.formTitle}>아이디 찾기</h1>
                {!isVerified ? (
                    <>
                        <label htmlFor="phone" className={styles.visuallyHidden}>휴대폰 번호</label>
                        <input
                            type="tel"
                            id="phone"
                            className={styles.inputField}
                            placeholder="휴대폰 번호"
                            value={phone}
                            onChange={handlePhoneChange}
                            aria-label="휴대폰 번호"
                            required
                            disabled={isCodeSent}
                        />
                        {isCodeSent && (
                            <>
                                <label htmlFor="verificationCode" className={styles.visuallyHidden}>인증번호</label>
                                <input
                                    type="text"
                                    id="verificationCode"
                                    className={styles.inputField}
                                    placeholder="인증번호"
                                    value={verificationCode}
                                    onChange={handleCodeChange}
                                    aria-label="인증번호"
                                    required
                                />
                                <button type="button" className={styles.loginButton} onClick={handleVerifyCode}>인증번호 확인</button>
                            </>
                        )}
                        {!isCodeSent && (
                            <button type="button" className={styles.loginButton} onClick={handleSendCode}>인증번호 전송</button>
                        )}
                    </>
                ) : (
                    <p className={styles.successMessage}>이메일: {userEmail}</p>
                )}
                {message && <p className={styles.successMessage}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </form>
    );
};

export default FindIdForm;
