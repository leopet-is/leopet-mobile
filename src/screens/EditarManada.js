import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
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
import {
  actualizarManada,
  agregarAnimalesManada,
  deleteAnimalsManadaApp,
  getAnimalesManada,
} from '../services/Manada';

const requestErrorMessage = (error) =>
  error instanceof Error ? error.message : 'No se pudo completar la solicitud. Inténtalo de nuevo.';

const EditarManada = ({ route, navigation }) => {
  const [manadaId] = useState(
    () =>
      route.params?.id_manada ??
      route.params?.manadaId ??
      route.params?.id ??
      route.params?.manada?.id,
  );
  const [routeName] = useState(route.params?.nombre || '');
  const routeAmount = route.params?.monto == null ? '' : String(route.params.monto);

  const [name, setName] = useState(routeName);
  const [amount, setAmount] = useState(routeAmount);
  const [savedName, setSavedName] = useState(routeName);
  const [savedAmount, setSavedAmount] = useState(routeAmount);
  const [members, setMembers] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [addedAnimals, setAddedAnimals] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersLoaded, setMembersLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const excludedMemberIds = useMemo(
    () => new Set(members.map((animal) => String(animal.id))),
    [members],
  );
  const removedIdSet = useMemo(() => new Set(removedIds.map(String)), [removedIds]);
  const removedAnimals = members.filter((animal) => removedIdSet.has(String(animal.id)));
  const nameChanged = name.trim() !== savedName.trim();
  const amountChanged = amount.trim() !== savedAmount.trim();
  const newAnimalsToAdd = addedAnimals.filter(
    (animal) => !excludedMemberIds.has(String(animal.id)),
  );
  const hasChanges =
    nameChanged || amountChanged || removedAnimals.length > 0 || newAnimalsToAdd.length > 0;

  useEffect(() => {
    const draftAnimals = route.params?.draftAddedAnimals;
    if (!Array.isArray(draftAnimals)) return;

    setAddedAnimals((current) => {
      const currentIds = new Set(current.map((animal) => String(animal.id)));
      return [
        ...current,
        ...draftAnimals.filter((animal) => !currentIds.has(String(animal.id))),
      ];
    });
    navigation.setParams({ draftAddedAnimals: undefined });
  }, [navigation, route.params?.draftAddedAnimals]);

  useEffect(() => {
    let active = true;

    const loadMembers = async () => {
      if (manadaId == null) {
        setError('No se encontró el identificador de la manada.');
        setLoadingMembers(false);
        return;
      }

      setLoadingMembers(true);
      setError('');
      try {
        const sessionValue = await AsyncStorage.getItem('session');
        const session = sessionValue ? JSON.parse(sessionValue) : null;
        if (!session?.token) {
          throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
        }

        const result = await getAnimalesManada(manadaId, {
          apiUrl: GLOBALCONFIG.EndpointBackHost,
          token: session.token,
        });
        if (active) {
          setMembers(result);
          setMembersLoaded(true);
        }
      } catch (loadError) {
        if (active) {
          setMembersLoaded(false);
          setError(requestErrorMessage(loadError));
        }
      } finally {
        if (active) setLoadingMembers(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadMembers);
    loadMembers();
    return () => {
      active = false;
      unsubscribe();
    };
  }, [manadaId, navigation]);

  const toggleRemoval = (animalId) => {
    setRemovedIds((current) =>
      current.some((id) => String(id) === String(animalId))
        ? current.filter((id) => String(id) !== String(animalId))
        : [...current, animalId],
    );
  };

  const openAnimalPicker = () => {
    navigation.navigate('AgregarMiembrosManada', {
      mode: 'edit',
      manadaId,
      id_manada: manadaId,
      manadaNombre: name.trim() || routeName,
      manadaMonto: amount,
      initialMemberIds: [
        ...members.map((animal) => animal.id),
        ...addedAnimals.map((animal) => animal.id),
      ],
    });
  };

  const confirmChanges = async () => {
    setConfirmationVisible(false);
    setSaving(true);
    setError('');

    let detailsWereSaved = false;
    let memberChangesStarted = false;
    let apiOptions;
    try {
      const sessionValue = await AsyncStorage.getItem('session');
      const session = sessionValue ? JSON.parse(sessionValue) : null;
      if (!session?.token) {
        throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
      }
      apiOptions = {
        apiUrl: GLOBALCONFIG.EndpointBackHost,
        token: session.token,
      };

      if (nameChanged || amountChanged) {
        await actualizarManada(
          { id: manadaId, nombre: name.trim(), monto: amount.trim() },
          apiOptions,
        );
        detailsWereSaved = true;
        setSavedName(name.trim());
        setSavedAmount(amount.trim());
      }

      if (newAnimalsToAdd.length) {
        memberChangesStarted = true;
        await agregarAnimalesManada(
          {
            manadaId,
            animalIds: newAnimalsToAdd.map((animal) => animal.id),
          },
          apiOptions,
        );
      }

      for (const animal of removedAnimals) {
        memberChangesStarted = true;
        await deleteAnimalsManadaApp(
          { manadaId, animalId: animal.id },
          apiOptions,
        );
      }

      navigation.goBack();
    } catch (saveError) {
      let refreshError = '';
      if (apiOptions && memberChangesStarted) {
        try {
          const currentMembers = await getAnimalesManada(manadaId, apiOptions);
          setMembers(currentMembers);
          setRemovedIds([]);
          setAddedAnimals([]);
        } catch (memberError) {
          setMembersLoaded(false);
          refreshError = ` No se pudo actualizar la lista de integrantes: ${requestErrorMessage(memberError)}`;
        }
      }
      if (detailsWereSaved) {
        setSavedName(name.trim());
        setSavedAmount(amount.trim());
      }
      const partialMessage = memberChangesStarted
        ? 'No se completaron todos los cambios; algunos podrían haberse aplicado.'
        : 'No se pudo actualizar la información de la manada.';
      setError(`${partialMessage} ${requestErrorMessage(saveError)}${refreshError}`);
    } finally {
      setSaving(false);
    }
  };

  const saveChanges = () => {
    setError('');
    if (!name.trim()) {
      setError('Ingresa el nombre de la manada.');
      return;
    }
    if (!amount.trim() || !Number.isFinite(Number(amount)) || Number(amount) < 5) {
      setError('Ingresa un monto válido de al menos $5.');
      return;
    }
    if (!hasChanges) {
      setError('No hay cambios para guardar.');
      return;
    }
    setConfirmationVisible(true);
  };

  const confirmationAnimals = [
    ...newAnimalsToAdd.map((animal) => ({ ...animal, accion: 'Se agregará a la manada' })),
    ...removedAnimals.map((animal) => ({ ...animal, accion: 'Se quitará de la manada' })),
  ];
  const confirmationSummary = [
    nameChanged ? `Nombre: ${savedName} → ${name.trim()}` : null,
    amountChanged ? `Monto mensual: $${savedAmount} → $${amount.trim()}` : null,
    newAnimalsToAdd.length ? `Animales que se agregarán: ${newAnimalsToAdd.length}` : null,
    removedAnimals.length ? `Animales que se quitarán: ${removedAnimals.length}` : null,
  ].filter(Boolean);

  const renderAnimal = (animal, isRemoved = false, isNew = false) => (
    <View
      key={`${isNew ? 'new' : 'current'}-${animal.id}`}
      style={[styles.animalRow, isRemoved && styles.animalRowRemoved]}
    >
      {animal.imagen ? (
        <Image source={{ uri: animal.imagen }} style={styles.animalImage} />
      ) : (
        <View style={styles.animalPlaceholder}>
          <Ionicons name="paw" size={23} color={Colors.greenPet} />
        </View>
      )}
      <View style={styles.animalDetails}>
        <Text style={styles.animalName}>{animal.nombre || 'Animal sin nombre'}</Text>
        <Text style={styles.animalMeta}>
          {animal.especie || 'Especie no disponible'}
          {isRemoved ? ' · Se quitará' : isNew ? ' · Nuevo integrante' : ''}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.memberAction}
        onPress={() =>
          isNew
            ? setAddedAnimals((current) =>
                current.filter((item) => String(item.id) !== String(animal.id)),
              )
            : toggleRemoval(animal.id)
        }
        accessibilityLabel={isRemoved ? 'Conservar animal' : 'Quitar animal'}
      >
        <Ionicons
          name={isRemoved ? 'refresh' : 'close-circle'}
          size={24}
          color={isRemoved ? Colors.greenPet : Colors.red}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <StyledSafeArea style={styles.container}>
      <CustomHeader title="Editar Manada" color={Colors.greenPet} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Datos de la manada</Text>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={name}
          onChangeText={(value) => {
            setName(value);
            setError('');
          }}
          placeholder="Nombre de la manada"
          placeholderTextColor={Colors.gray}
          style={styles.input}
        />
        <Text style={styles.label}>Monto mensual</Text>
        <TextInput
          value={amount}
          onChangeText={(value) => {
            setAmount(value);
            setError('');
          }}
          placeholder="Monto mensual"
          placeholderTextColor={Colors.gray}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <View style={styles.membersHeader}>
          <Text style={styles.sectionTitle}>Integrantes</Text>
          <TouchableOpacity
            style={[styles.addButton, (!membersLoaded || loadingMembers) && styles.disabledButton]}
            onPress={openAnimalPicker}
            disabled={!membersLoaded || loadingMembers}
          >
            <Ionicons name="add" size={19} color={Colors.primary} />
            <Text style={styles.addButtonText}>Agregar animales</Text>
          </TouchableOpacity>
        </View>

        {loadingMembers ? (
          <ActivityIndicator size="large" color={Colors.greenPet} style={styles.loader} />
        ) : members.length ? (
          members.map((animal) =>
            renderAnimal(animal, removedIdSet.has(String(animal.id))),
          )
        ) : membersLoaded ? (
          <Text style={styles.emptyText}>Esta manada todavía no tiene integrantes.</Text>
        ) : null}

        {addedAnimals.length ? (
          <>
            <Text style={styles.sectionTitle}>Nuevos integrantes</Text>
            {addedAnimals.map((animal) => renderAnimal(animal, false, true))}
          </>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.saveButton, (!hasChanges || saving) && styles.disabledButton]}
          onPress={saveChanges}
          disabled={!hasChanges || saving || loadingMembers || !membersLoaded}
        >
          {saving ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <ManadaConfirmacion
        visible={confirmationVisible}
        titulo="Confirmar cambios"
        descripcion="Revisa los datos y los integrantes antes de actualizar la manada."
        resumen={confirmationSummary}
        animales={confirmationAnimals}
        textoConfirmar="Guardar cambios"
        cargando={saving}
        cancelar={() => setConfirmationVisible(false)}
        aceptar={confirmChanges}
      />
    </StyledSafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 28,
  },
  title: {
    color: Colors.tertiary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    color: Colors.tertiary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    color: Colors.tertiary,
    fontSize: 16,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 14,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    color: Colors.tertiary,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greenPet,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  addButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 24,
  },
  animalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 13,
    padding: 9,
    marginVertical: 5,
  },
  animalRowRemoved: {
    backgroundColor: Colors.pinkLow,
    opacity: 0.75,
  },
  animalImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
  },
  animalPlaceholder: {
    width: 52,
    height: 52,
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
    marginTop: 4,
  },
  memberAction: {
    padding: 5,
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 18,
  },
  errorText: {
    color: Colors.red,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: Colors.greenPet,
    borderRadius: 12,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditarManada;
