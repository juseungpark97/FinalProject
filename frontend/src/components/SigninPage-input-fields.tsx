import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import './SigninPage-input-fields.css';

export const InputFields: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    ID: '',
    PASSWORD: '',
    confirmPassword: '',
    NAME: '',
    PHONE: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비밀번호 확인 체크
    if (formData.PASSWORD !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 회원가입 요청 보내기
      const response = await axios.post('http://localhost:8088/api/users/register', {
        userId: formData.ID,
        email: formData.ID, // 이메일 필드가 ID로 사용되고 있음
        password: formData.PASSWORD,
        status: 'A', // 상태 코드 (예: 활성화된 사용자)
        birthday: '1990-01-01',  // Placeholder, 실제 사용자 입력 필요
        username: formData.NAME,
        vNumber: 1 // Placeholder, 실제 사용자 입력 필요
      });

      console.log('User registered:', response.data);
      // 회원가입 성공 시 로그인 페이지로 리디렉션
      alert('회원가입이 완료 되었습니다.');
      navigate('/login'); // 로그인 페이지로 리디렉션
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // 서버 응답에서 에러 메시지 추출
        const message = error.response?.data?.message || error.message || 'Unknown error';
        console.error('Server responded with error:', message);
        alert(`모든 입력창을 입력해주세요`);
      } else {
        // 네트워크 에러 또는 기타 문제
        console.error('Unexpected error:', error);
        alert('회원가입에 실패하였습니다.');
      }
    }
  };

  return (
    <form className={`input-fields ${className}`} onSubmit={handleSubmit}>
      <div className="input-fields-child" />
      <div className="input-labels">
        <div className="input-placeholders">
          <h1 className="h1">회원가입</h1>
          <div className="input-boxes">
            <input
              className="input-values"
              placeholder="아이디"
              type="email"
              name="ID"
              value={formData.ID}
              onChange={handleChange}
            />
            <input
              className="input-values1"
              placeholder="비밀번호"
              type="password"
              name="PASSWORD"
              value={formData.PASSWORD}
              onChange={handleChange}
            />
            <input
              className="input-values2"
              placeholder="비밀번호 확인"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <input
              className="input-values3"
              placeholder="이름"
              type="text"
              name="NAME"
              value={formData.NAME}
              onChange={handleChange}
            />
            <input
              className="input-values4"
              placeholder="휴대폰 인증"
              type="text"
              name="PHONE"
              value={formData.PHONE}
              onChange={handleChange}

            />
          </div>
        </div>
      </div>
      <div className="signup-form">
        <button className="button-join" type="submit">
          <div className="button-join-child" />
          <b className="b">회원가입</b>
        </button>
      </div>
      <img className="illustration-icon" loading="lazy" alt="" src="/vector.svg" />
    </form>
  );
};

export default InputFields;
