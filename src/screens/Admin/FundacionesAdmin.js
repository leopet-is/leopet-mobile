import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLOBALCONFIG } from '../../Config';
import { updateFundacion, deleteFundacionService } from '../../services/Fundacion';
import { Alert } from 'react-native';
import { Colors } from '../../components/StyledComponents/styles';
import { getFundacion } from '../../services/Fundacion';
import FundacionCard from '../../components/Cards/CardFundacion';

export default function FundacionesAdmin({ navigation }) {
  const [fundaciones, setFundaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFundaciones(0, true);
    });
    return unsubscribe;
  }, []);

  const loadFundaciones = async (p = 0, reset = false) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = jsonValue ? JSON.parse(jsonValue) : {};
    if (reset) {
      setLoading(true);
    }
    try {
      const uri = `${GLOBALCONFIG.EndpointBackHost}:${GLOBALCONFIG.EndpointBackPort}`;
      const result = await getFundacion({ q: null, page: p, limit: 20 }, { apiUrl: uri, token: data.token });
      setFundaciones(reset ? result : [...fundaciones, ...result]);
      setHasMore(result.length === 20);
      setPage(p);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Detalle de Fundacion', { fundacionId: item.id })}
    >
      <FundacionCard
        id={item.id}
        nombre={item.nombre}
        logo={item.logo}
        direccion={item.direccion}
        telefono={item.telefono}
        email={item.user?.email}
      />
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleToggleAprobado(item)}
        >
          <Text style={styles.actionText}>{item.aprobado ? 'Desactivar' : 'Activar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#e74c3c' }]}
          onPress={() => confirmDelete(item)}
        >
          <Text style={[styles.actionText, { color: '#fff' }]}>Eliminar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#3498db' }]}
          onPress={() => navigation.navigate('Detalle de Fundacion', { fundacionId: item.id, edit: true })}
        >
          <Text style={[styles.actionText, { color: '#fff' }]}>Editar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleToggleAprobado = async (item) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = jsonValue ? JSON.parse(jsonValue) : {};
    try {
      await updateFundacion({ id: item.id, aprobado: !item.aprobado }, { apiUrl: `${GLOBALCONFIG.EndpointBackHost}:${GLOBALCONFIG.EndpointBackPort}`, token: data.token });
      // refresh
      loadFundaciones(0, true);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', err?.message || 'No se pudo actualizar');
    }
  };

  const confirmDelete = (item) => {
    Alert.alert('Confirmar', `Eliminar fundación ${item.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => handleDelete(item) },
    ]);
  };

  const handleDelete = async (item) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = jsonValue ? JSON.parse(jsonValue) : {};
    try {
      await deleteFundacionService(item.id, { apiUrl: `${GLOBALCONFIG.EndpointBackHost}:${GLOBALCONFIG.EndpointBackPort}`, token: data.token });
      loadFundaciones(0, true);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', err?.message || 'No se pudo eliminar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fundaciones</Text>
      {loading && page === 0 ? (
        <ActivityIndicator size="large" color={Colors.greenPet} />
      ) : (
        <FlatList
          data={fundaciones}
          renderItem={renderItem}
          keyExtractor={(i) => String(i.id)}
          onEndReached={() => hasMore && loadFundaciones(page + 1, false)}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<Text>No hay fundaciones disponibles</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.greenPet, marginBottom: 8 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 8 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#f0f0f0' },
  actionText: { color: Colors.greenPet, fontWeight: 'bold' },
});
