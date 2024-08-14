import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../pages/BeforePage/css/LoginPage.module.css';
import { useNavigate } from 'react-router-dom';

const ChangePasswordForm: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 전환

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVerificationCode(e.target.value);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleSendCode = async () => {
        try {
            await axios.post('http://localhost:8088/api/verification/send-code', { phone });
            setMessage('인증 코드가 휴대폰으로 전송되었습니다.');
            setError('');
            setIsCodeSent(true);
        } catch (error) {
            setError('휴대폰 번호를 확인하고 다시 시도해주세요.');
            setMessage('');
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            setMessage('');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8088/api/verification/change-password', {
                phone,
                code: verificationCode,
                newPassword
            });

            if (response.status === 200) {
                setMessage('비밀번호가 성공적으로 변경되었습니다.');
                setError('');
                // 비밀번호 변경 후 로그인 페이지로 이동
                navigate('/login');
            } else {
                setError('비밀번호 변경에 실패했습니다.');
                setMessage('');
            }
        } catch (error) {
            setError('인증 코드가 올바르지 않거나 비밀번호 변경에 실패했습니다.');
            setMessage('');
        }
    };

    return (
        <form className={styles.loginForm}>
            <div className={styles.formContent}>
                <h1 className={styles.formTitle}>비밀번호 변경</h1>
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
                {!isCodeSent && (
                    <button type="button" className={styles.loginButton} onClick={handleSendCode}>인증 코드 전송</button>
                )}
                {isCodeSent && (
                    <>
                        <label htmlFor="verificationCode" className={styles.visuallyHidden}>인증 코드</label>
                        <input
                            type="text"
                            id="verificationCode"
                            className={styles.inputField}
                            placeholder="인증 코드"
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                            aria-label="인증 코드"
                            required
                        />
                        <label htmlFor="newPassword" className={styles.visuallyHidden}>새 비밀번호</label>
                        <input
                            type="password"
                            id="newPassword"
                            className={styles.inputField}
                            placeholder="새 비밀번호"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            aria-label="새 비밀번호"
                            required
                        />
                        <label htmlFor="confirmPassword" className={styles.visuallyHidden}>비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className={styles.inputField}
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            aria-label="비밀번호 확인"
                            required
                        />
                        <button type="button" className={styles.loginButton} onClick={handleChangePassword}>비밀번호 변경</button>
                    </>
                )}
                {message && <p className={styles.successMessage}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </form>
    );
};

export default ChangePasswordForm;
