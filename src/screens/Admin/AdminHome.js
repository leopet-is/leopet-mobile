import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../components/StyledComponents/styles';

const sections = [
  { key: 'fundaciones', label: 'Fundaciones', route: 'FundacionesAdmin' },
  { key: 'usuarios', label: 'Usuarios', route: 'UsuariosAdmin' },
  { key: 'solicitudes', label: 'Solicitudes Fundaciones', route: 'SolicitudesAdmin' },
  { key: 'reportes', label: 'Reportes', route: 'ReportesAdmin' },
  { key: 'denuncias', label: 'Denuncias', route: 'AdminDenuncias' },
  { key: 'notificaciones', label: 'Notificaciones', route: 'NotificacionesAdmin' },
];

export default function AdminHome({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>
      {sections.map(s => (
        <TouchableOpacity
          key={s.key}
          style={styles.card}
          onPress={() => navigation.navigate(s.route)}
        >
          <Text style={styles.cardText}>{s.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'stretch' },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.tertiary, marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  cardText: { fontSize: 16, color: Colors.tertiary },
});
