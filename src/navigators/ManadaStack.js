// React Navigation

import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Tabs

//Screens
import CrearManada from '../screens/CrearManada';
import HomeScreen from '../screens/Manadas';
import AnimalesManada from '../screens/AnimalesManada';
import AgregarMiembrosManada from '../screens/AgregarMiembrosManada';
import EditarManada from '../screens/EditarManada';
import AnimalDetalle from '../screens/AnimalDetalle';
import Notificaciones from '../screens/Notificaciones';
//Colors
import { Colors } from '../components/StyledComponents/styles';

const Stack = createNativeStackNavigator();

const ManadaStack = () => {
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
      initialRouteName="Manadas"
    >
      <Stack.Screen name="Manadas" component={HomeScreen} />
      <Stack.Screen name="Crear Manada" component={CrearManada} />
      <Stack.Screen name="AgregarMiembrosManada" component={AgregarMiembrosManada} />
      <Stack.Screen name="EditarManada" component={EditarManada} />
      <Stack.Screen name="Ver Manada" component={AnimalesManada} />
      <Stack.Screen name="Detalle de Animal" component={AnimalDetalle} />
      <Stack.Screen name="Notificaciones" component={Notificaciones} />
    </Stack.Navigator>

  );
};

export default ManadaStack;
