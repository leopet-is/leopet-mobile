import { createStackNavigator } from '@react-navigation/stack';

import DonadorHome from '../screens/Donador/DonadorHome';
import DonadorAnimals from '../screens/Donador/DonadorAnimals';
import Manadas from '../screens/Manadas';
import CrearManada from '../screens/CrearManada';
import FundacionDetalle from '../screens/FundacionDetalle';
import AnimalDetalle from '../screens/AnimalDetalle';

const Stack = createStackNavigator();

export default function DonadorStack() {
  return (
    <Stack.Navigator initialRouteName="DonadorHome">
      <Stack.Screen name="DonadorHome" component={DonadorHome} options={{ headerShown: false }} />
      <Stack.Screen name="AnimalesDonador" component={DonadorAnimals} options={{ title: 'Animales' }} />
      <Stack.Screen name="Manadas" component={Manadas} options={{ title: 'Manadas' }} />
      <Stack.Screen name="Crear Manada" component={CrearManada} options={{ title: 'Crear Manada' }} />
      <Stack.Screen name="Detalle de Fundacion" component={FundacionDetalle} />
      <Stack.Screen name="Detalle de Animal" component={AnimalDetalle} />
    </Stack.Navigator>
  );
}
