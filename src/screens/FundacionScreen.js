import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/Headers/CustomHeader';
import Fundacion from '../components/Cards/CardFundacion';
import { ActivityIndicator, TouchableOpacity, Text } from 'react-native';

// Servicios
import { getFundacion } from '../services/Fundacion';

import {
  StyledSafeArea,
  InnerContainer,
  StyledScrollContainer,
  Colors,
} from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';

const FundacionScreen = ({ navigation }) => {
  const uri = GLOBALCONFIG.EndpointBackHost;

  // Varibles
  const [fundaciones, setFundaciones] = useState([]);
  const [isLoading, setLoading] = useState();
  const [error, setError] = useState();

  // Cargar animales al renderizar el componente
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFundaciones(0, true);
    });
    return unsubscribe;
  }, [navigation]);

  const loadFundaciones = async (page, reset, cb) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = await JSON.parse(jsonValue);
    if (reset) {
      setLoading(true);
    }
    return getFundacion(
      {
        q: null,
        page,
        limit: 20,
      },
      {
        apiUrl: uri,
        token: data.token,
      },
    )
      .then((data) => {
        setFundaciones(reset ? data : [...fundaciones, ...data]);
        if (reset) {
          setLoading(false);
        }
        if (cb) {
          cb(data.length != 0);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err?.message || 'Server Error');
        setLoading(false);
      });
  };
  const loadFundacion = (navigation) => {
    return fundaciones.map((fundacion) => {
      return (
        <TouchableOpacity
          key={fundacion.id}
          style={{ width: '100%', alignItems: 'center' }}
          onPress={() =>
            navigation.navigate('Detalle de Fundacion', {
              fundacionId: fundacion.id,
              nombre: fundacion.nombre,
              descripcion: fundacion.descripcion,
              logo: fundacion.logo,
              telefono: fundacion.telefono,
              direccion: fundacion.direccion,
            })
          }
        >
          <Fundacion
            id={fundacion.id}
            nombre={fundacion.nombre}
            logo={fundacion.logo}
            direccion={fundacion.direccion}
            telefono={fundacion.telefono}
            descripcion={fundacion.descripcion}
          />
        </TouchableOpacity>
      );
    });
  };

  return (
    <StyledSafeArea>
      <CustomHeader isHome={true} title="Fundaciones" color={Colors.primary} navigation={navigation} />
      <StyledScrollContainer contentContainerStyle={{ paddingBottom: 20 }}>
        <InnerContainer>
          <StatusBar style="dark" />

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.tertiary, marginVertical: 20, textAlign: 'center' }}>
            Fundaciones registradas
          </Text>

          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.greenPet} style={{ marginTop: 20 }} />
          ) : error ? (
            <Text style={{ color: Colors.red, textAlign: 'center', marginTop: 20 }}>{error}</Text>
          ) : (
            loadFundacion(navigation)
          )}
        </InnerContainer>
      </StyledScrollContainer>
    </StyledSafeArea>
  );
};

export default FundacionScreen;
