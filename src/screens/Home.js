import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/Headers/CustomHeader';
import Animales from '../components/Cards/CardAnimal';
import { ActivityIndicator, TouchableOpacity, Text, View, StyleSheet, TextInput } from 'react-native';

// Servicios
// Iconos
import { Feather } from '@expo/vector-icons';
import { getAnimalsApp } from '../services/Animals';
import { isHighPriority, rankPets } from '../lib/recommendation';

import {
  StyledSafeArea,
  InnerContainer,
  StyledScrollContainer,
  Colors,
} from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';

const Home = ({ navigation }) => {
  const uri = GLOBALCONFIG.EndpointBackHost;

  // Varibles
  const [animals, setAnimals] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [tipoAnimal, setTipoAnimal] = useState('Todos');

  const [error, setError] = useState();
  const [searchQuery, setSearchQuery] = useState('');

  const [urgencyOnly, setUrgencyOnly] = useState(false);

  // Cargar animales al renderizar el componente
  useEffect(() => {
    return navigation.addListener('focus', () => {
      loadAnimals(0, true);
    });
  }, [navigation]);

  const handleSearch = setSearchQuery;

  const getRankedAnimals = (pets) =>
    rankPets(
      pets.map((animal) => ({
        ...animal,
        fechaRescate: animal.fechaRescate || animal.fecha_rescate,
        fechaRegistro: animal.fechaRegistro || animal.fecha_registro,
      })),
    );

  const loadAnimals = async (page, reset) => {
    setError('');
    if (reset) setLoading(true);

    try {
      const jsonValue = await AsyncStorage.getItem('session');
      if (!jsonValue) throw new Error('Inicia sesión de nuevo para cargar los animales.');
      const session = JSON.parse(jsonValue);
      if (!session?.token) throw new Error('La sesión no es válida. Inicia sesión de nuevo.');

      const result = await getAnimalsApp(
        { limit: 20, page },
        { apiUrl: uri, token: session.token },
      );
      setAnimals(reset ? result : [...animals, ...result]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los animales.');
    } finally {
      setLoading(false);
    }
  };
  const getFilteredAnimals = () => {
    let filtered = animals;
    const rankedAnimals = urgencyOnly ? getRankedAnimals(animals) : [];

    if (tipoAnimal !== 'Todos') {
      filtered = filtered.filter(
        (animal) => animal.especie?.toUpperCase() === tipoAnimal.toUpperCase(),
      );
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((animal) =>
        [animal.nombre, animal.especie, animal.raza]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query)),
      );
    }
    if (urgencyOnly) {
      const rankedIds = new Set(
        rankedAnimals.filter((animal) => isHighPriority(animal.score)).map((animal) => animal.id),
      );
      filtered = filtered.filter((animal) => rankedIds.has(animal.id));
    }
    if (urgencyOnly) {
      const rankById = new Map(rankedAnimals.map((animal, index) => [animal.id, index]));
      filtered = filtered
        .filter((animal) => rankById.has(animal.id))
        .sort((a, b) => rankById.get(a.id) - rankById.get(b.id));
    }

    return filtered;
  };
  const filteredAnimals = getFilteredAnimals();

  const loadAnimal = (navigation, filteredAnimals) => {
    if (filteredAnimals.length === 0 && !isLoading) {
      return (
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={{ color: Colors.gray, fontSize: 16 }}>No se encontraron animales con estos filtros.</Text>
        </View>
      );
    }

    return filteredAnimals.map((animal) => {
      return (
        <TouchableOpacity
          key={animal.id}
          style={{ width: '100%', alignItems: 'center' }}
          onPress={() =>
            navigation.navigate('Detalle de Animal', {
              animalId: animal.id,
              nombre: animal.nombre,
              descripcion: animal.descripcion,
              imagen: animal.imagen,
              fundacion: animal.fundacion,
              raza: animal.raza,
              especie: animal.especie,
              fundacion_id: animal.fundacion_id,
              edad: animal.edad,
              peso: animal.peso,
              fecha_nacimiento_estimada: animal.fecha_nacimiento_estimada,
              esterilizacion: animal.esterilizacion,
              vacunacion: animal.vacunacion,
              desparasitacion: animal.desparasitacion,
              enfermedades: animal.enfermedades,
              fecha_rescate: animal.fecha_rescate,
              fecha_registro: animal.fecha_registro,
              sexo: animal.sexo,
              galeria: animal.galeria,
            })
          }
        >
          <Animales
            id={animal.id}
            nombre={animal.nombre}
            descripcion={animal.descripcion}
            imagen={animal.imagen}
            fundacion={animal.fundacion}
            fundacion_id={animal.fundacion_id}
            navigation={navigation}
            onApadrinar={() =>
              navigation.navigate('AgregarAnimalManada', {
                ...animal,
                animalId: animal.id,
              })
            }
            raza={animal.raza}
            especie={animal.especie}
            isMenuManada={false}
            edad={animal.edad}
            peso={animal.peso}
            esterilizacion={animal.esterilizacion}
            vacunacion={animal.vacunacion}
            desparasitacion={animal.desparasitacion}
            enfermedades={animal.enfermedades}
            fecha_rescate={animal.fecha_rescate}
            fecha_registro={animal.fecha_registro}
            sexo={animal.sexo}
            galeria={animal.galeria}
          />
        </TouchableOpacity>
      );
    });
  };

  function cargarTodos() {
    setTipoAnimal('Todos');
  }
  function cargarPerros() {
    setTipoAnimal('Perro');
  }

  function cargarGatos() {
    setTipoAnimal('Gato');
  }

  const speciesOptions = [
    { key: 'Todos', label: 'Todos' },
    { key: 'Perro', label: 'Perros' },
    { key: 'Gato', label: 'Gatos' },
  ];

  return (
    <StyledSafeArea>
      <CustomHeader isHome={true} title="Animales" color={Colors.primary} navigation={navigation} />
      <View style={styles.speciesRow}>
        <View style={styles.speciesGroup} accessibilityLabel="Filtrar por especie">
          {speciesOptions.map((option) => {
            const active = tipoAnimal === option.key;
            const onPress = {
              Todos: cargarTodos,
              Perro: cargarPerros,
              Gato: cargarGatos,
            }[option.key];
            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.speciesButton, active && styles.speciesButtonActive]}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.speciesText, active && styles.speciesTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={[styles.urgencyButton, urgencyOnly && styles.urgencyButtonActive]}
          onPress={() => setUrgencyOnly((previous) => !previous)}
          accessibilityRole="button"
          accessibilityLabel="Filtrar por mascotas urgentes"
          accessibilityState={{ selected: urgencyOnly }}
        >
          <Feather
            name="zap"
            size={15}
            color={urgencyOnly ? Colors.greenPet : '#f59e0b'}
          />
          <Text style={[styles.urgencyText, urgencyOnly && styles.urgencyTextActive]}>Urgente</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={Colors.gray} style={{ marginLeft: 15 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, especie..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={Colors.gray}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchButton}
              accessibilityRole="button"
              accessibilityLabel="Borrar búsqueda"
            >
              <Feather name="x" size={16} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.resultsSummary}>
        <Text style={styles.resultsText}>
          Mostrando <Text style={styles.resultsCount}>{filteredAnimals.length}</Text> mascotas
          {urgencyOnly ? ' (solo casos prioritarios)' : ''}
        </Text>
      </View>
      <StyledScrollContainer contentContainerStyle={{ paddingBottom: 20 }}>
        <InnerContainer>
          <StatusBar style="dark" />
          {/* <PageTitle>LEOPET</PageTitle>
          <TextInfo>En esta sección encontrarás a los animales que están registrados por diversas Fundaciones</TextInfo> */}

          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.greenPet} style={{ marginTop: 20 }} />
          ) : error ? (
            <View style={{ marginTop: 30, alignItems: 'center' }}>
              <Text style={{ color: Colors.red, textAlign: 'center' }}>{error}</Text>
              <TouchableOpacity style={styles.filterSubmitButton} onPress={() => loadAnimals(0, true)}>
                <Text style={styles.filterSubmitText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            loadAnimal(navigation, filteredAnimals)
          )}
          {/* {isTipoAnimal ? <ActivityIndicator size="large" color={Colors.darklight} /> : loadTipoAnimal(navigation,especieAnimal)} */}
          {/*  <StyledButtonMedio onPress={logout}>
            <ButtonText>Logout</ButtonText>
          </StyledButtonMedio> */}
        </InnerContainer>
      </StyledScrollContainer>
    </StyledSafeArea >
  );
};

const styles = StyleSheet.create({
  speciesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  speciesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#eef0f0',
    borderRadius: 24,
  },
  speciesButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  speciesButtonActive: {
    backgroundColor: Colors.tertiary,
    elevation: 2,
  },
  speciesText: {
    color: Colors.tertiary,
    fontSize: 13,
    fontWeight: '600',
  },
  speciesTextActive: {
    color: Colors.primary,
  },
  urgencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 22,
    backgroundColor: Colors.primary,
  },
  urgencyButtonActive: {
    backgroundColor: Colors.tertiary,
    borderColor: Colors.greenPet,
  },
  urgencyText: {
    color: Colors.tertiary,
    fontSize: 12,
    fontWeight: '600',
  },
  urgencyTextActive: {
    color: Colors.greenPet,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 18,
    height: 45,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    color: Colors.tertiary,
  },
  clearSearchButton: {
    padding: 8,
  },
  resultsSummary: {
    marginHorizontal: 18,
    marginBottom: 4,
  },
  resultsText: {
    color: Colors.gray,
    fontSize: 12,
  },
  resultsCount: {
    color: Colors.tertiary,
    fontWeight: 'bold',
  },
  filterSubmitButton: {
    backgroundColor: Colors.greenPet,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    width: 100,
  },
  filterSubmitText: {
    color: Colors.tertiary,
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
});

export default Home;
