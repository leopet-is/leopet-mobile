import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Octicons, Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';


import Welcome from '../screens/Home';
import Perfil from '../screens/Perfil';
import ManadaStack from './ManadaStack';
import HomeStack from './HomeStack';
import FundacionStack from './FundacionStack';

import { Colors } from '../components/StyledComponents/styles';

const Tab = createBottomTabNavigator();

const { greenPet } = Colors;

export default function HomeTab() {
  return (
    <Tab.Navigator
      initialRouteName="Welcome"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Animales') {
            iconName = focused ? require('../assets/icons/pawfill.png') : require('../assets/icons/paw-outline.png');
          } else if (route.name === 'Manadas') {
            iconName = focused ? require('../assets/icons/dog-fill.png') : require('../assets/icons/dog-outline.png');
          } else if (route.name === 'Fundación') {
            iconName = focused ? require('../assets/icons/hand-heart.png') : require('../assets/icons/hand-heart-outline.png');
          } else if (route.name === 'Perfil') {
            return <Ionicons name={focused ? 'person' : 'person-outline'} size={25} color={focused ? greenPet : 'gray'} />;
          }

          return <Image source={iconName} style={{ width: 25, height: 25 }} />;

        },
        tabBarActiveTintColor: greenPet,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* tabBarBadge es las burbujas de notificaciones */}
      <Tab.Screen name="Animales" component={HomeStack} />
      <Tab.Screen name="Manadas" component={ManadaStack} />
      <Tab.Screen name="Fundación" component={FundacionStack} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}
