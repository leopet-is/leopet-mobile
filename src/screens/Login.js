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
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  Subtitle,
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
  const [error, setError] = useState(false);
  const passwordInputRef = useRef(null);

  const uri = GLOBALCONFIG.EndpointBackHost;

  const _storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('session', jsonValue);
    } catch (error) {
      setError(true);
    }
  };

  const iniciarSesion = ({ correo, contrasenia, nombres, tipoLogin }) => {
    setLoading(true);
    login(
      {
        correo,
        contrasenia,
        nombres,
        tipoLogin,
      },
      {
        apiUrl: uri,
      },
    )
      .then((user) => {
        _storeData(user);
        setLoading(false);
        navigation.navigate('Welcome');
        setError(false);
        console.log('Login!');
      })
      .catch((err) => {
        console.log(err.message);
        setError(err?.message || 'Server Error');
        setLoading(false);
      });
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
              onSubmit={(values, handleReset) => {
                iniciarSesion(values);
                handleReset;
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
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
                    onSubmitEditing={() => passwordInputRef.current?.focus()}

                  />
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

                  />

                  {error && <MsgBox>Usuario o Contraseña son incorrectos</MsgBox>}

                  <ExtraViewLeft>
                    <TextLink
                      onPress={() => {
                        navigation.navigate('Signup');
                      }}
                    >
                      <TextLinkContent>¿Olvidó la contraseña?</TextLinkContent>
                    </TextLink>
                  </ExtraViewLeft>

                  <StyledButton onPress={handleSubmit} style={{ backgroundColor: Colors.greenPet }}>
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

const MyTextImput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={Colors.greenPet} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={Colors.greenPet} />
        </RightIcon>
      )}
    </View>
  );
};


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
