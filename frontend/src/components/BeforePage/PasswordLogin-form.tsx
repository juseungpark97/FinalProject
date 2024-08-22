import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/Passwordlogin.module.css';

const PwLoginForm: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = localStorage.getItem('email');

        if (!email) {
            setError('이메일 정보가 없습니다. 처음부터 다시 시도해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8088/api/users/loginUser', {
                email,
                password
            });
            localStorage.setItem('authToken', response.data.token);
            localStorage.removeItem('email');
            window.location.href = '/profiles'; // 비밀번호가 유효할 경우 프로필 페이지로 이동
        } catch (error) {
            setError('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
        }
    };

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            <label htmlFor="password" className={styles.visuallyHidden}>비밀번호</label>
            <input
                type="password"
                id="password"
                className={styles.inputField}
                placeholder="비밀번호"
                value={password}
                onChange={handleChange}
                aria-label="비밀번호"
                required
            />
            <button type="submit" className={styles.loginButton}>로그인</button>
            {error && <p className={styles.error}>{error}</p>}
        </form>
    );
};

export default PwLoginForm;
