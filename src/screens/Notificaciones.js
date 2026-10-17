import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Services
import { getNotificaciones, updateNotificacion as updateNotificacionService } from '../services/Notificaciones';

import {
  StyledSafeArea,
  Colors,
} from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';

const Notificaciones = ({ navigation }) => {
  const uri = GLOBALCONFIG.EndpointBackHost;

  const [isLoading, setLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotificaciones(true);
    });
    return unsubscribe;
  }, [navigation]);

  const updateNotificacion = async (id) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = await JSON.parse(jsonValue);
    updateNotificacionService({ id, leido: true, fecha_leido: Date.now() }, {
      apiUrl: uri,
      token: data.token,
    }).catch(console.error);
  };

  const loadNotificaciones = async (reset) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = await JSON.parse(jsonValue);
    if (reset) setLoading(true);

    getNotificaciones({
      apiUrl: uri,
      token: data.token,
    })
      .then((res) => {
        setNotificaciones(res.notificaciones);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderNotification = (notificacion) => {
    const isAlerta = notificacion.tipoNotificacion === 'alertaSalud';
    const isLeido = notificacion.leido;

    return (
      <TouchableOpacity
        key={notificacion.id}
        style={[styles.notificationBubble, !isLeido && styles.unreadBubble]}
        onPress={() => {
          if (!isLeido) {
            updateNotificacion(notificacion.id);
            // Local update to avoid flicker
            setNotificaciones(prev => prev.map(n => n.id === notificacion.id ? { ...n, leido: true } : n));
          }
          navigation.navigate('NotificacionDetalle', {
            notificacion: notificacion,
            isMenu: 'HOME',
            isEditar: false,
          });
        }}
      >
        {/* Unread Indicator Dot */}
        {!isLeido && <View style={styles.unreadDot} />}

        <View style={styles.bubbleContent}>
          {/* Left Icon Container */}
          <View style={[styles.iconContainer, isAlerta ? styles.iconAlert : styles.iconNormal]}>
            <Ionicons
              name={isAlerta ? "warning" : "notifications"}
              size={20}
              color="white"
            />
          </View>

          {/* Main Info */}
          <View style={styles.textContainer}>
            <View style={styles.tagRow}>
              <View style={[styles.tag, isAlerta ? styles.tagRed : styles.tagBlue]}>
                <Text style={[styles.tagText, isAlerta ? styles.tagTextRed : styles.tagTextBlue]}>
                  {isAlerta ? 'ALERTA DE SALUD' : 'NOTIFICACIÓN'}
                </Text>
              </View>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={12} color={Colors.gray} />
                <Text style={styles.dateText}>{formatDate(notificacion.createdAt || notificacion.fecha)}</Text>
              </View>
            </View>

            <View style={styles.animalInfoRow}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: notificacion.animal?.imagen }}
                  style={styles.avatar}
                />
              </View>
              <View>
                <Text style={styles.animalName}>{notificacion.animal?.nombre}</Text>
                <View style={styles.especieRow}>
                  <MaterialCommunityIcons name="paw" size={12} color={Colors.gray} />
                  <Text style={styles.especieName}>{notificacion.animal?.especie}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>
              {notificacion.descripcionAlerta || 'Tiene una nueva actualización'}
            </Text>
          </View>

          {/* Right Chevron */}
          <View style={styles.chevronContainer}>
            <Feather name="chevron-right" size={20} color={Colors.gray} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <StyledSafeArea style={{ backgroundColor: Colors.primary }}>
      <StatusBar style="light" />

      {/* custom Header (Modal Style) */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.headerIconCircle}>
            <Ionicons name="notifications" size={24} color="white" />
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <Text style={styles.headerSubtitle}>Tus notificaciones recientes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.greenPet} style={{ marginTop: 50 }} />
        ) : notificaciones.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={60} color={Colors.secondary} />
            <Text style={styles.emptyText}>No tienes notificaciones recientes</Text>
          </View>
        ) : (
          notificaciones.map(renderNotification)
        )}

        {!isLoading && notificaciones.length > 0 && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color={Colors.greenPet} />
            <Text style={styles.loadingMoreText}>Cargando más notificaciones...</Text>
          </View>
        )}
      </ScrollView>
    </StyledSafeArea>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.greenPet,
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  scrollContent: {
    padding: 15,
    backgroundColor: '#F3F4F6', // Web background gray
    minHeight: '100%',
  },
  notificationBubble: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
  },
  unreadBubble: {
    borderColor: 'rgba(78, 164, 177, 0.2)',
    borderWidth: 1,
  },
  unreadDot: {
    position: 'absolute',
    left: 8,
    top: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.greenPet,
    marginTop: -4,
  },
  bubbleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconNormal: {
    backgroundColor: Colors.greenPet,
  },
  iconAlert: {
    backgroundColor: Colors.red,
  },
  textContainer: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagBlue: {
    backgroundColor: '#E0F2FE',
  },
  tagRed: {
    backgroundColor: '#FEE2E2',
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tagTextBlue: {
    color: '#0369A1',
  },
  tagTextRed: {
    color: '#B91C1C',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: Colors.gray,
    marginLeft: 4,
  },
  animalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  animalName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.tertiary,
  },
  especieRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  especieName: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.tertiary,
    lineHeight: 18,
  },
  chevronContainer: {
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    color: Colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
  loadingMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 8,
  }
});

export default Notificaciones;
