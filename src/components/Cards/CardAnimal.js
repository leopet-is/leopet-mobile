import React, { useState } from 'react';
import { Card } from '@rneui/themed';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { Colors } from '../StyledComponents/styles';
import VentanaConfirmacion from '../../screens/VentanaConfirmacion';

const Animales = (props) => {
  const [visible, setVisible] = useState(false);

  const {
    id,
    nombre,
    imagen,
    fundacion,
    raza,
    especie,
    fundacion_id,
    esterilizacion,
    vacunacion,
    desparasitacion,
    enfermedades,
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

  return (
    <Card containerStyle={styles.cardContainer}>
      {isMenuManada && (
        <TouchableOpacity style={styles.deleteButton} onPress={mostarVentanaConfirmacion}>
          <Octicons name="x" size={20} color={Colors.red} />
        </TouchableOpacity>
      )}

      {!imagen ? (
        <View style={styles.imagePlaceholder}>
          <ActivityIndicator size="large" color={Colors.greenPet} />
        </View>
      ) : (
        <Image
          source={{ uri: imagen }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Ionicons name="paw" size={18} color={Colors.greenPet} style={{ marginRight: 5 }} />
          <Text style={styles.nombre}>{nombre}</Text>
          {fundacion_id == 3 && (
            <Image source={require('../../assets/icons/leohuella1.png')} style={styles.huellaIcon} />
          )}
        </View>

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
            <Text style={styles.detailValue}>{fundacion}</Text>
          </View>
        </View>

        <View style={styles.badgeContainer}>
          {!vacunacion && (
            <View style={[styles.badge, styles.badgeRed]}>
              <Text style={styles.badgeTextRed}>X No Vacunado</Text>
            </View>
          )}
          {!esterilizacion && (
            <View style={[styles.badge, styles.badgeRed]}>
              <Text style={styles.badgeTextRed}>X No Esterilizado</Text>
            </View>
          )}
          {vacunacion && (
            <View style={[styles.badge, styles.badgeGreen]}>
              <Text style={styles.badgeTextGreen}>✓ Vacunado</Text>
            </View>
          )}
          {esterilizacion && (
            <View style={[styles.badge, styles.badgeGreen]}>
              <Text style={styles.badgeTextGreen}>✓ Esterilizado</Text>
            </View>
          )}
          {!desparasitacion && (
            <View style={[styles.badge, styles.badgeRed]}>
              <Text style={styles.badgeTextRed}>X No Desparasitado</Text>
            </View>
          )}
          {enfermedades && enfermedades.trim() !== "" && (
            <View style={[styles.badge, styles.badgeOrange]}>
              <Text style={styles.badgeTextOrange}>⚠ {enfermedades}</Text>
            </View>
          )}
        </View>
      </View>

      <VentanaConfirmacion
        visible={visible}
        titulo="Eliminar Animal"
        descripcion="¿Está seguro de que desea eliminar el animal?"
        cancelar={cancelarEliminacion}
        aceptar={aceptarEliminacion}
      />
    </Card>
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
    backgroundColor: '#E5E7EB',
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
    marginBottom: 12,
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
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeRed: {
    backgroundColor: '#FEE2E2',
  },
  badgeGreen: {
    backgroundColor: '#D1FAE5',
  },
  badgeTextRed: {
    color: '#991B1B',
    fontSize: 11,
    fontWeight: 'bold',
  },
  badgeTextGreen: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: 'bold',
  },
  badgeOrange: {
    backgroundColor: '#FFEDD5',
    borderColor: '#F97316',
  },
  badgeTextOrange: {
    color: '#C2410C',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Animales;
