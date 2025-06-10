import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Create AuthContext with default values
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  role: null,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Login logic
  const login = (token) => {
    const expireTime = Date.now() + 9 * 60 * 60 * 1000; // 9 hours

    Cookies.set('token', token, { expires: 0.375, sameSite: 'Lax', secure: false, path: '/' });
    Cookies.set('expireAt', String(expireTime), { expires: 0.375 });

    const decoded = jwtDecode(token);
    console.log("User Data", decoded);
    
    setUser(decoded);
    setRole(decoded.role); // Set user role if available
    setIsAuthenticated(true);
  };

  // Logout logic
  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('expireAt');
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  // Effect to check if a token exists on app load
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setRole(decoded.role); // Set role based on decoded token
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = () => useContext(AuthContext);
