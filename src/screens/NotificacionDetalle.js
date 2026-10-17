import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { updateNotificacion as updateNotificacionService } from '../services/Notificaciones';
import CustomHeader from '../components/Headers/CustomHeader';

import {
  StyledSafeArea,
  Colors,
} from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';

const NotificacionDetalle = ({ route, navigation }) => {
  const { notificacion } = route.params;
  const uri = GLOBALCONFIG.EndpointBackHost;

  const [defaultRating, setdefaultRating] = useState(notificacion.calificacion || 0);
  const maxRating = [1, 2, 3, 4, 5];

  const updateNotificacion = async (calificacion) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = await JSON.parse(jsonValue);
    updateNotificacionService({
      id: notificacion.id,
      calificacion,
      fecha_calificacion: Date.now(),
    }, {
      apiUrl: uri,
      token: data.token,
    }).catch(console.error);
  };

  const CustomRatingBar = () => {
    return (
      <View style={styles.ratingBar}>
        {maxRating.map((item) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={item}
            onPress={() => {
              if (!notificacion.calificacion) {
                setdefaultRating(item);
                updateNotificacion(item);
                notificacion.calificacion = item;
              }
            }}
          >
            <Ionicons
              name={item <= defaultRating ? "star" : "star-outline"}
              size={32}
              color={item <= defaultRating ? "#FFC107" : Colors.gray}
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <StyledSafeArea style={{ backgroundColor: Colors.primary }}>
      <CustomHeader isHome={false} title="Detalle" navigation={navigation} />
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Animal Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: notificacion.animal?.imagen }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.animalName}>{notificacion.animal?.nombre}</Text>
            <View style={styles.tagRow}>
              <View style={styles.speciesTag}>
                <MaterialCommunityIcons name="paw" size={14} color="white" />
                <Text style={styles.tagText}>{notificacion.animal?.especie}</Text>
              </View>
              <View style={styles.genderTag}>
                <Ionicons
                  name={notificacion.animal?.sexo ? "male" : "female"}
                  size={14}
                  color="white"
                />
                <Text style={styles.tagText}>{notificacion.animal?.sexo ? 'Macho' : 'Hembra'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={22} color={Colors.greenPet} />
            <Text style={styles.sectionTitle}>Informe de Salud</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{notificacion.actualizacion?.fecha || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fundación</Text>
              <Text style={styles.infoValue}>{notificacion.actualizacion?.fundacion || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Estado General</Text>
            <Text style={styles.statusValue}>{notificacion.actualizacion?.estado_salud || 'Sin especificar'}</Text>
          </View>

          <Text style={styles.descriptionLabel}>Descripción detallada</Text>
          <Text style={styles.descriptionText}>
            {notificacion.actualizacion?.descripcion || notificacion.descripcionAlerta || 'No hay descripción adicional.'}
          </Text>

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>¿Qué te pareció esta actualización?</Text>
            <CustomRatingBar />
            {!notificacion.calificacion && (
              <Text style={styles.ratingHint}>Tu calificación nos ayuda a mejorar</Text>
            )}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => navigation.navigate('Detalle de Animal', { animalId: notificacion.animal.id, ...notificacion.animal })}
        >
          <Text style={styles.buttonText}>Ver perfil completo de {notificacion.animal?.nombre}</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </StyledSafeArea>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    backgroundColor: '#F9FAFB',
  },
  heroSection: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  animalName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
  },
  speciesTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greenPet,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  genderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  contentCard: {
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginLeft: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    flex: 0.48,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.tertiary,
  },
  statusBox: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.greenPet,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: Colors.tertiary,
    lineHeight: 22,
    marginBottom: 30,
  },
  ratingSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginBottom: 15,
  },
  ratingBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ratingHint: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 5,
  },
  mainButton: {
    backgroundColor: Colors.greenPet,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
    marginTop: 20,
    padding: 18,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default NotificacionDetalle;
