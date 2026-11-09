import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../components/StyledComponents/styles';

export default function DonadorHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zona Donador</Text>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AnimalesDonador')}>
        <Text style={styles.cardText}>Ver Animales</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Manadas')}>
        <Text style={styles.cardText}>Mis Manadas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Crear Manada', { isMenu: 'MANADAS', isEditar: false })}>
        <Text style={styles.cardText}>Crear Manada</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.tertiary, marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  cardText: { fontSize: 16, color: Colors.tertiary },
});
