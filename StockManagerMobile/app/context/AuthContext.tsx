import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../navigation'; 

type User = {
  id_user: number;
  prenom: string;
  nom: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    };

    loadUser();
  }, []);

  const login = async (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    await AsyncStorage.setItem('token', newToken|| '');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }


  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
