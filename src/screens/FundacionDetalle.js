import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animales from '../components/Cards/CardAnimal';
import { getAnimalsFundacionApp } from '../services/Animals';
import CustomHeader from '../components/Headers/CustomHeader';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  StyledSafeArea,
  StyledScrollContainer,
  InnerContainer,
  Colors,
} from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';

const FundacionDetalle = ({ route, navigation }) => {
  const { nombre, fundacionId, logo, email, telefono, contacto } = route.params;
  const uri = GLOBALCONFIG.EndpointBackHost + ':' + GLOBALCONFIG.EndpointBackPort;

  const [animals, setAnimals] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    loadAnimals(0, true);
  }, []);

  const loadAnimals = async (page, reset) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = await JSON.parse(jsonValue);
    if (reset) setLoading(true);

    return getAnimalsFundacionApp(
      { q: null, page, id_fundacion: fundacionId, limit: 20 },
      { apiUrl: uri, token: data.token }
    )
      .then((res) => {
        setAnimals(reset ? res : [...animals, ...res]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
          {/* Contact Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Feather name="phone" size={18} color={Colors.greenPet} />
              <Text style={styles.infoText}>{telefono || 'No disponible'}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email-outline" size={18} color={Colors.greenPet} />
              <Text style={styles.infoText}>{email || 'No disponible'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color={Colors.greenPet} />
              <Text style={styles.infoText}>{contacto || 'No disponible'}</Text>
            </View>
          </View>

          {/* Animals Section */}
          <View style={styles.sectionHeader}>
            <Ionicons name="paw" size={24} color={Colors.greenPet} />
            <Text style={styles.sectionTitle}>Animales Registrados</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.greenPet} style={{ marginTop: 20 }} />
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
  },
});

export default FundacionDetalle;
