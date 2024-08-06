import React, { useState } from 'react';
import axios from 'axios';
import styles from '../pages/Passwordlogin.module.css';

const PwLoginForm: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8088/api/users/check-password', {
                password
            });
            if (response.data.valid) {
                console.log('Password is valid');
                window.location.href = '/home'; // 비밀번호가 유효할 경우 홈 페이지로 이동
            } else {
                setError('Invalid password. Please try again.');
            }
        } catch (error) {
            setError('Password check failed. Please try again.');
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
