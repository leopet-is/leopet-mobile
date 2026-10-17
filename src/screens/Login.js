import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Image, StyleSheet, LogBox, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import Constants from 'expo-constants';


// Services
import { login } from '../services/User';

//Formik
import { Formik } from 'formik';


// Icons
import { Octicons, Ionicons } from '@expo/vector-icons';

// KeyboardWrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

import {
  StyledSafeAreaLogin,
  InnerContainer,
  PageLogo,
  StyledFormArea,
  StyledTextInput,
  StyledInputLabel,
  LeftIcon,
  RightIcon,
  StyledButton,
  ButtonText,
  MsgBox,
  ExtraView,
  ExtraViewLeft,
  ExtraText,
  TextLink,
  TextLinkContent,
  Colors,
} from '../components/StyledComponents/styles';

import { GLOBALCONFIG } from '../Config';

LogBox.ignoreLogs(['Require cycle:']);

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const passwordInputRef = useRef(null);

  const uri = GLOBALCONFIG.EndpointBackHost;

  const iniciarSesion = async ({ correo, contrasenia }) => {
    setLoading(true);
    setError('');
    try {
      const user = await login(
        {
          correo: correo.trim(),
          contrasenia,
        },
        {
          apiUrl: uri,
        },
      );
      try {
        await AsyncStorage.setItem('session', JSON.stringify(user));
      } catch (storageError) {
        throw new Error('No pudimos guardar tu sesión en este dispositivo. Inténtalo de nuevo.', {
          cause: storageError,
        });
      }
      navigation.navigate('Welcome');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo iniciar sesión. Inténtalo de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledSafeAreaLogin>
      <KeyboardAvoidingWrapper>
      <FullScreenCenterContainer>
            <InnerContainer>
            <StatusBar style="dark" />
            <PageLogo resizeMode="cover" source={require('../assets/img/logo.png')} />
            <Formik
              initialValues={{ correo: '', contrasenia: '' }}
              validate={({ correo, contrasenia }) => {
                const errors = {};
                const trimmedEmail = correo.trim();

                if (!trimmedEmail) {
                  errors.correo = 'Ingresa tu correo electrónico.';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
                  errors.correo = 'Ingresa un correo electrónico válido.';
                }

                if (!contrasenia) {
                  errors.contrasenia = 'Ingresa tu contraseña.';
                }

                return errors;
              }}
              onSubmit={iniciarSesion}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <StyledFormArea>
                  <MyTextImput
                    label="Correo"
                    icon="mail"
                    placeholder="Ingrese su correo"
                    placeholderTextColor={Colors.darklight}
                    onChangeText={handleChange('correo')}
                    onBlur={handleBlur('correo')}
                    value={values.correo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    returnKeyType="next"
                  />
                  {touched.correo && errors.correo && <MsgBox>{errors.correo}</MsgBox>}
                  <MyTextImput
                    ref={passwordInputRef}
                    label="Contraseña"
                    icon="lock"
                    placeholder="Ingrese su contraseña"
                    placeholderTextColor={Colors.darklight}
                    onChangeText={handleChange('contrasenia')}
                    onBlur={handleBlur('contrasenia')}
                    value={values.contrasenia}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  {touched.contrasenia && errors.contrasenia && <MsgBox>{errors.contrasenia}</MsgBox>}

                  {error ? <MsgBox>{error}</MsgBox> : null}

                  <ExtraViewLeft>
                    <TextLink
                      onPress={() => {
                        navigation.navigate('Signup');
                      }}
                    >
                      <TextLinkContent>¿Olvidó la contraseña?</TextLinkContent>
                    </TextLink>
                  </ExtraViewLeft>

                  <StyledButton
                    onPress={handleSubmit}
                    disabled={loading}
                    style={{ backgroundColor: Colors.greenPet, opacity: loading ? 0.7 : 1 }}
                  >
                    <ButtonText>
                      {loading ? <ActivityIndicator size="large" color={Colors.darklight} /> : 'Ingresar'}
                    </ButtonText>
                  </StyledButton>

                  <ExtraView>
                    <ExtraText>¿Aún no tienes cuenta? </ExtraText>
                    <TextLink
                      onPress={() => {
                        navigation.navigate('Signup');
                      }}
                    >
                      <TextLinkContent>Regístrate</TextLinkContent>
                    </TextLink>
                  </ExtraView>
                </StyledFormArea>
              )}
            </Formik>
          </InnerContainer>
        </FullScreenCenterContainer>
      </KeyboardAvoidingWrapper>
    </StyledSafeAreaLogin>
  );
};

const MyTextImput = React.forwardRef(({ label, icon, isPassword, hidePassword, setHidePassword, ...props }, ref) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={Colors.greenPet} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput ref={ref} {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={Colors.greenPet} />
        </RightIcon>
      )}
    </View>
  );
});


const windowHeight = Dimensions.get('window').height;
const StatusBarHeight = Constants.statusBarHeight;

export const FullScreenCenterContainer = styled.View`
  flex: 1;
  min-height: ${windowHeight}px;
  padding: 15px;
  padding-top: ${StatusBarHeight + 17}px;   
  background-color: #F9FAFB;     
`;

export default Login;
