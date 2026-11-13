import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './StyledComponents/styles';

const ManadaConfirmacion = ({
  visible,
  titulo,
  descripcion,
  resumen = [],
  animales = [],
  textoConfirmar = 'Confirmar',
  cargando = false,
  cancelar,
  aceptar,
}) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={cancelar}
  >
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.description}>{descripcion}</Text>

        {resumen.map((linea) => (
          <Text key={linea} style={styles.summary}>{linea}</Text>
        ))}

        <ScrollView style={styles.animalList}>
          {animales.map((animal) => (
            <View key={`${animal.accion || ''}-${animal.id}`} style={styles.animalRow}>
              {animal.imagen ? (
                <Image source={{ uri: animal.imagen }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="paw" size={23} color={Colors.greenPet} />
                </View>
              )}
              <View style={styles.animalText}>
                <Text style={styles.animalName}>{animal.nombre || 'Animal sin nombre'}</Text>
                {animal.accion ? <Text style={styles.action}>{animal.accion}</Text> : null}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={cancelar} disabled={cargando}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={aceptar} disabled={cargando}>
            {cargando ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <Text style={styles.confirmText}>{textoConfirmar}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 20,
    maxHeight: '85%',
  },
  title: {
    color: Colors.tertiary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    color: Colors.gray,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  summary: {
    color: Colors.tertiary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  animalList: {
    flexGrow: 0,
    marginTop: 8,
  },
  animalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  image: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
  },
  imagePlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalText: {
    flex: 1,
    marginLeft: 12,
  },
  animalName: {
    color: Colors.tertiary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  action: {
    color: Colors.gray,
    fontSize: 12,
    marginTop: 3,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: Colors.pinkLow,
  },
  confirmButton: {
    backgroundColor: Colors.greenPet,
  },
  cancelText: {
    color: Colors.tertiary,
    fontWeight: 'bold',
  },
  confirmText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default ManadaConfirmacion;
