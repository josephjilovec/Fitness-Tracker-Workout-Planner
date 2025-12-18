/**
 * @fileoverview Authentication Context
 * @description Global authentication state management using React Context
 * @module contexts/AuthContext
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

/**
 * AuthProvider component
 * Provides authentication state and methods to child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.register(userData);
      
      if (response.status === 'success' && response.data) {
        const { user: newUser, token: newToken } = response.data;
        
        setUser(newUser);
        setToken(newToken);
        setIsAuthenticated(true);
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast.success('Registration successful!');
        return { success: true, user: newUser };
      }
      
      throw new Error('Registration failed');
    } catch (error) {
      const message = error.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      
      if (response.status === 'success' && response.data) {
        const { user: loggedInUser, token: newToken } = response.data;
        
        setUser(loggedInUser);
        setToken(newToken);
        setIsAuthenticated(true);
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        
        toast.success('Login successful!');
        return { success: true, user: loggedInUser };
      }
      
      throw new Error('Login failed');
    } catch (error) {
      const message = error.message || 'Invalid credentials. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast.info('Logged out successfully');
  }, []);

  /**
   * Update user data
   */
  const updateUser = useCallback((userData) => {
    setUser((prevUser) => ({ ...prevUser, ...userData }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
  }, [user]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

