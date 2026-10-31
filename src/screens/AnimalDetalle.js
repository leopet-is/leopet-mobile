import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import CustomHeader from '../components/Headers/CustomHeader';
import { Ionicons } from '@expo/vector-icons';

import {
  StyledSafeArea,
  StyledScrollContainer,
  InnerContainer,
  Colors,
} from '../components/StyledComponents/styles';

const AnimalDetalle = ({ route, navigation }) => {
  const {
    animalId,
    nombre,
    especie,
    raza,
    descripcion,
    imagen,
    fundacion,
    fundacion_id,
    fecha_nacimiento_estimada,
    peso,
    esterilizacion,
    vacunacion,
    desparasitacion,
    enfermedades,
    fecha_rescate,
    sexo,
    galeria,
  } = route.params;
  const edad = getAge(fecha_nacimiento_estimada);

  return (
    <StyledSafeArea style={{ backgroundColor: Colors.primary }}>
      <CustomHeader isHome={false} title="Detalle" navigation={navigation} />

      <StyledScrollContainer contentContainerStyle={{ paddingBottom: 40 }}>
        <StatusBar style="dark" />

        {/* Animal Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: (galeria && galeria.fotos && galeria.fotos[0]) || imagen }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        <InnerContainer style={{ paddingHorizontal: 20 }}>
          <View style={styles.headerInfo}>
            <Text style={styles.animalName}>{nombre}</Text>
            <TouchableOpacity
              style={styles.adoptButton}
              onPress={() => navigation.navigate('Agregar A Manada', { animalId, nombre, descripcion, imagen, fundacion, raza, especie, galeria })}
            >
              <Text style={styles.adoptButtonText}>Apadrinar</Text>
            </TouchableOpacity>
          </View>

          {/* Info Sections */}
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.greenPet} />
            <Text style={styles.sectionTitle}>Información General</Text>
          </View>

          <View style={styles.infoGrid}>
            <InfoItem label="Especie" value={especie} />
            <InfoItem label="Raza" value={raza} />
            <InfoItem label="Edad" value={edad} />
            <InfoItem label="Sexo" value={getSexLabel(sexo)} />
            <InfoItem
              label="Fundación"
              value={fundacion || (fundacion_id ? `Fundación #${fundacion_id}` : 'No disponible')}
            />
            <InfoItem label="Peso" value={peso ? `${peso} Kg` : 'No disponible'} />
          </View>

          <View style={styles.sectionHeader}>
            <Ionicons name="medkit-outline" size={24} color={Colors.greenPet} />
            <Text style={styles.sectionTitle}>Salud y Estado</Text>
          </View>

          <View style={styles.infoGrid}>
            <StatusItem label="Esterilizado" status={esterilizacion} />
            <StatusItem label="Vacunado" status={vacunacion} />
            <StatusItem label="Desparasitado" status={desparasitacion} />
          </View>

          {enfermedades && (
            <View style={styles.historyBox}>
              <Text style={styles.boxLabel}>Enfermedades:</Text>
              <Text style={styles.boxText}>{enfermedades}</Text>
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Ionicons name="book-outline" size={24} color={Colors.greenPet} />
            <Text style={styles.sectionTitle}>Historia</Text>
          </View>

          <View style={styles.historyBox}>
            <Text style={styles.boxLabel}>Rescatado el:</Text>
            <Text style={styles.boxText}>{fecha_rescate || 'No disponible'}</Text>
            <Text style={[styles.boxLabel, { marginTop: 10 }]}>Descripción:</Text>
            <Text style={styles.boxText}>{descripcion}</Text>
          </View>

        </InnerContainer>
      </StyledScrollContainer>
    </StyledSafeArea>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const getAge = (birthDate) => {
  if (!birthDate) return 'No disponible';
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return 'No disponible';

  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) years -= 1;

  return `${years} ${years === 1 ? 'año' : 'años'}`;
};

const getSexLabel = (sex) => {
  if (sex === 'MACHO' || sex === 1 || sex === '1') return 'Macho';
  if (sex === 'HEMBRA' || sex === 2 || sex === '2') return 'Hembra';
  return 'No disponible';
};

const StatusItem = ({ label, status }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor:
            status === true || status === 1
              ? '#D1FAE5'
              : status === false || status === 0
                ? '#FEE2E2'
                : '#E5E7EB',
        },
      ]}
    >
      <Text
        style={{
          color:
            status === true || status === 1
              ? '#065F46'
              : status === false || status === 0
                ? '#991B1B'
                : Colors.gray,
          fontSize: 12,
          fontWeight: 'bold',
        }}
      >
        {status === true || status === 1
          ? '✓ Sí'
          : status === false || status === 0
            ? '✗ No'
            : 'No disponible'}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E7EB',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  animalName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.tertiary,
  },
  adoptButton: {
    backgroundColor: Colors.greenPet,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  adoptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginLeft: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.tertiary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 2,
  },
  historyBox: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  boxLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.gray,
  },
  boxText: {
    fontSize: 15,
    color: Colors.tertiary,
    lineHeight: 22,
  },
});

export default AnimalDetalle;
