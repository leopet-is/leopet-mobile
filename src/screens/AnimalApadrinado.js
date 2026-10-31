import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

//Services
//Formik


// Header
import CustomHeader from '../components/Headers/CustomHeader';
// Icons
import { Ionicons } from '@expo/vector-icons';

import {
  StyledSafeArea,
  StyledScrollContainer,
  InnerContainer,
  PageTitle,
  Subtitle,
  StyledButtonMedio,
  ButtonText,
  TextInfo,
  Colors,
} from '../components/StyledComponents/styles';

const AnimalApadrinado = ({ route, navigation }) => {
  const { nombre } = route.params;

  return (
    <StyledSafeArea>
      <CustomHeader title="FELICIDADES" color={Colors.greenPet} navigation={navigation} />
      <StyledScrollContainer>
        <InnerContainer>
          <StatusBar style="dark" />
          <PageTitle>FELICIDADES!</PageTitle>
          <Subtitle>Has apadrinado a {nombre}</Subtitle>
          <TextInfo>Puedes ir al apartado de manadas y revisar el listado de animales por manada</TextInfo>
          <Ionicons name="gift" size={100} color={Colors.pie} />
          <View style={{ marginBottom: 10 }}></View>
          <StyledButtonMedio onPress={() => navigation.navigate('Home')}>
            <ButtonText>ACEPTAR</ButtonText>
          </StyledButtonMedio>
        </InnerContainer>

        <View style={{ marginBottom: 30 }}></View>
      </StyledScrollContainer>
    </StyledSafeArea>
  );
};

export default AnimalApadrinado;
