import styled from 'styled-components/native';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';

// Obtenemos la altura de la barra de status de los dispositivos
const StatusBarHeight = Constants.statusBarHeight;
/*const windowWidth = Dimensions.get('window').width;*/
/*const windowHeight = Dimensions.get('window').height; */

// colores
export const Colors = {
  primary: '#ffffff',
  secondary: '#E5E7EB',
  tertiary: '#1F2937',
  darklight: '#9CA3AF',
  brand: '#4EA4B1', // Teal from web primary
  green: '#10B981',
  red: '#EF4444',
  pie: '#F9CED5', // Pink from web secondary
  black: '#000000',
  greenPet: '#4EA4B1', // Align with brand
  gray: '#808080',
  pinkPet: '#F9CED5', // Align with pie
  pinkLow: '#FCBAB8',
  blue: '#3B5998',
  beige: '#F8F9FA', // White/Light gray from web background
};

const { primary, secondary, tertiary, darklight, brand, green, red, pie, black, greenPet, gray, pinkPet, blue } =
  Colors;

export const StyledSafeArea = styled.SafeAreaView`
  flex: 1;
`;

export const StyledSafeAreaLogin = styled.SafeAreaView`
  flex: 1;
  padding-top: ${StatusBarHeight}px;
  background-color: ${primary};
  
`;

export const StyledScrollContainer = styled.ScrollView`
  flex: 1;
  background-color: #F9FAFB;
`;

export const StyledContainerHome = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${primary};
  padding-top: ${StatusBarHeight}px;
`;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 15px;
  background-color: #F9FAFB;
  padding-top: ${StatusBarHeight + 17}px;
`;

export const InnerContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const PageLogo = styled.Image`
  width: 200px;
  height: 200px;
  borderRadius: 200px;
`;

export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${greenPet};
  letter-spacing: 1.5px;
`;

export const Subtitle = styled.Text`
  font-size: 18px;
  margin-bottom: 0px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tertiary};
`;

export const StyledFormArea = styled.View`
  width: 90%;
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${primary};
  border-width: 1.5px;
  border-color: ${darklight};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  borderRadius: 14px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 5px;
  color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
  color: ${tertiary};
  font-size: 13px;
  text-align: left;
`;

export const LeftIcon = styled.TouchableOpacity`
  left: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
  justify-content: center;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${greenPet};
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  margin-vertical: 10px;
  height: 60px;
`;

export const StyledButtonMedio = styled.TouchableOpacity`
  padding: 5px;
  background-color: ${greenPet};
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  margin-vertical: 20px;
  height: 50px;
  padding-horizontal: 30px;
`;

export const StyledButtonMedioCancelar = styled.TouchableOpacity`
  padding: 5px;
  background-color: ${greenPet};
  opacity: 0.8;
  justify-content: center;
  borderRadius: 5px;
  margin-vertical: 20px;
  height: 50px;
  width: 150px;
`;

export const ButtonText = styled.Text`
  color: ${primary};
  font-size: 16px;
  text-align: center;
  font-weight: bold;
`;

export const MsgBox = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${red};
  margin-bottom: 5px;
`;

export const ExtraView = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

export const ExtraViewMargin = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  margin-bottom: 30px;
`;

export const ExtraViewLeft = styled.View`
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

export const ExtraText = styled.Text`
  justify-content: center;
  align-items: center;
  color: ${tertiary};
  font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

export const TextLinkContent = styled.Text`
  color: ${greenPet};
  font-size: 15px;
`;

export const TextInfo = styled.Text`
  font-size: 15px;
  color: ${tertiary};
  margin-top: 10px;
  margin-bottom: 5px;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

export const FooterView = styled.View`
  justify-content: center;
  padding: 10px;
`;

export const FooterText = styled.Text`
  font-size: 13px;
  color: ${gray};
`;

export const HeaderView = styled.View`
  flex-direction: row;
  height: 60px;
  opacity: 1;
  width: 100%;
  margin-top: ${StatusBarHeight}px;
  background-color: white;
`;

export const ViewNombreLarge = styled.View`
  flex-direction: row;
  width: 100%;
  margin-left: 5px;
`;

export const View80 = styled.View`
  flex-direction: row;
  width: 60%;
  margin-left: 5px;
`;

export const ViewFiltro = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const ViewFiltroButton = styled.View`
  flex-direction: row;
  width: 33%;
`;
