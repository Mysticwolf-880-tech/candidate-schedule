// src/components/Header.js
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthProvider';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
console.log("Login UserData :",user );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span className="navbar-brand"></span>
        <div className="d-flex align-items-center gap-3">
          {isAuthenticated && user && (
            <span className="text-dark fw-bold">Welcome, { user.username}</span>
          )}
          <FaUserCircle size={38} className="text-dark" style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </nav>
  );
};

export default Header;
