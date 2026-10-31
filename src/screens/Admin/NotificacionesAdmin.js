import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../components/StyledComponents/styles';

export default function NotificacionesAdmin() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones (próximamente)</Text>
      <Text>Gestión de notificaciones del sistema.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.greenPet, marginBottom: 8 },
});
