import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AdminHome from '../screens/Admin/AdminHome';
import FundacionesAdmin from '../screens/Admin/FundacionesAdmin';
import FundacionDetalle from '../screens/FundacionDetalle';
import UsuariosAdmin from '../screens/Admin/UsuariosAdmin';
import SolicitudesAdmin from '../screens/Admin/SolicitudesAdmin';
import ReportesAdmin from '../screens/Admin/ReportesAdmin';
import NotificacionesAdmin from '../screens/Admin/NotificacionesAdmin';
import AdminDenuncias from '../screens/AdminDenuncias';

const Stack = createStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator initialRouteName="AdminHome">
      <Stack.Screen name="AdminHome" component={AdminHome} options={{ headerShown: false }} />
      <Stack.Screen name="FundacionesAdmin" component={FundacionesAdmin} options={{ title: 'Fundaciones' }} />
      <Stack.Screen name="UsuariosAdmin" component={UsuariosAdmin} options={{ title: 'Usuarios' }} />
      <Stack.Screen name="SolicitudesAdmin" component={SolicitudesAdmin} options={{ title: 'Solicitudes' }} />
      <Stack.Screen name="Detalle de Fundacion" component={FundacionDetalle} options={{ title: 'Detalle de Fundacion' }} />
      <Stack.Screen name="ReportesAdmin" component={ReportesAdmin} options={{ title: 'Reportes' }} />
      <Stack.Screen name="NotificacionesAdmin" component={NotificacionesAdmin} options={{ title: 'Notificaciones' }} />
      <Stack.Screen name="AdminDenuncias" component={AdminDenuncias} options={{ title: 'Denuncias' }} />
    </Stack.Navigator>
  );
}
