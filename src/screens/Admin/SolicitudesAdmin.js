import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../components/StyledComponents/styles';

export default function SolicitudesAdmin() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitudes Fundaciones (próximamente)</Text>
      <Text>Aquí se validarán y aprobarán solicitudes de fundaciones.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.tertiary, marginBottom: 8 },
});
