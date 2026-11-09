// React Navigation

import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Tabs

//Screens
import FundacionScreen from '../screens/FundacionScreen';
import FundacionDetalle from '../screens/FundacionDetalle';
import AnimalDetalle from '../screens/AnimalDetalle';

//Colors
import { Colors } from '../components/StyledComponents/styles';

const Stack = createNativeStackNavigator();

const FundacionStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: Colors.tertiary,
        headerTransparent: true,
        headerTitle: '',
        headerLeftContainerStyle: {
          paddingLeft: 20,
        },
      }}
      initialRouteName="Fundaciones"
    >
      <Stack.Screen name="Fundaciones" component={FundacionScreen} />
      <Stack.Screen name="Detalle de Fundacion" component={FundacionDetalle} />
      <Stack.Screen name="Detalle de Animal" component={AnimalDetalle} />
      {/* <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: Colors.primary,
        }}
        name="Crear Manada"
        component={CrearManada}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: Colors.primary,
        }}
        name="Ver Manada"
        component={AnimalesManada}
      /> */}
    </Stack.Navigator>
  );
};

export default FundacionStack;
