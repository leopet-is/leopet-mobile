import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/Headers/CustomHeader';
import ManadaConfirmacion from '../components/ManadaConfirmacion';
import { Colors, StyledSafeArea } from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';
import { getAnimalsCatalog } from '../services/Animals';
import { agregarAnimalesManada } from '../services/Manada';
import { getFundacion } from '../services/Fundacion';

const SPECIES = ['TODOS', 'PERRO', 'GATO', 'OTRO'];
const PAGE_LIMIT = 100;

const animalFoundationId = (animal) =>
  animal.fundacion_id ?? animal.fundacionId ?? animal.fundacion?.id;

const foundationName = (animal, foundations) => {
  if (typeof animal.fundacion === 'string') return animal.fundacion;
  if (animal.fundacion?.nombre) return animal.fundacion.nombre;
  const foundation = foundations.find(
    (item) => String(item.id) === String(animalFoundationId(animal)),
  );
  return foundation?.nombre || 'Fundación no disponible';
};

const requestErrorMessage = (error) =>
  error instanceof Error ? error.message : 'No se pudo completar la solicitud. Inténtalo de nuevo.';

const AgregarMiembrosManada = ({ route, navigation }) => {
  const {
    mode = 'create',
    manadaId,
    manadaNombre,
    animalId,
    initialMemberIds = [],
  } = route.params || {};
  const isEditSelection = mode === 'edit';

  const [apiOptions, setApiOptions] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [foundations, setFoundations] = useState([]);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('TODOS');
  const [selectedFoundation, setSelectedFoundation] = useState('TODOS');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loadingAnimals, setLoadingAnimals] = useState(false);
  const [loadingFoundations, setLoadingFoundations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [foundationsError, setFoundationsError] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const autoSelectedAnimal = useRef(false);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const sessionValue = await AsyncStorage.getItem('session');
        const session = sessionValue ? JSON.parse(sessionValue) : null;
        if (!session?.token) {
          throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
        }
        if (active) {
          setApiOptions({
            apiUrl: GLOBALCONFIG.EndpointBackHost,
            token: session.token,
          });
        }
      } catch (sessionError) {
        if (active) setError(requestErrorMessage(sessionError));
      }
    };

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!apiOptions) return undefined;
    let active = true;

    const loadFoundations = async () => {
      setLoadingFoundations(true);
      setFoundationsError('');
      try {
        const result = [];
        let page = 0;
        let pageResult;
        do {
          pageResult = await getFundacion(
            { q: null, page, limit: PAGE_LIMIT },
            apiOptions,
          );
          result.push(...pageResult);
          page += 1;
        } while (pageResult.length === PAGE_LIMIT);

        if (active) setFoundations(result);
      } catch (foundationError) {
        if (active) setFoundationsError(requestErrorMessage(foundationError));
      } finally {
        if (active) setLoadingFoundations(false);
      }
    };

    loadFoundations();
    return () => {
      active = false;
    };
  }, [apiOptions]);

  useEffect(() => {
    if (!apiOptions) return undefined;
    let active = true;

    const loadAnimals = async () => {
      setLoadingAnimals(true);
      setError('');
      try {
        const result = await getAnimalsCatalog(
          {
            especie: selectedSpecies,
            fundacionId: selectedFoundation === 'TODOS' ? null : selectedFoundation,
          },
          apiOptions,
        );
        if (active) setAnimals(result);
      } catch (animalsError) {
        if (active) setError(requestErrorMessage(animalsError));
      } finally {
        if (active) setLoadingAnimals(false);
      }
    };

    loadAnimals();
    return () => {
      active = false;
    };
  }, [apiOptions, selectedFoundation, selectedSpecies]);

  useEffect(() => {
    if (isEditSelection || animalId == null || autoSelectedAnimal.current) return;
    const animal = animals.find((item) => String(item.id) === String(animalId));
    if (animal) {
      autoSelectedAnimal.current = true;
      setSelectedAnimals((current) =>
        current.some((item) => String(item.id) === String(animal.id))
          ? current
          : [...current, animal],
      );
    }
  }, [animalId, animals, isEditSelection]);

  const excludedIds = useMemo(
    () => new Set(initialMemberIds.map(String)),
    [initialMemberIds],
  );

  const filteredAnimals = useMemo(
    () =>
      animals.filter((animal) => {
        const foundationMatches =
          selectedFoundation === 'TODOS' ||
          String(animalFoundationId(animal)) === selectedFoundation;
        const speciesMatches =
          selectedSpecies === 'TODOS' ||
          String(animal.especie || '').toUpperCase() === selectedSpecies;
        const searchMatches =
          !debouncedSearch ||
          String(animal.nombre || '').toLocaleLowerCase().includes(debouncedSearch.toLocaleLowerCase());
        return (
          foundationMatches &&
          speciesMatches &&
          searchMatches &&
          !excludedIds.has(String(animal.id))
        );
      }),
    [animals, debouncedSearch, excludedIds, selectedFoundation, selectedSpecies],
  );

  const toggleAnimal = (animal) => {
    setSelectedAnimals((current) =>
      current.some((item) => String(item.id) === String(animal.id))
        ? current.filter((item) => String(item.id) !== String(animal.id))
        : [...current, animal],
    );
  };

  const confirmSelection = async () => {
    setError('');
    setSaveError('');
    if (isEditSelection) {
      setConfirmationVisible(false);
      navigation.navigate('EditarManada', {
        id_manada: route.params?.id_manada ?? manadaId,
        manadaId,
        nombre: manadaNombre,
        monto: route.params?.manadaMonto,
        draftAddedAnimals: selectedAnimals,
      });
      return;
    }

    if (manadaId == null) {
      setConfirmationVisible(false);
      setError('No se encontró la manada creada. Vuelve a la lista e inténtalo nuevamente.');
      return;
    }

    setSaving(true);
    try {
      await agregarAnimalesManada(
        {
          manadaId,
          animalIds: selectedAnimals.map((animal) => animal.id),
        },
        apiOptions,
      );
      setConfirmationVisible(false);
      if (route.params?.origin === 'animalDetail') {
        Alert.alert(
          'Animal agregado',
          'Los animales seleccionados se agregaron a la nueva manada.',
          [{ text: 'Continuar', onPress: () => navigation.pop(3) }],
        );
      } else {
        navigation.pop(2);
      }
    } catch (saveError) {
      setConfirmationVisible(false);
      setSaveError(
        `La manada se creó, pero no se pudieron agregar los animales. ${requestErrorMessage(saveError)}`,
      );
    } finally {
      setSaving(false);
    }
  };

  const renderAnimal = ({ item }) => {
    const isSelected = selectedAnimals.some(
      (animal) => String(animal.id) === String(item.id),
    );

    return (
      <TouchableOpacity
        style={[styles.animalCard, isSelected && styles.animalCardSelected]}
        onPress={() => toggleAnimal(item)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
      >
        {item.imagen ? (
          <Image source={{ uri: item.imagen }} style={styles.animalImage} />
        ) : (
          <View style={styles.animalPlaceholder}>
            <Ionicons name="paw" size={25} color={Colors.greenPet} />
          </View>
        )}
        <View style={styles.animalDetails}>
          <Text style={styles.animalName}>{item.nombre || 'Animal sin nombre'}</Text>
          <Text style={styles.animalMeta}>
            {item.especie || 'Especie no disponible'} · {foundationName(item, foundations)}
          </Text>
        </View>
        <Ionicons
          name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
          size={25}
          color={isSelected ? Colors.greenPet : Colors.darklight}
        />
      </TouchableOpacity>
    );
  };

  const header = (
    <View style={styles.listHeader}>
      <Text style={styles.title}>
        {isEditSelection ? 'Agregar integrantes' : 'Elige los animales'}
      </Text>
      {manadaNombre ? <Text style={styles.subtitle}>Manada: {manadaNombre}</Text> : null}
      <Text style={styles.description}>
        Busca animales y filtra la lista por especie o fundación.
      </Text>
      {!isEditSelection ? (
        <Text style={styles.saveNotice}>
          La manada ya está creada. Si sales antes de agregar animales, quedará vacía.
        </Text>
      ) : null}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar por nombre"
        placeholderTextColor={Colors.gray}
        style={styles.searchInput}
        returnKeyType="search"
      />

      <Text style={styles.filterLabel}>Especie</Text>
      <View style={styles.chipRow}>
        {SPECIES.map((species) => (
          <TouchableOpacity
            key={species}
            style={[styles.chip, selectedSpecies === species && styles.chipSelected]}
            onPress={() => setSelectedSpecies(species)}
          >
            <Text style={[styles.chipText, selectedSpecies === species && styles.chipTextSelected]}>
              {species === 'TODOS' ? 'Todas' : species}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.filterLabel}>Fundación</Text>
      {loadingFoundations ? (
        <ActivityIndicator color={Colors.greenPet} style={styles.foundationLoader} />
      ) : (
        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[styles.chip, selectedFoundation === 'TODOS' && styles.chipSelected]}
            onPress={() => setSelectedFoundation('TODOS')}
          >
            <Text style={[styles.chipText, selectedFoundation === 'TODOS' && styles.chipTextSelected]}>
              Todas
            </Text>
          </TouchableOpacity>
          {foundations.map((foundation) => (
            <TouchableOpacity
              key={foundation.id}
              style={[
                styles.chip,
                selectedFoundation === String(foundation.id) && styles.chipSelected,
              ]}
              onPress={() => setSelectedFoundation(String(foundation.id))}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedFoundation === String(foundation.id) && styles.chipTextSelected,
                ]}
                numberOfLines={1}
              >
                {foundation.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {foundationsError ? (
        <Text style={styles.errorText}>No se pudieron cargar las fundaciones: {foundationsError}</Text>
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}
      <Text style={styles.selectedCount}>
        Seleccionados: {selectedAnimals.length}
      </Text>
    </View>
  );

  return (
    <StyledSafeArea style={styles.container}>
      <CustomHeader
        title={isEditSelection ? 'Editar Manada' : 'Crear Manada'}
        color={Colors.greenPet}
        navigation={navigation}
      />
      <FlatList
        data={filteredAnimals}
        renderItem={renderAnimal}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={header}
        ListEmptyComponent={
          loadingAnimals ? null : (
            <Text style={styles.emptyText}>No se encontraron animales con esos filtros.</Text>
          )
        }
        ListFooterComponent={loadingAnimals ? <ActivityIndicator color={Colors.greenPet} /> : null}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, (!selectedAnimals.length || saving) && styles.disabledButton]}
          onPress={() => setConfirmationVisible(true)}
          disabled={!selectedAnimals.length || saving}
        >
          <Text style={styles.submitButtonText}>
            {isEditSelection ? 'Usar selección' : 'Agregar animales'}
          </Text>
        </TouchableOpacity>
      </View>

      <ManadaConfirmacion
        visible={confirmationVisible}
        titulo={isEditSelection ? 'Confirmar selección' : 'Confirmar animales'}
        descripcion={
          isEditSelection
            ? 'Estos animales se agregarán al borrador de cambios de la manada.'
            : 'Confirma los animales que quieres agregar a tu manada.'
        }
        animales={selectedAnimals}
        textoConfirmar={isEditSelection ? 'Continuar' : 'Agregar animales'}
        cargando={saving}
        cancelar={() => setConfirmationVisible(false)}
        aceptar={confirmSelection}
      />
    </StyledSafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
  },
  listContent: {
    paddingBottom: 10,
  },
  listHeader: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  title: {
    color: Colors.tertiary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.gray,
    fontSize: 15,
    marginTop: 4,
  },
  description: {
    color: Colors.gray,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 14,
  },
  saveNotice: {
    color: Colors.tertiary,
    backgroundColor: Colors.cyanSoft,
    borderRadius: 10,
    fontSize: 13,
    lineHeight: 18,
    padding: 10,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    color: Colors.tertiary,
    fontSize: 15,
    paddingHorizontal: 14,
    height: 48,
  },
  filterLabel: {
    color: Colors.tertiary,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 7,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    maxWidth: 180,
    backgroundColor: Colors.primary,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 7,
    marginBottom: 7,
  },
  chipSelected: {
    backgroundColor: Colors.cyanSoft,
    borderColor: Colors.greenPet,
  },
  chipText: {
    color: Colors.gray,
    fontSize: 12,
  },
  chipTextSelected: {
    color: Colors.tertiary,
    fontWeight: 'bold',
  },
  foundationLoader: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  selectedCount: {
    color: Colors.tertiary,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 6,
  },
  errorText: {
    color: Colors.red,
    fontSize: 13,
    marginTop: 8,
  },
  animalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 5,
  },
  animalCardSelected: {
    borderColor: Colors.greenPet,
    backgroundColor: Colors.cyanSoft,
  },
  animalImage: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
  },
  animalPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalDetails: {
    flex: 1,
    marginHorizontal: 12,
  },
  animalName: {
    color: Colors.tertiary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  animalMeta: {
    color: Colors.gray,
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 14,
    textAlign: 'center',
    margin: 24,
  },
  footer: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    backgroundColor: Colors.greenPet,
    borderRadius: 12,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AgregarMiembrosManada;
