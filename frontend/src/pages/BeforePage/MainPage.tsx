import { FunctionComponent, useState, useEffect } from "react";
import axios from "axios";
import styles from "./css/MainPage.module.css";
import { useNavigate } from 'react-router-dom';

const Landing: FunctionComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // 자동 로그인 및 구독 상태 확인 로직 추가
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // 여기에서 'authToken'을 가져옵니다.
    if (token) {
      axios.get('http://localhost:8088/api/users/subscription-status', {
        headers: { 'Authorization': `Bearer ${token}` } // 'Bearer'와 함께 토큰을 헤더에 추가
      })
        .then(response => {
          const isSubscribed = response.data.isSubscribed;

          if (isSubscribed) {
            // 멀티 프로필 페이지로 이동하기 전에 세션 스토리지에 있는 프로필 정보 삭제
            sessionStorage.removeItem('selectedProfile');
            navigate('/profiles'); // 구독자라면 프로필 페이지로 이동
          } else {
            navigate('/subscribe'); // 구독자가 아니라면 구독 페이지로 이동
          }
        })
        .catch(error => {
          console.error('구독 상태 확인 중 오류가 발생했습니다:', error);
          setError('구독 상태 확인 중 오류가 발생했습니다.');
          localStorage.removeItem('authToken'); // 문제가 발생하면 토큰 삭제
          sessionStorage.clear();
        });
    }
  }, [navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleGetStarted = async () => {
    try {
      const response = await axios.post('http://localhost:8088/api/users/check-email', { email });
      if (response.data.exists) {
        localStorage.setItem('email', email);
        navigate('/passwordlogin');
      } else {
        alert('이메일이 존재하지 않습니다. 회원가입 페이지로 이동합니다.');
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setError('이메일 확인 중 오류가 발생했습니다.');
    }
  };

  const handleGoogleLogin = () => {
    // 백엔드의 OAuth2 인증 요청 URI로 리디렉션
    window.location.href = "http://localhost:8088/oauth2/authorization/google";
  };

  return (
    <div className={styles.landing}>
      <div className={styles.background}></div>
      <img className={styles.logo} alt="Logo" src="/logo-text-2@2x.png" />
      <section className={styles.landingInner}>
        <h1 className={styles.title}>영화, 시리즈 등을 무제한으로</h1>
        <h2 className={styles.subtitle}>어디서나 자유롭게 시청하세요. 해지는 언제든 가능합니다.</h2>
        <p className={styles.description}>
          시청할 준비가 되셨나요? 멤버십을 등록하거나 재시작하려면 이메일 주소를 입력하세요.
        </p>
        <div className={styles.inputFields}>
          <input
            className={styles.emailInput}
            placeholder="이메일 주소"
            type="text"
            value={email}
            onChange={handleEmailChange}
          />
          <button className={styles.getStartedButton} onClick={handleGetStarted}>
            시작하기
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <button className={styles.googleLoginButton} onClick={handleGoogleLogin}>
          Google 로그인하기
        </button>
      </section>
    </div>
  );
};

export default Landing;
