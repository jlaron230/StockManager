// app/navigation/index.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DrawerNavigator from './DrawerNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AjouterProduitScreen from '../screens/AjouterProduitScreen';





type Product = {
  id_product: number;
  nom: string;
  quantité_en_stock: number;
  prix_unitaire: string;
  description?: string;

};

export type RootStackParamList = {
  Login: undefined;
  Acceuil: undefined;
  DétailProduit: { product: Product };
  AjouterProduit: undefined;


};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Acceuil" component={DrawerNavigator}
  options={{ headerShown: false }}
/>
        <Stack.Screen name="DétailProduit" component={ProductDetailScreen} />
        <Stack.Screen name="AjouterProduit" component={AjouterProduitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
