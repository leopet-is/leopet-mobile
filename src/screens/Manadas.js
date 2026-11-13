import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import CustomHeader from '../components/Headers/CustomHeader';
import { StatusBar } from 'expo-status-bar';

import AsyncStorage from '@react-native-async-storage/async-storage';


// Icons
import { Ionicons } from '@expo/vector-icons';

// Servicios
import { getManadas, deleteAllAnimalsManadaApp } from '../services/Manada';

// Cards
import CardManada from '../components/Cards/CardManada';

import {
  StyledSafeArea,
  InnerContainer,
  StyledScrollContainer,
  Colors,
} from '../components/StyledComponents/styles';
import { GLOBALCONFIG } from '../Config';

const HomeScreen = ({ navigation }) => {
  const uri = GLOBALCONFIG.EndpointBackHost;

  const [manadas, setManadas] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadManadas(0, true);
    });
    return unsubscribe;
  }, [navigation]);

  const loadManadas = async (page, reset, cb) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = jsonValue ? JSON.parse(jsonValue) : null;
    if (reset) {
      setLoading(true);
      setError(false);
    }
    if (!data?.token) {
      setError('Tu sesión expiró. Inicia sesión nuevamente.');
      setLoading(false);
      return;
    }
    return getManadas(
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
        setManadas(reset ? data : [...manadas, ...data]);
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

  const eliminarManada = async (id_manada) => {
    const jsonValue = await AsyncStorage.getItem('session');
    const data = jsonValue ? JSON.parse(jsonValue) : null;
    if (!data?.token) {
      setError('Tu sesión expiró. Inicia sesión nuevamente.');
      return;
    }
    return deleteAllAnimalsManadaApp(
      {
        manadaId: id_manada,
      },
      {
        apiUrl: uri,
        token: data.token,
      },
    )
      .then(() => {
        alert('Manada Eliminada');
        loadManadas(0, true);
      })
      .catch((err) => {
        console.log(err);
        setError(err?.message || 'Server Error');
        setLoading(false);
      });
  };

  const loadManada = () => {
    return manadas.map((manada) => {
      const manadaId = manada.id ?? manada.id_manada ?? manada.manadaId;
      return (
        <CardManada
          key={manadaId}
          nombre={manada.nombre}
          galeriamanada={manada.galeriamanada}
          monto={manada.monto}
          id_manada={manadaId}
          apadrinados={manada.apadrinados}
          navigation={navigation}
          isMenu="MANADAS"
          eliminarManada={eliminarManada}
        />
      );
    });
  };
  return (
    <StyledSafeArea>
      <CustomHeader isHome={true} isManada={true} title="Manadas" color={'white'} navigation={navigation} />
      <StyledScrollContainer>
        <InnerContainer>
          <StatusBar style="dark" />
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.greenPet,
              borderRadius: 12,
              paddingHorizontal: 15,
              paddingVertical: 10,
              marginHorizontal: 16,
              marginTop: 16,
              marginBottom: 8,
            }}
            onPress={() =>
              navigation.navigate('Crear Manada', {
                isMenu: 'HOME',
                isEditar: false,
              })
            }
          >
            <Ionicons name="add" size={20} color={Colors.primary} />
            <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: 'bold', marginLeft: 5 }}>
              Crear manada
            </Text>
          </TouchableOpacity>

          <Text style={{ alignSelf: 'flex-start', color: Colors.tertiary, fontSize: 22, fontWeight: 'bold', marginHorizontal: 18, marginVertical: 8 }}>
            Tus manadas
          </Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.darklight} />
          ) : error ? (
            <Text style={{ color: Colors.red, textAlign: 'center', margin: 20 }}>{error}</Text>
          ) : manadas.length ? (
            loadManada()
          ) : (
            <Text style={{ color: Colors.gray, textAlign: 'center', margin: 24 }}>
              Todavía no tienes manadas. Crea una para comenzar.
            </Text>
          )}
          <View style={{ marginBottom: 30 }}></View>
        </InnerContainer>
      </StyledScrollContainer>
    </StyledSafeArea>
  );
};

export default HomeScreen;
