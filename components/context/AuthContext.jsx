import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedData = await AsyncStorage.getItem('jwtToken');
        if (storedData) {
          const parsedData = JSON.parse(storedData); 
          const storedToken = parsedData?.token || parsedData?.userToken || parsedData?.user?.token || null;
          const storedUser = parsedData?.user || parsedData?.user || null;

          console.log("Restored token:", storedToken);
          console.log("Restored user:", storedUser);

          if (storedToken) {
            // set axios default header so subsequent requests include token
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            setToken(storedToken);
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
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
      const tokenToStore = data?.token || data?.userToken || data?.user?.token || null;
      const userToStore = data?.user || data?.user || null;

      const storeObj = { token: tokenToStore, user: userToStore };
      await AsyncStorage.setItem('jwtToken', JSON.stringify(storeObj)); // store token+user
  console.log('Stored jwtToken:', JSON.stringify(storeObj));

      if (tokenToStore) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenToStore}`;
      }

      setToken(tokenToStore);
      setUser(userToStore);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error storing token or user details:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken'); // Remove token from AsyncStorage

      // Remove default axios header
      delete axios.defaults.headers.common['Authorization'];

      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error removing token or user details:', error);
    }
  };

  if (isLoading) {
    // Show nothing or a splash screen while loading
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
