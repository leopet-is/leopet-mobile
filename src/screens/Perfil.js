import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import CustomHeader from '../components/Headers/CustomHeader';
import { getManadas } from '../services/Manada';
import { GLOBALCONFIG } from '../Config';
import { Colors } from '../components/StyledComponents/styles';

const Perfil = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [manadas, setManadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const sessionValue = await AsyncStorage.getItem('session');
      if (!sessionValue) {
        throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
      }

      const session = JSON.parse(sessionValue);
      setUser(session);
      if (Number(session.role) === 3) {
        if (!session.token) {
          throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
        }
        const result = await getManadas(
          { page: 0, limit: 100 },
          { apiUrl: GLOBALCONFIG.EndpointBackHost, token: session.token },
        );
        setManadas(result);
      } else {
        setManadas([]);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudo cargar la información del perfil.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProfile);
    return unsubscribe;
  }, [navigation]);

  const fullName = [user?.nombres, user?.apellidos].filter(Boolean).join(' ');

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <CustomHeader isHome={true} title="Perfil" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={30} color={Colors.tertiary} />
          </View>
          <View style={styles.headingText}>
            <Text style={styles.title}>Mi perfil</Text>
            <Text style={styles.subtitle}>Tu cuenta y tus suscripciones</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.greenPet} style={styles.loading} />
        ) : (
          <>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {user ? (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Datos de la cuenta</Text>
                <ProfileRow icon="user" label="Nombre" value={fullName} />
                <ProfileRow icon="mail" label="Correo" value={user.email} />
                <ProfileRow icon="phone" label="Teléfono" value={user.telefono} />
                <ProfileRow icon="credit-card" label="Cédula" value={user.cedula} />
              </View>
            ) : null}

            <View style={styles.sectionHeading}>
              <MaterialCommunityIcons
                name="account-group-outline"
                size={23}
                color={Colors.tertiary}
              />
              <Text style={styles.sectionHeadingText}>Mis suscripciones</Text>
            </View>

            {Number(user?.role) !== 3 ? (
              <Text style={styles.emptyText}>
                La administración de suscripciones está disponible para cuentas donadoras.
              </Text>
            ) : error ? null : manadas.length ? (
              manadas.map((manada) => (
                <View key={String(manada.id)} style={styles.subscriptionCard}>
                  <View style={styles.subscriptionHeader}>
                    <Text style={styles.manadaName}>{manada.nombre}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        manada.statusSubscription ? styles.activeBadge : styles.inactiveBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          manada.statusSubscription ? styles.activeText : styles.inactiveText,
                        ]}
                      >
                        {manada.statusSubscription ? 'Activa' : 'Inactiva'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.subscriptionDetails}>
                    <Text style={styles.detailText}>
                      Aporte mensual: ${Number(manada.monto || 0).toFixed(2)}
                    </Text>
                    <Text style={styles.detailText}>
                      Animales apadrinados: {manada.apadrinados ?? 0}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aún no tienes manadas o suscripciones.</Text>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.getParent()?.navigate('Manadas')}
            >
              <MaterialCommunityIcons
                name="credit-card-settings-outline"
                size={19}
                color={Colors.tertiary}
              />
              <Text style={styles.actionText}>Administrar suscripciones</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.changeDataButton]}
              onPress={() => navigation.navigate('Cambio_datos')}
            >
              <Feather name="edit-2" size={18} color={Colors.tertiary} />
              <Text style={styles.actionText}>Cambiar datos</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.tertiary} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const ProfileRow = ({ icon, label, value }) => (
  <View style={styles.profileRow}>
    <Feather name={icon} size={17} color={Colors.greenPet} />
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value || 'No registrado'}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.beige,
  },
  content: {
    padding: 18,
    paddingBottom: 32,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cyanSoft,
    marginRight: 14,
  },
  headingText: {
    flex: 1,
  },
  title: {
    color: Colors.tertiary,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.gray,
    fontSize: 14,
    marginTop: 3,
  },
  loading: {
    marginTop: 32,
  },
  error: {
    color: Colors.red,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.primary,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
  },
  sectionTitle: {
    color: Colors.tertiary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionHeadingText: {
    color: Colors.tertiary,
    fontSize: 17,
    fontWeight: '700',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary,
    gap: 10,
  },
  rowLabel: {
    color: Colors.gray,
    width: 82,
    fontSize: 13,
  },
  rowValue: {
    flex: 1,
    color: Colors.tertiary,
    fontSize: 14,
    fontWeight: '600',
  },
  subscriptionCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  manadaName: {
    color: Colors.tertiary,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  activeBadge: {
    backgroundColor: Colors.successSoft,
  },
  inactiveBadge: {
    backgroundColor: Colors.secondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeText: {
    color: '#087443',
  },
  inactiveText: {
    color: Colors.gray,
  },
  subscriptionDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.secondary,
    paddingTop: 10,
    gap: 5,
  },
  detailText: {
    color: Colors.gray,
    fontSize: 14,
  },
  emptyText: {
    color: Colors.gray,
    backgroundColor: Colors.primary,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: Colors.greenPet,
    borderRadius: 25,
    minHeight: 50,
    paddingHorizontal: 18,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changeDataButton: {
    backgroundColor: Colors.cyanSoft,
  },
  actionText: {
    color: Colors.tertiary,
    fontWeight: '700',
    fontSize: 15,
  },
});

export default Perfil;
