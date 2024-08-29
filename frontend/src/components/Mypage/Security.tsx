import React from 'react';
import styles from './css/MyPage.module.css';

interface SecurityProps {
    onMenuClick: (menu: string) => void;
}

const Security: React.FC<SecurityProps> = ({ onMenuClick }) => {
    return (
        <div className={styles.myPage}>
            <div className={styles.content}>
                <h1>보안</h1>
                <h3>계정 정보</h3>
                <div className={styles.quickLinks}>
                    <ul>
                        <li>
                            <button
                                onClick={() => onMenuClick('passwordChange')}
                                className={styles.menuLink}
                            >
                                비밀번호 변경 <span className={styles.arrow}>&gt;</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onMenuClick('accountInfo')}
                                className={styles.menuLink}
                            >
                                아이디/이메일 <span className={styles.arrow}>&gt;</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onMenuClick('phoneChange')}
                                className={styles.menuLink}
                            >
                                휴대폰 <span className={styles.arrow}>&gt;</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Security;