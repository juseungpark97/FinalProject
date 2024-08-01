import React, { useState } from 'react';
import axios from 'axios';
import './SigninPage-input-fields.css';

export const InputFields: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    ID: '',
    PASSWORD: '',
    confirmPassword: '',
    NAME: '',
    PHONE: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.PASSWORD !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    axios
      .post('http://localhost:8088/api/users/register', {
        userId: formData.ID,
        email: `${formData.ID}@example.com`,
        password: formData.PASSWORD,
        status: 'A',  // Assuming a default status
        birthday: '1990-01-01',  // Placeholder, should be updated to actual input
        username: formData.NAME,
        vNumber: 1  // Placeholder, should be updated to actual input
      })
      .then((response) => {
        console.log('User registered:', response.data);
        // 성공적으로 등록되면 추가 작업 수행
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
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
              type="text"
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
