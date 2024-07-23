import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import CreateMember from './pages/CreateMember';
import LoginForm from './pages/LoginForm';
import FlightSearch from './pages/FlightSearch';
import axios from 'axios';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #333;
  padding: 10px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0 15px;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    color: #007bff;
  }
`;

const MainContainer = styled.div`
  padding-top: 60px; /* 네비게이션 바와 콘텐츠 간의 여백 추가 */
`;

const AppContainer = styled.div`
  width: 100%;
  max-width: 1920px;
  height: 100%;
  max-height: 1080px;
  background-color: #fff;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
`;

const WelcomeMessage = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  color: #fff;
  background-color: #333;
  padding: 5px 10px;
  border-radius: 5px;
`;

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8088/api/members/currentMember', { withCredentials: true })
      .then(response => {
        setCurrentUser(response.data);
      })
      .catch(() => {
        setCurrentUser(null);
      });
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:8088/api/members/logout', {}, { withCredentials: true })
      .then(() => {
        setCurrentUser(null);
      })
      .catch(() => {
        alert('Logout failed');
      });
  };

  return (
    <Router>
      <Nav>
        <NavList>
          <NavItem>
            <NavLink to="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/about">About</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/create-member">Create Member</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/flight-search">Flight Search</NavLink>
          </NavItem>
          {currentUser ? (
            <>
              <NavItem>
                <NavLink to="#" onClick={handleLogout}>Logout</NavLink>
              </NavItem>
              <WelcomeMessage>{currentUser.nickname}님 환영합니다</WelcomeMessage>
            </>
          ) : (
            <NavItem>
              <NavLink to="/login">Login</NavLink>
            </NavItem>
          )}
        </NavList>
      </Nav>
      <MainContainer>
        <AppContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/create-member" element={<CreateMember />} />
            <Route path="/login" element={<LoginForm setCurrentUser={setCurrentUser} />} />
            <Route path="/flight-search" element={<FlightSearch />} />
          </Routes>
        </AppContainer>
      </MainContainer>
    </Router>
  );
}

export default App;
