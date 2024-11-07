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

  const [userId, setUserId] = useState(() => {
    const savedUserId = localStorage.getItem('userId');
    return savedUserId ? JSON.parse(savedUserId) : null;
  });

  useEffect(() => {
    if (role) localStorage.setItem('role', JSON.stringify(role));
    else localStorage.removeItem('role');
  }, [role]);

  useEffect(() => {
    if (campus) localStorage.setItem('campus', JSON.stringify(campus));
    else localStorage.removeItem('campus');
  }, [campus]);

  useEffect(() => {
    if (userId) localStorage.setItem('userId', JSON.stringify(userId));
    else localStorage.removeItem('userId');
  }, [userId]);

  const login = (userId, role, campus) => {
    setUserId(userId);
    setRole(role);
    setCampus(campus);
  };

  const logout = () => {
    setUserId(null);
    setRole(null);
    setCampus(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('campus');
  };

  return (
    <AuthContext.Provider value={{ userId, role, campus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
