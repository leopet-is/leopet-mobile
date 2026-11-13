import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';

import { createManada, actualizarManada } from '../services/Manada';
import CustomHeader from '../components/Headers/CustomHeader';
import { Colors, StyledSafeArea } from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';

const errorMessage = (error) =>
  error instanceof Error ? error.message : 'No se pudo guardar la manada. Inténtalo de nuevo.';

const CrearManada = ({ route, navigation }) => {
  const {
    isMenu,
    isEditar = false,
    id_manada,
    manadaId,
    id,
    nombre = '',
    monto = '',
    animalId,
    origin,
  } = route.params || {};
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const createNewManada = async (values) => {
    setLoading(true);
    setError('');

    try {
      const sessionValue = await AsyncStorage.getItem('session');
      const session = sessionValue ? JSON.parse(sessionValue) : null;
      if (!session?.token) {
        throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
      }

      const apiOptions = {
        apiUrl: GLOBALCONFIG.EndpointBackHost,
        token: session.token,
      };
      const manada = {
        nombre: values.nombre.trim(),
        monto: String(values.monto).trim(),
      };

      if (isEditar) {
        const idToUpdate = id_manada ?? manadaId ?? id;
        if (idToUpdate == null) {
          throw new Error('No se recibió el identificador de la manada que quieres actualizar.');
        }
        await actualizarManada({ ...manada, id: idToUpdate }, apiOptions);
        navigation.goBack();
        return;
      }

      const savedManada = await createManada(manada, apiOptions);
      const savedManadaId = savedManada.id ?? savedManada.manadaId;
      if (savedManadaId == null) {
        throw new Error('La respuesta del servidor no incluyó el identificador de la manada.');
      }

      navigation.navigate('AgregarMiembrosManada', {
        mode: 'create',
        manadaId: savedManadaId,
        manadaNombre: savedManada.nombre || manada.nombre,
        animalId,
        origin,
        isMenu,
      });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const validate = (values) => {
    if (!values.nombre.trim()) {
      setError('Ingresa el nombre de la manada.');
      return false;
    }
    if (!values.monto.trim() || !Number.isFinite(Number(values.monto))) {
      setError('Ingresa un monto válido.');
      return false;
    }
    if (Number(values.monto) < 5) {
      setError('El monto mínimo es $5.');
      return false;
    }
    return true;
  };

  return (
    <StyledSafeArea style={styles.safeArea}>
      <CustomHeader
        isHome={false}
        title={isEditar ? 'Editar Manada' : 'Crear Manada'}
        color={Colors.greenPet}
        navigation={navigation}
      />
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.introCard}>
          <View style={styles.progressRow}>
            <View style={styles.step}>
              <View style={styles.activeStepNumber}>
                <Text style={styles.activeStepText}>1</Text>
              </View>
              <Text style={styles.activeStepLabel}>Datos</Text>
            </View>
            <View style={styles.progressLine} />
            <View style={styles.step}>
              <View style={styles.inactiveStepNumber}>
                <Text style={styles.inactiveStepText}>2</Text>
              </View>
              <Text style={styles.inactiveStepLabel}>Animales</Text>
            </View>
          </View>

          <View style={styles.heroRow}>
            <View style={styles.heroIcon}>
              <Ionicons name="people" size={27} color={Colors.greenPet} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.title}>
                {isEditar ? 'Actualiza tu manada' : 'Crea una nueva manada'}
              </Text>
              <Text style={styles.subtitle}>
                {isEditar
                  ? 'Modifica los datos principales.'
                  : 'Define los datos principales para empezar.'}
              </Text>
            </View>
          </View>
        </View>

        <Formik
          initialValues={{
            nombre: nombre || '',
            monto: monto == null ? '' : String(monto),
          }}
          onSubmit={(values) => {
            if (validate(values)) createNewManada(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Información de la manada</Text>
              <ManadaInput
                label="Nombre de la manada"
                icon="paw-outline"
                placeholder="Ej. Manada Patitas Felices"
                value={values.nombre}
                onChangeText={(value) => {
                  setError('');
                  handleChange('nombre')(value);
                }}
                onBlur={handleBlur('nombre')}
                autoCapitalize="words"
                returnKeyType="next"
              />
              <ManadaInput
                label="Aporte mensual por animal"
                icon="cash-outline"
                placeholder="Ej. 10.00"
                value={values.monto}
                onChangeText={(value) => {
                  setError('');
                  handleChange('monto')(value);
                }}
                onBlur={handleBlur('monto')}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />

              <View style={styles.minimumNote}>
                <Ionicons name="information-circle-outline" size={18} color={Colors.greenPet} />
                <Text style={styles.minimumText}>El aporte mínimo es $5 mensuales.</Text>
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={18} color={Colors.red} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.nextButton, isLoading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.primary} />
                ) : (
                  <>
                    <Text style={styles.nextButtonText}>
                      {isEditar ? 'Guardar cambios' : 'Siguiente'}
                    </Text>
                    <Ionicons
                      name={isEditar ? 'checkmark' : 'arrow-forward'}
                      size={19}
                      color={Colors.primary}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        {!isEditar ? (
          <View style={styles.nextStepNote}>
            <Ionicons name="paw-outline" size={20} color={Colors.tertiary} />
            <Text style={styles.nextStepText}>
              En el siguiente paso podrás buscar, filtrar y seleccionar los animales de tu manada.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </StyledSafeArea>
  );
};

const ManadaInput = ({ label, icon, ...props }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color={Colors.greenPet} style={styles.inputIcon} />
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor={Colors.darklight}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.beige,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 30,
  },
  introCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  step: {
    alignItems: 'center',
    minWidth: 64,
  },
  activeStepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.greenPet,
  },
  inactiveStepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  activeStepText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  inactiveStepText: {
    color: Colors.gray,
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeStepLabel: {
    color: Colors.tertiary,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  inactiveStepLabel: {
    color: Colors.gray,
    fontSize: 12,
    marginTop: 5,
  },
  progressLine: {
    width: 70,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 5,
    marginBottom: 18,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.cyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    marginLeft: 13,
  },
  title: {
    color: Colors.tertiary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.gray,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    color: Colors.tertiary,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    color: Colors.tertiary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.beige,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: 13,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.tertiary,
    fontSize: 15,
    paddingVertical: 12,
  },
  minimumNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  minimumText: {
    color: Colors.gray,
    fontSize: 12,
    marginLeft: 6,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.errorSoft,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    flex: 1,
    color: Colors.red,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 7,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.greenPet,
    borderRadius: 13,
    minHeight: 52,
    marginTop: 5,
  },
  nextButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  nextStepNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cyanSoft,
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  nextStepText: {
    flex: 1,
    color: Colors.tertiary,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 10,
  },
});

export default CrearManada;
