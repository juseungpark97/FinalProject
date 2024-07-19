import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Error = styled.p`
  color: red;
`;

function CreateMember() {
  const [member, setMember] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
    birth: '',
    gender: '',
    phone: '',
    address: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email validation regex
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(member.email)) {
      setError('Invalid email address');
      return;
    }

    axios.post('http://localhost:8088/api/members/register', member)
      .then(response => {
        alert(response.data);
        setMember({
          email: '',
          password: '',
          name: '',
          nickname: '',
          birth: '',
          gender: '',
          phone: '',
          address: '',
        });
        setError('');
      })
      .catch(error => {
        if (error.response && error.response.data) {
          // 서버에서 반환된 에러 메시지 추출
          const errorMessage = error.response.data.message || 'Failed to create member.';
          setError(errorMessage);
        } else {
          setError('There was an error!');
        }
      });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Create Member</Title>
        <Label htmlFor="email">Email:</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={member.email}
          onChange={handleChange}
          required
        />
        <Label htmlFor="password">Password:</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={member.password}
          onChange={handleChange}
          required
        />
        <Label htmlFor="name">Name:</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={member.name}
          onChange={handleChange}
          required
        />
        <Label htmlFor="nickname">Nickname:</Label>
        <Input
          type="text"
          id="nickname"
          name="nickname"
          value={member.nickname}
          onChange={handleChange}
          required
        />
        <Label htmlFor="birth">Birth:</Label>
        <Input
          type="text"
          id="birth"
          name="birth"
          value={member.birth}
          onChange={handleChange}
          required
        />
        <Label htmlFor="gender">Gender:</Label>
        <Input
          type="text"
          id="gender"
          name="gender"
          value={member.gender}
          onChange={handleChange}
          required
        />
        <Label htmlFor="phone">Phone:</Label>
        <Input
          type="text"
          id="phone"
          name="phone"
          value={member.phone}
          onChange={handleChange}
          required
        />
        <Label htmlFor="address">Address:</Label>
        <Input
          type="text"
          id="address"
          name="address"
          value={member.address}
          onChange={handleChange}
          required
        />
        {error && <Error>{error}</Error>}
        <Button type="submit">Create</Button>
      </Form>
    </Container>
  );
}

export default CreateMember;
