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
        const storedData = await AsyncStorage.getItem('jwtToken');
        if (storedData) {
          const parsedData = JSON.parse(storedData); // ✅ convert string → object
          console.log("Token:", parsedData.token);
          console.log("User:", parsedData.user);

          if (parsedData.token) {
            setIsAuthenticated(true); // ✅ valid token, mark user authenticated
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false); // ✅ nothing stored
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // ✅ done loading
      }
    };


    checkToken();
  }, []);

  const login = async (data) => {
    try {
      await AsyncStorage.setItem('jwtToken', JSON.stringify(data)); // store token+user
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
