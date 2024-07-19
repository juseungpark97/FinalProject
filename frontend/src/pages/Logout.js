import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.post('http://localhost:8088/api/members/logout', {}, { withCredentials: true })
      .then(response => {
        alert('Logout successful!');
        navigate('/login');
      })
      .catch(error => {
        alert('Logout failed');
      });
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
