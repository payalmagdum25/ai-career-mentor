import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read user from localStorage on startup
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, password, role) => {
    setLoading(true);
    try {
      const data = await authApi.register(name, email, phone, password, role);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateProfileContext = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfileContext,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
