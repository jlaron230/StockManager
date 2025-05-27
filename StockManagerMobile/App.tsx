import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './app/navigation';
import { AuthProvider } from './app/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}


