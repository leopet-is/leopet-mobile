import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../components/StyledComponents/styles';
import { getAnimalsApp } from '../../services/Animals';
import CardAnimal from '../../components/Cards/CardAnimal';

import { GLOBALCONFIG } from '../../Config';

export default function DonadorAnimals({ navigation }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAnimals(0, true);
    });
    return unsubscribe;
  }, []);

  const loadAnimals = async (p = 0, reset = false) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = jsonValue ? JSON.parse(jsonValue) : {};
    if (reset) setLoading(true);
    try {
      const uri = GLOBALCONFIG.EndpointBackHost;
      const result = await getAnimalsApp({ q: null, page: p, limit: 20 }, { apiUrl: uri, token: data.token });
      setAnimals(reset ? result : [...animals, ...result]);
      setHasMore(result.length === 20);
      setPage(p);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Detalle de Animal', { animalId: item.id })}>
        <CardAnimal id={item.id} nombre={item.nombre} descripcion={item.descripcion} imagen={item.imagen} />
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.apadrinarBtn} onPress={() => navigation.navigate('Crear Manada', { isMenu: 'MANADAS', isEditar: false, animalId: item.id, nombreAnimal: item.nombre })}>
          <Text style={styles.apadrinarText}>Apadrinar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animales para apadrinar</Text>
      {loading && page === 0 ? (
        <ActivityIndicator size="large" color={Colors.greenPet} />
      ) : (
        <FlatList
          data={animals}
          renderItem={renderItem}
          keyExtractor={(i) => String(i.id)}
          onEndReached={() => hasMore && loadAnimals(page + 1, false)}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<Text>No hay animales disponibles</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.greenPet, marginBottom: 8 },
  itemContainer: { marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginRight: 12, marginTop: 6 },
  apadrinarBtn: { backgroundColor: Colors.pinkPet, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  apadrinarText: { color: Colors.primary, fontWeight: 'bold' },
});
