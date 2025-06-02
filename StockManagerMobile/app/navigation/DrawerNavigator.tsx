import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/DashboardScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import UserProfileScreen from '../screens/UserProfileScreen';
import ProductListScreen from '../screens/ProductListScreen';


const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Profil" component={UserProfileScreen} />
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Produits" component={ProductListScreen} />

      {/* Tu peux ajouter ici Stock, Produits, etc. */}
    </Drawer.Navigator>
  );
}


