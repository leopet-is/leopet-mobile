import React, { useState } from 'react';
import { Card } from '@rneui/themed';
import { View, ActivityIndicator, StyleSheet, Text, Image } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../StyledComponents/styles';

const CardFundacion = (props) => {
  const { id, nombre, direccion, logo, telefono, descripcion } = props;

  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.starContainer}>
        <Ionicons name="star" size={18} color={id == 1 ? "#FFD700" : "#D1D5DB"} />
      </View>

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {!logo ? (
            <ActivityIndicator size="small" color={Colors.greenPet} />
          ) : (
            <Image
              style={styles.logo}
              source={id == 3 ? require('../../assets/img/logo.png') : { uri: logo }}
              resizeMode="contain"
            />
          )}
        </View>
        <Text style={styles.nombre}>{nombre}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Feather name="phone" size={14} color={Colors.greenPet} />
          <Text style={styles.detailText}>{telefono || 'No disponible'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={14} color={Colors.greenPet} />
          <Text style={styles.detailText}>{direccion || 'No disponible'}</Text>
        </View>

        {descripcion ? <Text style={styles.description}>{descripcion}</Text> : null}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    marginVertical: 10,
    width: '92%',
    alignSelf: 'center',
    borderWidth: 0,
    backgroundColor: 'white',
  },
  starContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  logo: {
    width: '80%',
    height: '80%',
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.greenPet,
    textAlign: 'center',
  },
  details: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 10,
  },
  description: {
    color: Colors.tertiary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
});

export default CardFundacion;
