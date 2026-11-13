import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DonadorHome from '../screens/Donador/DonadorHome';
import DonadorAnimals from '../screens/Donador/DonadorAnimals';
import Manadas from '../screens/Manadas';
import AnimalesManada from '../screens/AnimalesManada';
import CrearManada from '../screens/CrearManada';
import AgregarAnimalManada from '../screens/AgregarAnimalManada';
import AgregarMiembrosManada from '../screens/AgregarMiembrosManada';
import EditarManada from '../screens/EditarManada';
import Confirmation from '../screens/Confirmacion';
import AnimalApadrinado from '../screens/AnimalApadrinado';
import FundacionDetalle from '../screens/FundacionDetalle';
import AnimalDetalle from '../screens/AnimalDetalle';

const Stack = createNativeStackNavigator();

export default function DonadorStack() {
  return (
    <Stack.Navigator initialRouteName="DonadorHome">
      <Stack.Screen name="DonadorHome" component={DonadorHome} options={{ headerShown: false }} />
      <Stack.Screen name="AnimalesDonador" component={DonadorAnimals} options={{ title: 'Animales' }} />
      <Stack.Screen name="Manadas" component={Manadas} options={{ title: 'Manadas' }} />
      <Stack.Screen name="Crear Manada" component={CrearManada} options={{ title: 'Crear Manada' }} />
      <Stack.Screen name="AgregarAnimalManada" component={AgregarAnimalManada} options={{ title: 'Agregar a manada' }} />
      <Stack.Screen name="AgregarMiembrosManada" component={AgregarMiembrosManada} options={{ title: 'Agregar integrantes' }} />
      <Stack.Screen name="EditarManada" component={EditarManada} options={{ title: 'Editar Manada' }} />
      <Stack.Screen name="Ver Manada" component={AnimalesManada} options={{ title: 'Ver Manada' }} />
      <Stack.Screen name="Confirmar" component={Confirmation} options={{ title: 'Confirmación' }} />
      <Stack.Screen name="Felicidades" component={AnimalApadrinado} options={{ title: 'Animal agregado' }} />
      <Stack.Screen name="Detalle de Fundacion" component={FundacionDetalle} />
      <Stack.Screen name="Detalle de Animal" component={AnimalDetalle} />
    </Stack.Navigator>
  );
}
