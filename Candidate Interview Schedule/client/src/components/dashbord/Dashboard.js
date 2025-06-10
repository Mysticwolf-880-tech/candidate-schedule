// src/components/Dashboard.js
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
// import './Dashboard.css'; 

const Dashboard = () => {
  return (
    <>
    <Helmet>
        <title>Dashboard- Manage Website</title>
      </Helmet>
    <div className="d-flex vh-100 overflow-hidden">
      <Sidebar />

      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <Header />

        {/* Scrollable content */}
        <div className="flex-grow-1 overflow-auto p-3 outlet-scroll-area">
          <Outlet />
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
