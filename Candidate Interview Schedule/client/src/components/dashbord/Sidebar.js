import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaCog, FaUserTie, FaBriefcase, FaFlag, FaCheckCircle } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    // For mobile toggle
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 992) {
      setIsMobileOpen(false);
    }
  };
  const toggleSettingsDropdown = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        className="sidebar-toggle-btn d-block d-lg-none"
        onClick={toggleSidebar}
      >
        &#9776;
      </button>

      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        <h4
          className={`text-center d-flex align-items-center justify-content-center gap-2 ${
            isCollapsed ? "d-none" : ""
          }`}
        >
          <img src="/logo.gif" alt="Logo" width="150" height="100" />
          {/* <span>Dashboard</span> */}
        </h4>

        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              to="/"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaHome className="me-2" />
              <span className={isCollapsed ? "d-none" : ""}> Home</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/candidate"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaUsers className="me-2" />
              <span className={isCollapsed ? "d-none" : ""}>Candidates</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <button
              onClick={toggleSettingsDropdown}
              className="nav-link d-flex align-items-center justify-content-between w-100 border-0 text-start"
              style={{ cursor: "pointer" }}
            >
              <div>
                <FaCog className="me-2" />
                <span className={isCollapsed ? "d-none" : ""}>Settings</span>
              </div>
              <span>{isSettingsOpen ? "▾" : "▸"}</span>
            </button>
            {isSettingsOpen && (
              <ul className="nav flex-column ms-3">
                <li className="nav-item">
                  <NavLink
                    to="/interviewers"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <FaUserTie className="me-2" />
                    Interviewer
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/jobposition"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <FaBriefcase className="me-2" />
                    Job Position
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="status"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <FaCheckCircle className="me-2" />
                    Status
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
