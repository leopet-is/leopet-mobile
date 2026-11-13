import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, View } from 'react-native';

//Formik
import { Formik } from 'formik';

// Header
import CustomHeader from '../components/Headers/CustomHeader';
// Icons
import { Octicons, Ionicons } from '@expo/vector-icons';

import {
  StyledSafeArea,
  StyledScrollContainer,
  InnerContainer,
  StyledFormArea,
  StyledTextInput,
  StyledInputLabel,
  LeftIcon,
  RightIcon,
  StyledButtonMedio,
  ButtonText,
  ExtraViewMargin,
  Colors,
  Subtitle,
} from '../components/StyledComponents/styles';

/* const getUsuario = async () => {
  const jsonValue = await AsyncStorage.getItem('session');
  const data = await JSON.parse(jsonValue);
  //console.log(data);
  return (data);
 
};
 */

const CambioDatos = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const registerUser = () => {
    Alert.alert(
      'Guardado no disponible',
      'La actualización de datos todavía no está conectada al backend.',
    );
  };

  return (
    <StyledSafeArea>
      <CustomHeader isHome={false} title="Cambiar datos" navigation={navigation} />
      <StyledScrollContainer>
        <InnerContainer>
          <StatusBar style="dark" />
          <Subtitle>Cambiar datos</Subtitle>
          <Formik
            initialValues={{
              cedula: '',
              nombres: '',
              apellidos: '',
              telefono: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            onSubmit={(values) => {
              registerUser(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                <MyTextImput
                  label="Cédula*"
                  icon="note"
                  placeholder="0909090909"
                  placeholderTextColor={Colors.darklight}
                  onChangeText={handleChange('cedula')}
                  onBlur={handleBlur('cedula')}
                  value={values.cedula}
                  keyboardType="email-address"
                />
                <MyTextImput
                  label="Nombres*"
                  icon="person"
                  placeholder="Johanna"
                  placeholderTextColor={Colors.darklight}
                  onChangeText={handleChange('nombres')}
                  onBlur={handleBlur('nombres')}
                  value={values.nombres}
                  keyboardType="email-address"
                />
                <MyTextImput
                  label="Apellidos*"
                  icon="person"
                  placeholder="López"
                  placeholderTextColor={Colors.darklight}
                  onChangeText={handleChange('apellidos')}
                  onBlur={handleBlur('apellidos')}
                  value={values.apellidos}
                  keyboardType="email-address"
                />
                <MyTextImput
                  label="Teléfono*"
                  icon="device-mobile"
                  placeholder="0909090909"
                  placeholderTextColor={Colors.darklight}
                  onChangeText={handleChange('telefono')}
                  onBlur={handleBlur('telefono')}
                  value={values.telefono}
                  keyboardType="email-address"
                />
                <MyTextImput
                  label="Correo*"
                  icon="mail"
                  placeholder="donador@gmail.com"
                  placeholderTextColor={Colors.darklight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />
                <MyTextImput
                  label="Contraseña*"
                  icon="lock"
                  placeholder="* * * * * * * * * * * *"
                  placeholderTextColor={Colors.darklight}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MyTextImput
                  label="Confirmar Contraseña*"
                  icon="lock"
                  placeholder="* * * * * * * * * * * *"
                  placeholderTextColor={Colors.darklight}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={hideConfirmPassword}
                  isConfirmPassword={true}
                  hideConfirmPassword={hideConfirmPassword}
                  setHideConfirmPassword={setHideConfirmPassword}
                />
                <ExtraViewMargin>
                  <StyledButtonMedio onPress={handleSubmit}>
                    <ButtonText>Actualizar Datos</ButtonText>
                  </StyledButtonMedio>
                </ExtraViewMargin>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledScrollContainer>
    </StyledSafeArea>
  );
};

const MyTextImput = ({
  label,
  icon,
  isPassword,
  isConfirmPassword,
  hidePassword,
  setHidePassword,
  hideConfirmPassword,
  setHideConfirmPassword,
  ...props
}) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={Colors.greenPet} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isConfirmPassword && (
        <RightIcon onPress={() => setHideConfirmPassword(!hideConfirmPassword)}>
          <Ionicons name={hideConfirmPassword ? 'md-eye-off' : 'md-eye'} size={30} color={Colors.darklight} />
        </RightIcon>
      )}
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={Colors.darklight} />
        </RightIcon>
      )}
    </View>
  );
};

export default CambioDatos;
