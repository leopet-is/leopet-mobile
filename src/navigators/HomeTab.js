import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';


import PerfilStack from './PerfilStack';
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
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Animales') {
            iconName = focused ? require('../assets/icons/pawfill.png') : require('../assets/icons/paw-outline.png');
          } else if (route.name === 'Manadas') {
            iconName = focused ? require('../assets/icons/dog-fill.png') : require('../assets/icons/dog-outline.png');
          } else if (route.name === 'Fundación') {
            iconName = focused ? require('../assets/icons/hand-heart.png') : require('../assets/icons/hand-heart-outline.png');
          } else if (route.name === 'Perfil') {
            return <Ionicons name={focused ? 'person' : 'person-outline'} size={25} color={focused ? greenPet : Colors.gray} />;
          }

          return <Image source={iconName} style={{ width: 25, height: 25 }} />;

        },
        tabBarActiveTintColor: greenPet,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopColor: Colors.secondary,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      {/* tabBarBadge es las burbujas de notificaciones */}
      <Tab.Screen name="Animales" component={HomeStack} />
      <Tab.Screen name="Manadas" component={ManadaStack} />
      <Tab.Screen name="Fundación" component={FundacionStack} />
      <Tab.Screen name="Perfil" component={PerfilStack} />
    </Tab.Navigator>
  );
}
