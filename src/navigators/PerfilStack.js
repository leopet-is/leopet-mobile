import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AnimalDetalle from '../screens/AnimalDetalle';
import CambioDatos from '../screens/CambioDatos';
import NotificacionDetalle from '../screens/NotificacionDetalle';
import Notificaciones from '../screens/Notificaciones';
import Perfil from '../screens/Perfil';

const Stack = createNativeStackNavigator();

export default function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Cambio_datos" component={CambioDatos} />
      <Stack.Screen name="Notificaciones" component={Notificaciones} />
      <Stack.Screen name="NotificacionDetalle" component={NotificacionDetalle} />
      <Stack.Screen name="Detalle de Animal" component={AnimalDetalle} />
    </Stack.Navigator>
  );
}
