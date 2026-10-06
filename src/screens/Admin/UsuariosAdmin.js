import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../components/StyledComponents/styles';

export default function UsuariosAdmin() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios (próximamente)</Text>
      <Text>Aquí se gestionarán los usuarios del sistema.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.greenPet, marginBottom: 8 },
});
