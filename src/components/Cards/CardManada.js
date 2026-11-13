import { useState } from 'react';
import { Card } from '@rneui/themed';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Colors } from '../StyledComponents/styles';
import { Ionicons, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import VentanaConfirmacion from '../../screens/VentanaConfirmacion';

const CardManada = ({
  nombre,
  monto,
  id_manada,
  manadaId,
  id,
  apadrinados,
  navigation,
  isMenu,
  eliminarManada,
}) => {
  const [visible, setVisible] = useState(false);
  const resolvedManadaId = id_manada ?? manadaId ?? id;

  const mostarVentanaConfirmacion = () => {
    setVisible(true);
  };

  const cancelarEliminacion = () => {
    setVisible(false);
  };

  const aceptarEliminacion = () => {
    setVisible(false);
    eliminarManada(resolvedManadaId);
  };

  const totalMensual = (Number(monto || 0) * Number(apadrinados || 0)).toFixed(2);

  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="account-group-outline" size={24} color={Colors.greenPet} />
          <Text style={styles.nombre}>{nombre}</Text>
        </View>

        <View style={styles.actionGroup}>
          {isMenu === 'MANADAS' && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditarManada', {
                  id_manada: resolvedManadaId,
                  manadaId: resolvedManadaId,
                  nombre,
                  monto,
                })
              }
              style={styles.iconButton}
              accessibilityLabel="Editar manada"
            >
              <Octicons name="pencil" size={18} color={Colors.gray} />
            </TouchableOpacity>
          )}

          {isMenu == 'MANADAS' && (
            <TouchableOpacity onPress={mostarVentanaConfirmacion} style={styles.iconButton}>
              <Octicons name="x" size={20} color={Colors.red} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Animales</Text>
          <View style={styles.statValueRow}>
            <Ionicons name="paw" size={16} color={Colors.tertiary} />
            <Text style={styles.statValue}>{apadrinados}</Text>
          </View>
        </View>

        <View style={[styles.statBox, { borderLeftWidth: 1, borderLeftColor: Colors.border }]}>
          <Text style={styles.statLabel}>Suscripción mensual</Text>
          <Text style={styles.statValueGreen}>$ {totalMensual}</Text>
        </View>
      </View>

      {isMenu === 'MANADAS' && (
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            navigation.navigate('Ver Manada', {
              manadaId: resolvedManadaId,
              monto,
              nombre,
              apadrinados,
            })
          }
        >
          <Text style={styles.detailsButtonText}>Ver animales de esta manada</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.greenPet} />
        </TouchableOpacity>
      )}

      <VentanaConfirmacion
        visible={visible}
        titulo="Eliminar Manada"
        descripcion="¿Está seguro de que desea eliminar la manada con todos sus animales?"
        cancelar={cancelarEliminacion}
        aceptar={aceptarEliminacion}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    marginVertical: 10,
    width: '92%',
    alignSelf: 'center',
    borderWidth: 0,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginLeft: 10,
    flexShrink: 1,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.beige,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 5,
    textAlign: 'center',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginLeft: 5,
  },
  statValueGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.greenPet,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  detailsButtonText: {
    color: Colors.greenPet,
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5,
  },
});

export default CardManada;
