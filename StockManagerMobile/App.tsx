import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './app/navigation';
import { AuthProvider } from './app/context/AuthContext';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

// Thème personnalisé pour toute l'app
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF', 
  },
};

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
        <StatusBar style="auto" />
      </PaperProvider>
    </AuthProvider>
  );
}
