// React Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Tabs
//Screens
import AddAnimal from '../screens/AddAnimal';
import Confirmation from '../screens/Confirmacion';
import CrearManada from '../screens/CrearManada';
import Home from '../screens/Home';
import AnimalApadrinado from '../screens/AnimalApadrinado';
import Suscripcion from '../screens/Suscripcion';
import Suscripciontarjeta from '../screens/Suscripciontarjeta';
import SuscripcionPay from '../screens/SuscripcionPay';
import Notificaciones from '../screens/Notificaciones';
import NotificacionDetalle from '../screens/NotificacionDetalle';
//Colors
import { Colors } from '../components/StyledComponents/styles';
import AnimalDetalle from '../screens/AnimalDetalle';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
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
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Detalle de Animal" component={AnimalDetalle} />
      <Stack.Screen name="Agregar A Manada" component={AddAnimal} />
      <Stack.Screen name="Crear Manada" component={CrearManada} />
      <Stack.Screen name="Confirmar" component={Confirmation} />
      <Stack.Screen name="Suscripcion" component={Suscripcion} />
      <Stack.Screen name="Suscripciontarjeta" component={Suscripciontarjeta} />
      <Stack.Screen name="SuscripcionPay" component={SuscripcionPay} />
      <Stack.Screen name="Felicidades" component={AnimalApadrinado} />
      <Stack.Screen name="Notificaciones" component={Notificaciones} />
      <Stack.Screen name="NotificacionDetalle" component={NotificacionDetalle} />
    </Stack.Navigator>
  );
};

export default HomeStack;
