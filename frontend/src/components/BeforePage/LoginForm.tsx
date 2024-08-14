import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../pages/BeforePage/css/LoginPage.module.css';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'email') {
            setEmail(value);
        } else if (id === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8088/api/users/login', {
                email,
                password
            });
            localStorage.setItem('authToken', response.data.token);
            console.log('Login successful:', response.data);

            // 구독 여부에 따라 페이지 리디렉션
            if (response.data.subscribed) {
                navigate('/profiles');  // 구독 상태가 ACTIVE이면 프로필 페이지로 이동
            } else {
                navigate('/subscribe');  // 구독 상태가 ACTIVE가 아니면 구독 페이지로 이동
            }
        } catch (error) {
            setError('Login failed. Please check your email and password.');
        }
    };

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.formContent}>
                <h1 className={styles.formTitle}>로그인</h1>
                <label htmlFor="email" className={styles.visuallyHidden}>이메일</label>
                <input
                    type="email"
                    id="email"
                    className={styles.inputField}
                    placeholder="이메일"
                    value={email}
                    onChange={handleChange}
                    aria-label="이메일"
                    required
                />
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
                <a href="#" className={styles.forgotPassword}>아이디 찾기</a>
                <a href="#" className={styles.forgotPassword}>비밀번호 찾기</a>
                <button type="submit" className={styles.loginButton}>로그인</button>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </form>
    );
};

export default LoginForm;