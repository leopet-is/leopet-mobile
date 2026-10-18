import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animales from '../components/Cards/CardAnimal';
import { getAnimalsFundacionApp } from '../services/Animals';
import CustomHeader from '../components/Headers/CustomHeader';
import { Ionicons, Feather } from '@expo/vector-icons';

import {
  StyledSafeArea,
  StyledScrollContainer,
  InnerContainer,
  Colors,
} from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';

const FundacionDetalle = ({ route, navigation }) => {
  const { nombre, fundacionId, logo, telefono, direccion, descripcion } = route.params;
  const uri = GLOBALCONFIG.EndpointBackHost;

  const [animals, setAnimals] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnimals(0, true);
  }, []);

  const loadAnimals = async (page, reset) => {
    setError('');
    if (reset) setLoading(true);

    try {
      const jsonValue = await AsyncStorage.getItem('session');
      if (!jsonValue) throw new Error('Inicia sesión de nuevo para cargar los animales.');
      const session = JSON.parse(jsonValue);
      if (!session?.token) throw new Error('La sesión no es válida. Inicia sesión de nuevo.');

      const result = await getAnimalsFundacionApp(
        { page, id_fundacion: fundacionId, limit: 20 },
        { apiUrl: uri, token: session.token },
      );
      setAnimals(reset ? result : [...animals, ...result]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los animales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledSafeArea style={{ backgroundColor: Colors.primary }}>
      <CustomHeader isHome={false} title="Detalle" navigation={navigation} />

      <StyledScrollContainer contentContainerStyle={{ paddingBottom: 40 }}>
        <StatusBar style="dark" />

        {/* Header Hero */}
        <View style={styles.headerHero}>
          <View style={styles.logoWrapper}>
            {!logo ? (
              <ActivityIndicator size="large" color={Colors.greenPet} />
            ) : (
              <Image
                style={styles.logo}
                source={fundacionId == 3 ? require('../assets/img/logo.png') : { uri: logo }}
                resizeMode="contain"
              />
            )}
          </View>
          <Text style={styles.foundationName}>{nombre}</Text>
        </View>

        <InnerContainer style={{ paddingHorizontal: 20 }}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Feather name="phone" size={18} color={Colors.greenPet} />
              <Text style={styles.infoText}>{telefono || 'No disponible'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={Colors.greenPet} />
              <Text style={styles.infoText}>{direccion || 'No disponible'}</Text>
            </View>
            {descripcion ? <Text style={styles.description}>{descripcion}</Text> : null}
          </View>

          {/* Animals Section */}
          <View style={styles.sectionHeader}>
            <Ionicons name="paw" size={24} color={Colors.greenPet} />
            <Text style={styles.sectionTitle}>Animales Registrados</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.greenPet} style={{ marginTop: 20 }} />
          ) : error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{error}</Text>
              <TouchableOpacity onPress={() => loadAnimals(0, true)} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : animals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No hay animales registrados aún.</Text>
            </View>
          ) : (
            animals.map((animal) => (
              <TouchableOpacity
                key={animal.id}
                style={{ width: '100%', alignItems: 'center' }}
                onPress={() => navigation.navigate('Detalle de Animal', { ...animal, animalId: animal.id })}
              >
                <Animales {...animal} navigation={navigation} />
              </TouchableOpacity>
            ))
          )}
        </InnerContainer>
      </StyledScrollContainer>
    </StyledSafeArea>
  );
};

const styles = StyleSheet.create({
  headerHero: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#F8F9FA',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  logo: {
    width: '80%',
    height: '80%',
  },
  foundationName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.greenPet,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginTop: -20, // Overlap effect
    elevation: 4,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.tertiary,
    marginLeft: 12,
  },
  description: {
    color: Colors.tertiary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 30,
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.greenPet,
    borderRadius: 18,
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FundacionDetalle;
