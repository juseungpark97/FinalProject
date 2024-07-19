import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
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

function About() {
  return (
    <AboutContainer>
      <Title>About Page</Title>
      <Description>This is the about page.</Description>
    </AboutContainer>
  );
}

export default About;
