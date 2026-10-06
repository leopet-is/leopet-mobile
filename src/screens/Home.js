import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/Headers/CustomHeader';
import Constants from 'expo-constants';
import Animales from '../components/Cards/CardAnimal';
import { ActivityIndicator, TouchableOpacity, Text, View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Divider, CheckBox } from '@rneui/themed';

// Servicios
// Iconos
import { Feather } from '@expo/vector-icons';
import { getAnimals } from '../services/Animals';

import {
  StyledSafeArea,
  InnerContainer,
  PageTitle,
  StyledScrollContainer,
  StyledButton,
  StyledButtonMedio,
  ButtonText,
  TextInfo,
  Colors,
  ExtraView,
  ViewFiltro,
  ViewFiltroButton,
} from '../components/StyledComponents/styles';
import styled from 'styled-components/native';
import { GLOBALCONFIG } from '../Config';

const Home = ({ navigation }) => {
  const uri = GLOBALCONFIG.EndpointBackHost + ':' + GLOBALCONFIG.EndpointBackPort;

  // Varibles
  const [animals, setAnimals] = useState([]);
  const [isLoading, setLoading] = useState();
  const [especieAnimal, setEspecieAnimal] = useState(null);
  const [tipoAnimal, setTipoAnimal] = useState('TODOS');

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
    const unsubscribe = navigation.addListener('focus', () => {
      loadAnimals(0, true, null, 'Todos');
    });
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('session');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    loadAnimals(0, true, null, tipoAnimal, text);
  };

  const loadAnimals = async (page, reset, cb, especie, q = null) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = await JSON.parse(jsonValue);
    if (reset) {
      setLoading(true);
    }
    return getAnimals(
      {
        limit: 20,
        selectedSpecie: especie,
        q: q || searchQuery,
        page: page,
      },
      {
        apiUrl: uri,
        token: data.token,
      },
    )
      .then((data) => {
        setAnimals(reset ? data : [...animals, ...data]);
        if (reset) {
          setLoading(false);
        }
        if (cb) {
          cb(data.length != 0);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err?.message || 'Server Error');
        setLoading(false);
      });
  };
  const getFilteredAnimals = () => {
    let filtered = animals;

    if (noVacunado) {
      filtered = filtered.filter(a => !a.vacunacion);
    }
    if (noEsterilizado) {
      filtered = filtered.filter(a => !a.esterilizacion);
    }
    if (noDesparasitado) {
      filtered = filtered.filter(a => !a.desparasitacion);
    }
    if (conEnfermedades) {
      filtered = filtered.filter(a => a.enfermedades && a.enfermedades.trim() !== '');
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
            navigation={navigation}
            raza={animal.raza}
            especie={animal.especie}
            fundacion_id={animal.fundacion_id}
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
    loadAnimals(0, true, null, 'Todos');
  }
  function cargarPerros() {
    setTipoAnimal('Perro');
    loadAnimals(0, true, null, 'Perro');
  }

  function cargarGatos() {
    setTipoAnimal('Gato');
    loadAnimals(0, true, null, 'Gato');
  }

  return (
    <StyledSafeArea>
      <CustomHeader isHome={true} title="Animales" color={Colors.primary} navigation={navigation} />
      <ViewFiltro>
        <ViewFiltroButton>
          <TouchableOpacity
            style={tipoAnimal == 'TODOS' ? styles.filtroButtonPresionado : styles.filtroButton}
            onPress={cargarTodos}
          >
            <Text style={tipoAnimal == 'TODOS' ? styles.filtroTextButtonPresionado : styles.filtroTextButton}>
              Todos
            </Text>
          </TouchableOpacity>
        </ViewFiltroButton>
        <ViewFiltroButton>
          <TouchableOpacity
            style={tipoAnimal == 'Perro' ? styles.filtroButtonPresionado : styles.filtroButton}
            onPress={cargarPerros}
          >
            <Text style={tipoAnimal == 'Perro' ? styles.filtroTextButtonPresionado : styles.filtroTextButton}>
              Perro
            </Text>
          </TouchableOpacity>
        </ViewFiltroButton>
        <ViewFiltroButton>
          <TouchableOpacity
            style={tipoAnimal == 'Gato' ? styles.filtroButtonPresionado : styles.filtroButton}
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
          <View style={styles.checkboxGrid}>
            <View style={styles.checkboxWrapper}>
              <CheckBox
                title="No Vacunados"
                checked={noVacunado}
                onPress={() => setNoVacunado(!noVacunado)}
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
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
                checkedColor={Colors.greenPet}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.filterSubmitButton}
            onPress={() => loadAnimals(0, true, null, tipoAnimal)}
          >
            <Feather name="filter" size={16} color="white" />
            <Text style={styles.filterSubmitText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
      )}
      <StyledScrollContainer contentContainerStyle={{ paddingBottom: 20 }}>
        <InnerContainer>
          <StatusBar style="dark" />
          {/* <PageTitle>LEOPET</PageTitle>
          <TextInfo>En esta sección encontrarás a los animales que están registrados por diversas Fundaciones</TextInfo> */}

          {isLoading ? <ActivityIndicator size="large" color={Colors.greenPet} style={{ marginTop: 20 }} /> : loadAnimal(navigation)}
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
    borderBottomColor: Colors.pinkPet,
  },

  filtroTextButton: {
    fontWeight: 'bold',
    color: '#6B7280',
    fontSize: 16,
  },

  filtroTextButtonPresionado: {
    fontWeight: 'bold',
    color: Colors.pinkPet,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    marginHorizontal: 15,
    marginBottom: 10,
    height: 45,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    color: Colors.tertiary,
  },
  healthFiltersContainer: {
    backgroundColor: 'white',
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
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
});

export default Home;
