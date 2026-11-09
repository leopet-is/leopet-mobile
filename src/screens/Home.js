import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/Headers/CustomHeader';
import Animales from '../components/Cards/CardAnimal';
import { ActivityIndicator, TouchableOpacity, Text, View, StyleSheet, TextInput } from 'react-native';
import { CheckBox } from '@rneui/themed';

// Servicios
// Iconos
import { Feather } from '@expo/vector-icons';
import { getAnimalsApp } from '../services/Animals';

import {
  StyledSafeArea,
  InnerContainer,
  StyledScrollContainer,
  Colors,
  ViewFiltro,
  ViewFiltroButton,
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

  // Health Filters
  const [noVacunado, setNoVacunado] = useState(false);
  const [noEsterilizado, setNoEsterilizado] = useState(false);
  const [noDesparasitado, setNoDesparasitado] = useState(false);
  const [conEnfermedades, setConEnfermedades] = useState(false);
  const [showHealthFilters, setShowHealthFilters] = useState(false);

  // Cargar animales al renderizar el componente
  useEffect(() => {
    return navigation.addListener('focus', () => {
      loadAnimals(0, true);
    });
  }, [navigation]);

  const handleSearch = setSearchQuery;

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
      const hasHealthData = result.some((animal) =>
        ['vacunacion', 'esterilizacion', 'desparasitacion', 'enfermedades'].some(
          (field) => animal[field] !== undefined && animal[field] !== null,
        ),
      );
      if (reset && !hasHealthData) {
        setNoVacunado(false);
        setNoEsterilizado(false);
        setNoDesparasitado(false);
        setConEnfermedades(false);
      }
      setAnimals(reset ? result : [...animals, ...result]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los animales.');
    } finally {
      setLoading(false);
    }
  };
  const getFilteredAnimals = () => {
    let filtered = animals;

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
    if (noVacunado) {
      filtered = filtered.filter((animal) => animal.vacunacion === false);
    }
    if (noEsterilizado) {
      filtered = filtered.filter((animal) => animal.esterilizacion === false);
    }
    if (noDesparasitado) {
      filtered = filtered.filter((animal) => animal.desparasitacion === false);
    }
    if (conEnfermedades) {
      filtered = filtered.filter((animal) => {
        const diseases = animal.enfermedades?.trim();
        return diseases && !['ninguna', 'ninguno', 'no'].includes(diseases.toLowerCase());
      });
    }

    return filtered;
  };

  const loadAnimal = (navigation) => {
    const filteredAnimals = getFilteredAnimals();

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

  return (
    <StyledSafeArea>
      <CustomHeader isHome={true} title="Animales" color={Colors.primary} navigation={navigation} />
      <ViewFiltro>
        <ViewFiltroButton>
          <TouchableOpacity
            style={tipoAnimal === 'Todos' ? styles.filtroButtonPresionado : styles.filtroButton}
            onPress={cargarTodos}
          >
            <Text style={tipoAnimal === 'Todos' ? styles.filtroTextButtonPresionado : styles.filtroTextButton}>
              Todos
            </Text>
          </TouchableOpacity>
        </ViewFiltroButton>
        <ViewFiltroButton>
          <TouchableOpacity
            style={tipoAnimal === 'Perro' ? styles.filtroButtonPresionado : styles.filtroButton}
            onPress={cargarPerros}
          >
            <Text style={tipoAnimal == 'Perro' ? styles.filtroTextButtonPresionado : styles.filtroTextButton}>
              Perro
            </Text>
          </TouchableOpacity>
        </ViewFiltroButton>
        <ViewFiltroButton>
          <TouchableOpacity
            style={tipoAnimal === 'Gato' ? styles.filtroButtonPresionado : styles.filtroButton}
            onPress={cargarGatos}
          >
            <Text style={tipoAnimal == 'Gato' ? styles.filtroTextButtonPresionado : styles.filtroTextButton}>
              Gato
            </Text>
          </TouchableOpacity>
        </ViewFiltroButton>
      </ViewFiltro>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.gray} style={{ marginLeft: 15 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, especie..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={Colors.gray}
        />
        <TouchableOpacity
          style={{ paddingHorizontal: 15 }}
          onPress={() => setShowHealthFilters(!showHealthFilters)}
        >
          <Feather name="sliders" size={20} color={showHealthFilters ? Colors.greenPet : Colors.gray} />
        </TouchableOpacity>
      </View>

      {showHealthFilters && (
        <View style={styles.healthFiltersContainer}>
          <Text style={styles.healthFiltersTitle}>Filtrar por Salud</Text>
          {!animals.some((animal) =>
            ['vacunacion', 'esterilizacion', 'desparasitacion', 'enfermedades'].some(
              (field) => animal[field] !== undefined && animal[field] !== null,
            ),
          ) && (
            <Text style={styles.healthFiltersNote}>
              El listado no incluye datos de salud, por lo que estos filtros no están disponibles.
            </Text>
          )}
          <View style={styles.checkboxGrid}>
            <View style={styles.checkboxWrapper}>
              <CheckBox
                title="No Vacunados"
                checked={noVacunado}
                onPress={() => setNoVacunado(!noVacunado)}
                disabled={!animals.some((animal) => animal.vacunacion !== undefined && animal.vacunacion !== null)}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
                checkedColor={Colors.greenPet}
              />
            </View>
            <View style={styles.checkboxWrapper}>
              <CheckBox
                title="No Esterilizados"
                checked={noEsterilizado}
                onPress={() => setNoEsterilizado(!noEsterilizado)}
                disabled={!animals.some((animal) => animal.esterilizacion !== undefined && animal.esterilizacion !== null)}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
                checkedColor={Colors.greenPet}
              />
            </View>
            <View style={styles.checkboxWrapper}>
              <CheckBox
                title="No Desparasitados"
                checked={noDesparasitado}
                onPress={() => setNoDesparasitado(!noDesparasitado)}
                disabled={!animals.some((animal) => animal.desparasitacion !== undefined && animal.desparasitacion !== null)}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
                checkedColor={Colors.greenPet}
              />
            </View>
            <View style={styles.checkboxWrapper}>
              <CheckBox
                title="Con Enfermedades"
                checked={conEnfermedades}
                onPress={() => setConEnfermedades(!conEnfermedades)}
                disabled={!animals.some((animal) => animal.enfermedades !== undefined && animal.enfermedades !== null)}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
                checkedColor={Colors.greenPet}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.filterSubmitButton}
            onPress={() => setShowHealthFilters(false)}
          >
            <Feather name="filter" size={16} color={Colors.tertiary} />
            <Text style={styles.filterSubmitText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
      )}
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
            loadAnimal(navigation)
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
  filtroButton: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  filtroButtonPresionado: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: Colors.greenPet,
  },

  filtroTextButton: {
    fontWeight: 'bold',
    color: Colors.gray,
    fontSize: 16,
  },

  filtroTextButtonPresionado: {
    fontWeight: 'bold',
    color: Colors.tertiary,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 25,
    marginHorizontal: 15,
    marginBottom: 10,
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
  healthFiltersContainer: {
    backgroundColor: Colors.primary,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },
  healthFiltersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginBottom: 10,
  },
  healthFiltersNote: {
    color: Colors.gray,
    fontSize: 13,
    marginBottom: 10,
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  checkboxWrapper: {
    width: '48%',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginLeft: 0,
    marginVertical: 5,
  },
  checkboxText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: Colors.gray,
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
