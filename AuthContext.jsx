import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (apiService.isAuthenticated()) {
        const response = await apiService.verifyToken();
        setIsAuthenticated(true);
        setUser(response.user);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await apiService.login(username, password);
      setIsAuthenticated(true);
      setUser(response.user);
      return { success: true, message: response.mensagem };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await apiService.changePassword(currentPassword, newPassword);
      return { success: true, message: response.mensagem };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
