import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/Headers/CustomHeader';
import { Colors, StyledSafeArea } from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';
import { getManadas } from '../services/Manada';
import { getAnimalImageUri } from '../utils/animalImage';

const requestErrorMessage = (error) =>
  error instanceof Error ? error.message : 'No se pudieron cargar tus manadas.';

const AgregarAnimalManada = ({ route, navigation }) => {
  const animal = route.params || {};
  const [manadas, setManadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadManadas = async () => {
      setLoading(true);
      setError('');
      try {
        const sessionValue = await AsyncStorage.getItem('session');
        const session = sessionValue ? JSON.parse(sessionValue) : null;
        if (!session?.token) {
          throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
        }

        const options = {
          apiUrl: GLOBALCONFIG.EndpointBackHost,
          token: session.token,
        };
        const allManadas = [];
        let page = 0;
        let pageManadas;
        do {
          pageManadas = await getManadas({ q: null, page, limit: 20 }, options);
          allManadas.push(...pageManadas);
          page += 1;
        } while (pageManadas.length === 20);

        if (active) setManadas(allManadas);
      } catch (loadError) {
        if (active) setError(requestErrorMessage(loadError));
      } finally {
        if (active) setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadManadas);
    loadManadas();
    return () => {
      active = false;
      unsubscribe();
    };
  }, [navigation]);

  const selectManada = (manada) => {
    navigation.navigate('Confirmar', {
      ...animal,
      manadaId: manada.id ?? manada.id_manada ?? manada.manadaId,
    });
  };

  const createManada = () => {
    navigation.navigate('Crear Manada', {
      isMenu: 'HOME',
      isEditar: false,
      animalId: animal.animalId,
      origin: 'animalDetail',
    });
  };

  const renderManada = ({ item }) => {
    return (
      <TouchableOpacity style={styles.manadaCard} onPress={() => selectManada(item)}>
        <View style={styles.manadaIcon}>
          <Ionicons name="people" size={23} color={Colors.greenPet} />
        </View>
        <View style={styles.manadaDetails}>
          <Text style={styles.manadaName} numberOfLines={1}>{item.nombre || 'Manada sin nombre'}</Text>
          <Text style={styles.manadaInfo}>
            {Number(item.apadrinados || 0)} {Number(item.apadrinados || 0) === 1 ? 'animal' : 'animales'}
            {' · '}Aporte mensual: ${item.monto || '0'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.greenPet} />
      </TouchableOpacity>
    );
  };

  const imageUri = getAnimalImageUri(animal);

  return (
    <StyledSafeArea style={styles.container}>
      <CustomHeader title="Agregar a manada" color={Colors.greenPet} navigation={navigation} />
      <StatusBar style="dark" />
      <FlatList
        data={manadas}
        renderItem={renderManada}
        keyExtractor={(item, index) =>
          String(item.id ?? item.id_manada ?? item.manadaId ?? index)
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Selecciona una manada</Text>
            <Text style={styles.description}>
              Elige dónde agregar a {animal.nombre || 'este animal'}.
            </Text>
            <View style={styles.animalPreview}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.animalImage} />
              ) : (
                <View style={styles.animalPlaceholder}>
                  <Ionicons name="paw" size={26} color={Colors.greenPet} />
                </View>
              )}
              <View style={styles.animalDetails}>
                <Text style={styles.animalName} numberOfLines={1}>
                  {animal.nombre || 'Animal'}
                </Text>
                <Text style={styles.animalMeta}>
                  {animal.especie || 'Especie no disponible'}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={22} color={Colors.greenPet} />
            </View>
            <TouchableOpacity style={styles.createButton} onPress={createManada}>
              <Ionicons name="add-circle-outline" size={21} color={Colors.primary} />
              <Text style={styles.createButtonText}>Crear una nueva manada</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Tus manadas</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? null : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.emptyText}>Aún no tienes manadas. Crea una para continuar.</Text>
          )
        }
        ListFooterComponent={loading ? <ActivityIndicator color={Colors.greenPet} style={styles.loader} /> : null}
      />
      {error && manadas.length ? <Text style={styles.errorText}>{error}</Text> : null}
    </StyledSafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  title: {
    color: Colors.tertiary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    color: Colors.gray,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 14,
  },
  animalPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    marginBottom: 14,
  },
  animalImage: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
  },
  animalPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalDetails: {
    flex: 1,
    marginHorizontal: 11,
  },
  animalName: {
    color: Colors.tertiary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  animalMeta: {
    color: Colors.gray,
    fontSize: 12,
    marginTop: 3,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: Colors.greenPet,
    borderRadius: 12,
    marginBottom: 16,
  },
  createButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    color: Colors.tertiary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  manadaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 18,
    marginVertical: 5,
    minHeight: 76,
  },
  manadaIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.cyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manadaDetails: {
    flex: 1,
    marginHorizontal: 12,
  },
  manadaName: {
    color: Colors.tertiary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  manadaInfo: {
    color: Colors.gray,
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: Colors.gray,
    textAlign: 'center',
    margin: 24,
  },
  errorText: {
    color: Colors.red,
    textAlign: 'center',
    padding: 16,
  },
  loader: {
    marginVertical: 20,
  },
});

export default AgregarAnimalManada;
