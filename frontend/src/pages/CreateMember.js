import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components
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

function CreateMember() {
  const [member, setMember] = useState({ userName: '', userPwd: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8088/api/members', member)
      .then(response => {
        console.log(response.data);
        alert('Member created successfully!');
        setMember({ userName: '', userPwd: '' });
      })
      .catch(error => {
        console.error('There was an error!', error);
        alert('Failed to create member.');
      });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Create Member</Title>
        <Label htmlFor="userName">User Name:</Label>
        <Input
          type="text"
          id="userName"
          name="userName"
          value={member.userName}
          onChange={handleChange}
        />
        <Label htmlFor="userPwd">Password:</Label>
        <Input
          type="password"
          id="userPwd"
          name="userPwd"
          value={member.userPwd}
          onChange={handleChange}
        />
        <Button type="submit">Create</Button>
      </Form>
    </Container>
  );
}

export default CreateMember;
