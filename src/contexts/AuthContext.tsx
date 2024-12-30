import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedLoggedIn = await AsyncStorage.getItem('loggedIn');
      if (storedUserId && storedLoggedIn === 'true') {
        setUserId(storedUserId);
        setIsLoggedIn(true);
      }
    };
    loadAuthData();
  }, []);

  const login = async (userId: string) => {
    setIsLoggedIn(true);
    setUserId(userId);
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.setItem('loggedIn', 'true');
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUserId(null);
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.setItem('loggedIn', 'false');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};