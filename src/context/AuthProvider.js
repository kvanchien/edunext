import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem('role');
    return savedRole ? JSON.parse(savedRole) : null;
  });

  const [campus, setCampus] = useState(() => {
    const savedCampus = localStorage.getItem('campus');
    return savedCampus ? JSON.parse(savedCampus) : null;
  });

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', JSON.stringify(role));
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  useEffect(() => {
    if (campus) {
      localStorage.setItem('campus', JSON.stringify(campus));
    } else {
      localStorage.removeItem('campus');
    }
  }, [campus]);

  const login = (role, campus) => {
    setRole(role);
    setCampus(campus);
  };

  const logout = () => {
    setRole(null);
    setCampus(null);
    localStorage.removeItem('role');
    localStorage.removeItem('campus');
  };

  return (
    <AuthContext.Provider value={{ role, campus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
