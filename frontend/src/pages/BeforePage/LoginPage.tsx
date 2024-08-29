import React from 'react';
import styles from './css/LoginPage.module.css';
import LoginForm from '../../components/BeforePage/LoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navi = useNavigate();

    const beforepage = () => {
        navi('/')
    }

    return (
        <main className={styles.loginPage}>
            <div className={styles.container}>
                <img
                    src="/netflix-sign-up-background-page-1@2x.png"
                    alt=""
                    className={styles.backgroundImage}
                />
                <img
                    src="logo-text-1@2x.png"
                    alt="Company Logo"
                    className={styles.logo} style={{ opacity: 1, zIndex: 10000 }}
                    onClick={beforepage}
                />
                <LoginForm />
                <p className={styles.helpText}>Questions? Call 000-800-040-1843</p>

            </div>
        </main>
    );
};

export default LoginPage;
