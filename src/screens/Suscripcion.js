import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
//Services

// Header
import CustomHeader from '../components/Headers/CustomHeader';

// Icons

import {
  StyledSafeArea,
  StyledScrollContainer,
  InnerContainer,
  StyledButtonMedio,
  StyledButtonMedioCancelar,
  ButtonText,
  Colors,
} from '../components/StyledComponents/styles';

const Suscripcion = ({ navigation }) => {
  // const uri = GLOBALCONFIG.EndpointBackHost;

  // const [error, setError] = useState(false);
  // const [isLoading, setLoading] = useState();

  return (
    <StyledSafeArea>
      <CustomHeader isHome={false} title="Suscripción" color={Colors.greenPet} navigation={navigation} />
      <StyledScrollContainer>
        <InnerContainer>
          <StatusBar style="dark" />
          {/* <PageTitle>LEOPET</PageTitle>
          <Subtitle>Suscribirse</Subtitle>
          <TextInfo>
            Seleccione la forma de pago 
          </TextInfo> */}
          <Text style={{ color: Colors.greenPet, fontSize: 18, margin: 20, fontWeight: 'bold', letterSpacing: 1 }}>
            Seleccione la forma de pago:
          </Text>
        </InnerContainer>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <StyledButtonMedioCancelar onPress={() => navigation.navigate('SuscripcionPay')}>
            <ButtonText>PayPal</ButtonText>
          </StyledButtonMedioCancelar>

          <StyledButtonMedio onPress={() => navigation.navigate('Suscripciontarjeta')}>
            <ButtonText>Tarjeta crédito o débito</ButtonText>
          </StyledButtonMedio>
        </View>
        <View style={{ marginBottom: 30 }}></View>
      </StyledScrollContainer>
    </StyledSafeArea>
  );
};



export default Suscripcion;
