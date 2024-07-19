import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  color: #333;
`;

const Description = styled.p`
  font-size: 18px;
  color: #555;
`;

function Home() {
  return (
    <HomeContainer>
      <Title>Home Page</Title>
      <Description>Welcome to the home page!</Description>
    </HomeContainer>
  );
}

export default Home;
