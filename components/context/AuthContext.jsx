import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Handle loading state during token check

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          setIsAuthenticated(true); // Token found, user is authenticated
        }
      } catch (error) {
        console.error('Error checking token:', error);
      } finally {
        setIsLoading(false); // Loading complete
      }
    };

    checkToken();
  }, []);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('jwtToken', token); // Store token in AsyncStorage
      
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error storing token or user details:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken'); // Remove token from AsyncStorage
      
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing token or user details:', error);
    }
  };

  if (isLoading) {
    // Show nothing or a splash screen while loading
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
