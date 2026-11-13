import { useState } from 'react';
import { Card } from '@rneui/themed';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { Colors } from '../StyledComponents/styles';
import VentanaConfirmacion from '../../screens/VentanaConfirmacion';
import { getAnimalImageUri } from '../../utils/animalImage';

const Animales = (props) => {
  const [visible, setVisible] = useState(false);

  const {
    id,
    nombre,
    onPress,
    onApadrinar,
    fundacion,
    raza,
    especie,
    fundacion_id,
    isMenuManada,
    eliminarAnimalManada,
  } = props;

  const mostarVentanaConfirmacion = () => {
    setVisible(true);
  };

  const cancelarEliminacion = () => {
    setVisible(false);
  };

  const aceptarEliminacion = () => {
    setVisible(false);
    eliminarAnimalManada(id);
  };
  const imageUri = getAnimalImageUri(props);
  const fundacionNombre =
    typeof fundacion === 'string'
      ? fundacion
      : fundacion?.nombre || (fundacion_id ? `Fundación #${fundacion_id}` : 'No disponible');

  const confirmation = (
    <VentanaConfirmacion
      visible={visible}
      titulo="Eliminar Animal"
      descripcion="¿Está seguro de que desea eliminar el animal?"
      cancelar={cancelarEliminacion}
      aceptar={aceptarEliminacion}
    />
  );

  if (isMenuManada) {
    return (
      <>
        <View style={styles.manadaCardContainer}>
          <TouchableOpacity
            style={styles.manadaContent}
            onPress={onPress}
            activeOpacity={0.85}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.manadaImage} resizeMode="cover" />
            ) : (
              <View style={styles.manadaImagePlaceholder}>
                <Ionicons name="paw" size={30} color={Colors.greenPet} />
              </View>
            )}
            <View style={styles.manadaDetails}>
              <Text style={styles.manadaName} numberOfLines={1}>
                {nombre || 'Animal sin nombre'}
              </Text>
              <Text style={styles.manadaDetail} numberOfLines={1}>
                Especie: {especie || 'No disponible'}
              </Text>
              <Text style={styles.manadaDetail} numberOfLines={1}>
                Raza: {raza || 'No disponible'}
              </Text>
              <Text style={styles.manadaDetail} numberOfLines={1}>
                Fundación: {fundacionNombre}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.greenPet} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={mostarVentanaConfirmacion}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar a ${nombre || 'este animal'} de la manada`}
          >
            <Octicons name="x" size={20} color={Colors.red} />
          </TouchableOpacity>
        </View>
        {visible ? confirmation : null}
      </>
    );
  }

  return (
    <>
      <Card containerStyle={styles.cardContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="paw" size={36} color={Colors.greenPet} />
            </View>
          )}
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Ionicons name="paw" size={18} color={Colors.greenPet} style={{ marginRight: 5 }} />
              <Text style={styles.nombre}>{nombre}</Text>
              {fundacion_id == 3 && (
                <Image source={require('../../assets/icons/leohuella1.png')} style={styles.huellaIcon} />
              )}
            </View>

            <View style={styles.detailActionRow}>
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Especie: </Text>
                  <Text style={styles.detailValue}>{especie}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Raza: </Text>
                  <Text style={styles.detailValue}>{raza}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fundación: </Text>
                  <Text style={styles.detailValue}>{fundacionNombre}</Text>
                </View>
              </View>
              {onApadrinar && (
                <TouchableOpacity
                  style={styles.apadrinarButton}
                  onPress={(event) => {
                    event.stopPropagation();
                    onApadrinar(props);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Apadrinar a ${nombre || 'este animal'}`}
                >
                  <Ionicons name="heart" size={18} color={Colors.greenPet} />
                  <Text style={styles.apadrinarButtonText}>Apadrinar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
      </Card>
      {visible ? confirmation : null}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    borderRadius: 15,
    elevation: 4,
    marginVertical: 10,
    overflow: 'hidden',
    borderWidth: 0,
    backgroundColor: Colors.primary,
    width: '92%',
    alignSelf: 'center',
  },
  manadaCardContainer: {
    minHeight: 128,
    padding: 10,
    borderRadius: 15,
    elevation: 3,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.primary,
    width: '92%',
    alignSelf: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
  },
  manadaContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 104,
    paddingRight: 24,
  },
  manadaImage: {
    width: 104,
    height: 104,
    borderRadius: 11,
    backgroundColor: Colors.secondary,
  },
  manadaImagePlaceholder: {
    width: 104,
    height: 104,
    borderRadius: 11,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manadaDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  manadaName: {
    color: Colors.tertiary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  manadaDetail: {
    color: Colors.gray,
    fontSize: 12,
    lineHeight: 17,
  },
  contentContainer: {
    padding: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.tertiary,
  },
  huellaIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  detailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  detailActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: Colors.gray,
  },
  apadrinarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: 110,
    minHeight: 52,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: Colors.tertiary,
  },
  apadrinarButtonText: {
    color: Colors.greenPet,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default Animales;
