import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Badge } from '@rneui/themed';
import { HeaderView, Colors } from '../StyledComponents/styles';
import { Ionicons } from '@expo/vector-icons';
import { getNotificaciones } from '../../services/Notificaciones';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLOBALCONFIG } from '../../Config';

const CustomHeader = ({ navigation, isHome, isAnimalDetalle }) => {
  const uri = GLOBALCONFIG.EndpointBackHost;

  const [totalNotificacionesNoleidas, setTotalNotificacionesNoleidas] = useState(0);

  const loadNotificaciones = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('session');
      const data = JSON.parse(jsonValue);
      if (data?.token) {
        const response = await getNotificaciones({
          apiUrl: uri,
          token: data.token,
        });
        const result = (response?.notificaciones || []).filter((notificacion) => notificacion.leido == false);
        setTotalNotificacionesNoleidas(result.length);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotificaciones();
    });

    return unsubscribe;
  }, [navigation]);

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
            source={require('../../assets/img/leopet.png')}
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

export default CustomHeader;
