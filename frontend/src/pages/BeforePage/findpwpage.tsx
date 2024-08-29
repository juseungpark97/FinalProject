import React from 'react';
import styles from './css/LoginPage.module.css';
import LoginForm from '../../components/BeforePage/findidForm';
import FindIdForm from '../../components/BeforePage/findidForm';
import FindPwForm from '../../components/BeforePage/findPw';

const Findpwpage: React.FC = () => {
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
                    className={styles.logo} style={{ opacity: 1, zIndex: 1 }}
                />
                <FindPwForm />
             

            </div>
        </main>
    );
};

export default Findpwpage;
