import React from 'react';
import AuthLogin from '../authforms/AuthLogin.js';
import { Helmet } from 'react-helmet';
import './Login.css'; // Import external CSS
import logo from '../../../assets/masys2.gif';



const Login = () => {
  return (
    <>
      <Helmet>
        <title>Manage Website</title>
      </Helmet>
      <div className="login-page">
        <div className="login-box">
          <div className="login-content">
            <img src={logo} alt="Logo" className="login-logo" />
            <h2 className="login-title">
              Sign in
            </h2>
            <AuthLogin />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
