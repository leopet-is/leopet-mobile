import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../components/StyledComponents/styles';

export default function ReportesAdmin() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes (próximamente)</Text>
      <Text>Aquí se visualizarán los reportes y estadísticas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.greenPet, marginBottom: 8 },
});
