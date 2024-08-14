import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/SigninPage-input-fields.css';

export const InputFields: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    ID: '',
    PASSWORD: '',
    confirmPassword: '',
    NAME: '',
    PHONE: '',
    BIRTHDATE: '',
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 상태
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false); // 인증 완료 상태

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSendVerificationEmail = async () => {
    if (!formData.ID) {
      alert('이메일을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 이메일 중복 체크
      const emailCheckResponse = await axios.post('http://localhost:8088/api/users/check-email', {
        email: formData.ID,
      });

      if (emailCheckResponse.data.exists) {
        alert('이미 사용 중인 이메일입니다.');
        setLoading(false);
        return;
      }

      await axios.post('http://localhost:8088/api/email/send-code', {
        email: formData.ID,
      });
      setIsCodeSent(true);
      alert('이메일 인증 코드가 발송되었습니다.');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message || 'Unknown error';
        console.error('Server responded with error:', message);
        alert('이메일 인증 코드 발송에 실패하였습니다.');
      } else {
        console.error('Unexpected error:', error);
        alert('이메일 인증 코드 발송에 실패하였습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;

    // 코드가 6자리가 아닐 경우 검증하지 않음
    if (code.length !== 6) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8088/api/email/verify-code', {
        email: formData.ID,
        code: code,
      });

      if (response.data.verified) {
        setIsEmailVerified(true);
        setIsVerificationComplete(true); // 인증 완료 상태로 설정
        alert('이메일 인증이 완료되었습니다.');
      } else {
        alert('인증 코드가 유효하지 않습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message || 'Unknown error';
        console.error('Server responded with error:', message);
        alert('이메일 인증에 실패하였습니다.');
      } else {
        console.error('Unexpected error:', error);
        alert('이메일 인증에 실패하였습니다.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let errors: string[] = [];

    if (formData.PASSWORD !== formData.confirmPassword) {
      errors.push('비밀번호가 일치하지 않습니다.');
    }

    if (!isEmailVerified) {
      errors.push('이메일 인증을 완료해주세요.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]); // Reset errors

    try {
      const response = await axios.post('http://localhost:8088/api/users/register', {
        email: formData.ID,
        password: formData.PASSWORD,
        status: 'A',
        birthday: formData.BIRTHDATE,
        username: formData.NAME,
        phone: formData.PHONE
      });

      console.log('User registered:', response.data);
      alert('회원가입이 완료 되었습니다.');
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message || 'Unknown error';
        console.error('Server responded with error:', message);
        alert('회원가입에 실패하였습니다.');
      } else {
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
              placeholder="아이디 (이메일)"
              type="email"
              name="ID"
              value={formData.ID}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={handleSendVerificationEmail}
              disabled={loading || isVerificationComplete} // 인증 완료 시 비활성화
            >
              {isVerificationComplete
                ? '이메일 인증 완료'
                : loading
                  ? '이메일 발송 중...'
                  : '이메일 인증 코드 받기'}
            </button>
            {isCodeSent && !isVerificationComplete && (
              <input
                className="input-values"
                placeholder="이메일 인증 코드"
                type="text"
                name="emailCode"
                maxLength={6} // 최대 길이 6자로 제한
                onChange={handleVerifyCode} // 사용자가 6자리 입력 후에만 검증 실행
              />
            )}
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
              className="input-values3"
              placeholder="생년월일"
              type="date"
              name="BIRTHDATE"
              value={formData.BIRTHDATE}
              onChange={handleChange}
            />
            <input
              className="input-values4"
              placeholder="휴대폰 번호"
              type="text"
              name="PHONE"
              value={formData.PHONE}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="signup-form">
        <button className="button-join" type="submit" disabled={!isEmailVerified}>
          <div className="button-join-child" />
          <b className="b">회원가입</b>
        </button>
      </div>
    </form>
  );
};

export default InputFields;
