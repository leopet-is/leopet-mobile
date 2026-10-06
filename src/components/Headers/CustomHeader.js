import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Badge, Icon } from '@rneui/themed';
import { HeaderView, Colors } from '../StyledComponents/styles';
import { Ionicons } from '@expo/vector-icons';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import { getNotificaciones } from '../../services/Notificaciones';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLOBALCONFIG } from '../../Config';

const CustomHeader = ({ title, color, navigation, isHome, isManada, isAnimalDetalle }) => {
  const uri = GLOBALCONFIG.EndpointBackHost + ':' + GLOBALCONFIG.EndpointBackPort;

  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState();
  const [notificaciones, setNotificaciones] = useState([]);
  const [totalNotificacionesNoleidas, setTotalNotificacionesNoleidas] = useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotificaciones(0, true);
    });
  }, []);

  const loadNotificaciones = async (page, reset, cb) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = await JSON.parse(jsonValue);
    if (reset) {
      setLoading(true);
    }
    return getNotificaciones({
      apiUrl: uri,
      token: data.token,
    })
      .then((data) => {
        setNotificaciones(data.notificaciones);
        const result = data.notificaciones.filter((notificacion) => notificacion.leido == false);
        setTotalNotificacionesNoleidas(result.length);
      })
      .catch((err) => {
        console.log(err);
        setError(err?.message || 'Server Error');
        setLoading(false);
      });
  };

  return (
    <HeaderView style={{ justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
      {/* Left side: Back button or Logo */}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        {!isHome ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
            <Ionicons name="chevron-back" size={28} color={Colors.greenPet} />
          </TouchableOpacity>
        ) : (
          <Image
            source={require('../../assets/img/logo.png')}
            style={{ width: 100, height: 35, resizeMode: 'contain' }}
          />
        )}
      </View>

      {/* Middle: Empty */}
      <View style={{ flex: 1 }} />

      {/* Right side: Notifications (only if isHome or relevant) */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
        {(isHome || isAnimalDetalle) && (
          <TouchableOpacity onPress={() => navigation.navigate('Notificaciones')}>
            <View>
              <Ionicons name="notifications-outline" size={28} color={Colors.greenPet} />

              {totalNotificacionesNoleidas > 0 && (
                <Badge
                  value={totalNotificacionesNoleidas > 99 ? '99+' : totalNotificacionesNoleidas}
                  status="error"
                  containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                  textStyle={{ fontWeight: 'bold', fontSize: 10 }}
                />
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </HeaderView>
  );
};

const styles = StyleSheet.create({
  imagen: {
    width: 35,
    height: 35,
    top: 0,
  },
});

const click = () => {
  alert('prueba');
};

export default CustomHeader;
