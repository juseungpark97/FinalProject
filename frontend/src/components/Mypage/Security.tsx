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
                            <a
                                href=""
                                onClick={(e) => {
                                    e.preventDefault();
                                    onMenuClick('passwordChange'); // 클릭 시 비밀번호 변경으로 전환
                                }}
                                className={styles.menuLink}
                            >
                                비밀번호 변경 <span className={styles.arrow}>&gt;</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href=""
                                onClick={(e) => {
                                    e.preventDefault();
                                    onMenuClick('accountInfo'); // 이 메뉴도 필요에 따라 수정
                                }}
                                className={styles.menuLink}
                            >
                                아이디/이메일 <span className={styles.arrow}>&gt;</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href=""
                                onClick={(e) => {
                                    e.preventDefault();
                                    onMenuClick('phoneChange'); // 이 메뉴도 필요에 따라 수정
                                }}
                                className={styles.menuLink}
                            >
                                휴대폰 <span className={styles.arrow}>&gt;</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Security;