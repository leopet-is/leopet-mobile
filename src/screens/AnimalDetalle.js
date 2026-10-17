import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardManada from '../components/Cards/CardManada';
import { getManadas } from '../services/Manada';
import CustomHeader from '../components/Headers/CustomHeader';
import { Ionicons } from '@expo/vector-icons';

import {
  StyledSafeArea,
  StyledScrollContainer,
  InnerContainer,
  PageTitle,
  Colors,
} from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';

const AnimalDetalle = ({ route, navigation }) => {
  const {
    animalId,
    nombre,
    especie,
    raza,
    descripcion,
    imagen,
    fundacion,
    edad,
    peso,
    esterilizacion,
    vacunacion,
    desparasitacion,
    enfermedades,
    fecha_rescate,
    fecha_registro,
    sexo,
    galeria,
  } = route.params;

  const uri = GLOBALCONFIG.EndpointBackHost;
  const [manadas, setManadas] = useState([]);
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    loadManadas(0, true);
  }, []);

  const loadManadas = async (page, reset) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = await JSON.parse(jsonValue);
    if (reset) setLoading(true);

    return getManadas({ q: null, page, limit: 20 }, { apiUrl: uri, token: data.token })
      .then((data) => {
        setManadas(reset ? data : [...manadas, ...data]);
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

        {/* Animal Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: (galeria && galeria.fotos && galeria.fotos[0]) || imagen }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        <InnerContainer style={{ paddingHorizontal: 20 }}>
          <View style={styles.headerInfo}>
            <Text style={styles.animalName}>{nombre}</Text>
            <TouchableOpacity
              style={styles.adoptButton}
              onPress={() => navigation.navigate('Agregar A Manada', { animalId, nombre, descripcion, imagen, fundacion, raza, especie, galeria })}
            >
              <Text style={styles.adoptButtonText}>Apadrinar</Text>
            </TouchableOpacity>
          </View>

          {/* Info Sections */}
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.greenPet} />
            <Text style={styles.sectionTitle}>Información General</Text>
          </View>

          <View style={styles.infoGrid}>
            <InfoItem label="Especie" value={especie} />
            <InfoItem label="Raza" value={raza} />
            <InfoItem label="Edad" value={`${edad} años`} />
            <InfoItem label="Sexo" value={sexo == 1 ? 'Macho' : 'Hembra'} />
            <InfoItem label="Fundación" value={fundacion} />
            <InfoItem label="Peso" value={`${peso} Kg`} />
          </View>

          <View style={styles.sectionHeader}>
            <Ionicons name="medkit-outline" size={24} color={Colors.greenPet} />
            <Text style={styles.sectionTitle}>Salud y Estado</Text>
          </View>

          <View style={styles.infoGrid}>
            <StatusItem label="Esterilizado" status={esterilizacion} />
            <StatusItem label="Vacunado" status={vacunacion} />
            <StatusItem label="Desparasitado" status={desparasitacion} />
          </View>

          {enfermedades && (
            <View style={styles.historyBox}>
              <Text style={styles.boxLabel}>Enfermedades:</Text>
              <Text style={styles.boxText}>{enfermedades}</Text>
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Ionicons name="book-outline" size={24} color={Colors.greenPet} />
            <Text style={styles.sectionTitle}>Historia</Text>
          </View>

          <View style={styles.historyBox}>
            <Text style={styles.boxLabel}>Rescatado el:</Text>
            <Text style={styles.boxText}>{fecha_rescate}</Text>
            <Text style={[styles.boxLabel, { marginTop: 10 }]}>Descripción:</Text>
            <Text style={styles.boxText}>{descripcion}</Text>
          </View>

        </InnerContainer>
      </StyledScrollContainer>
    </StyledSafeArea>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const StatusItem = ({ label, status }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={[styles.statusBadge, { backgroundColor: status == 1 ? '#D1FAE5' : '#FEE2E2' }]}>
      <Text style={{ color: status == 1 ? '#065F46' : '#991B1B', fontSize: 12, fontWeight: 'bold' }}>
        {status == 1 ? '✓ Sí' : '✗ No'}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E7EB',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  animalName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.tertiary,
  },
  adoptButton: {
    backgroundColor: Colors.greenPet,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  adoptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginLeft: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.tertiary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 2,
  },
  historyBox: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  boxLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.gray,
  },
  boxText: {
    fontSize: 15,
    color: Colors.tertiary,
    lineHeight: 22,
  },
});

export default AnimalDetalle;
