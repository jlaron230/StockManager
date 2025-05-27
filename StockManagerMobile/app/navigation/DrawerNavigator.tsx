import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/DashboardScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import UserProfileScreen from '../screens/UserProfileScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Profil" component={UserProfileScreen} />
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      {/* Tu peux ajouter ici Stock, Produits, etc. */}
    </Drawer.Navigator>
  );
}


