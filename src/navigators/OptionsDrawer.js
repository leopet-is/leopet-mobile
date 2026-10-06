import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeTab from './HomeTab';
import Perfil from '../screens/Perfil';

const Drawer = createDrawerNavigator();

export default function OptionsDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeTab} options={{ headerShown: false }} />
      <Drawer.Screen name="Perfil" component={Perfil} />
    </Drawer.Navigator>
  );
}
