import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import CreateMember from './pages/CreateMember';
import styled from 'styled-components';

// Styled components
const Nav = styled.nav`
  background-color: #333;
  padding: 10px;
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

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <AppContainer>
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
          </NavList>
        </Nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/create-member" element={<CreateMember />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
