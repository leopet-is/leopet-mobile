import React, { useState, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { GLOBALCONFIG } from '../Config';
import { register } from '../services/User';

import {
  StyledSafeAreaLogin,
  StyledContainer,
  InnerContainer,
  PageTitle,
  Subtitle,
  StyledFormArea,
  LeftIcon,
  RightIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent
} from '../components/StyledComponents/styles';

import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const uri = GLOBALCONFIG.EndpointBackHost;

  const nombresRef = useRef();
  const apellidosRef = useRef();
  const telefonoRef = useRef();
  const direccionRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();


  const registrarUsuario = (values, setErrors) => {
    if (values.password !== values.confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }
    
    setError(''); 
    setLoading(true);

    const userPayload = {
      cedula: values.cedula,
      nombres: values.nombres,
      apellidos: values.apellidos,
      telefono: values.telefono,
      direccion: values.direccion,
      email: values.email,
      password: values.password,
      role: 3,
      fundacionId: 1
    };

    register({ user: userPayload }, { apiUrl: uri })
      .then((response) => {
        setLoading(false);
        navigation.navigate('Login');
      })
      .catch((err) => {
        setLoading(false);
        const backendErrors = err.backendData?.errors;
        if (backendErrors && Array.isArray(backendErrors)) {
          const formikErrors = {};
          backendErrors.forEach((bErr) => {
            formikErrors[bErr.campo] = bErr.mensaje;
          });
  
          setErrors(formikErrors);
        } else {
          setError(err.message || 'Error general al registrar');
        }
      });
  };

  return (
    <StyledSafeAreaLogin>
      <KeyboardAvoidingWrapper>
        <StyledContainer>
          <InnerContainer>
            <StatusBar style="dark" />
            <PageTitle>Crear Cuenta</PageTitle>
            <Subtitle>Únete a nuestra comunidad</Subtitle>
            
            <Formik
              initialValues={{
                cedula: '',
                nombres: '',
                apellidos: '',
                telefono: '',
                direccion: '',
                email: '',
                password: '',
                confirmPassword: ''
              }}
              onSubmit={(values, { setErrors }) => {
                registrarUsuario(values, setErrors);
              }}
            >


              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <StyledFormArea>
                  <MyTextInput
                    label="Cédula"
                    icon="credit-card"
                    placeholder="1234567890"
                    placeholderTextColor={Colors.darklight}
                    onChangeText={handleChange('cedula')}
                    onBlur={handleBlur('cedula')}
                    value={values.cedula}
                    error={errors.cedula}
                    keyboardType="numeric"
                    returnKeyType="next"
                    onSubmitEditing={() => nombresRef.current?.focus()}
                  />

                  <MyTextInput
                    ref={nombresRef}
                    label="Nombres"
                    icon="person"
                    placeholder="Juan"
                    placeholderTextColor={Colors.darklight}
                    onChangeText={handleChange('nombres')}
                    onBlur={handleBlur('nombres')}
                    value={values.nombres}
                    error={errors.nombres}
                    returnKeyType="next"
                    autoCapitalize="words"
                    onSubmitEditing={() => apellidosRef.current?.focus()}
                  />

                  <MyTextInput
                    ref={apellidosRef}
                    label="Apellidos"
                    icon="people"
                    placeholder="Perez"
                    placeholderTextColor={Colors.darklight}
                    onChangeText={handleChange('apellidos')}
                    onBlur={handleBlur('apellidos')}
                    value={values.apellidos}
                    error={errors.apellidos}
                    returnKeyType="next"
                    autoCapitalize="words"
                    onSubmitEditing={() => telefonoRef.current?.focus()}
                  />

                  <MyTextInput
                    ref={telefonoRef}
                    label="Teléfono"
                    icon="device-mobile"
                    placeholder="0987654321"
                    placeholderTextColor={Colors.darklight}
                    onChangeText={handleChange('telefono')}
                    onBlur={handleBlur('telefono')}
                    value={values.telefono}
                    error={errors.telefono}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    onSubmitEditing={() => direccionRef.current?.focus()}
                  />

                  <MyTextInput
                    ref={direccionRef}
                    label="Dirección"
                    icon="location"
                    placeholder="Quito, Ecuador"
                    placeholderTextColor={Colors.darklight}
                    onChangeText={handleChange('direccion')}
                    onBlur={handleBlur('direccion')}
                    value={values.direccion}
                    error={errors.direccion}
                    returnKeyType="next"
                    autoCapitalize="sentences"
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />

                  <MyTextInput
                    ref={emailRef}
                    label="Correo"
                    icon="mail"
                    placeholder="donador@leopet.com"
                    placeholderTextColor={Colors.darklight}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    error={errors.email}
                    keyboardType="email-address"
                    returnKeyType="next"
                    autoCapitalize="none"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />

                  <MyTextInput
                    ref={passwordRef}
                    label="Contraseña"
                    icon="lock"
                    placeholder="••••••••"
                    placeholderTextColor={Colors.darklight}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    error={errors.password}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  />

                  <MyTextInput
                    ref={confirmPasswordRef}
                    label="Confirmar Contraseña"
                    icon="lock"
                    placeholder="••••••••"
                    placeholderTextColor={Colors.darklight}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    error={errors.confirmPassword}
                    secureTextEntry={hideConfirmPassword}
                    isPassword={true}
                    hidePassword={hideConfirmPassword}
                    setHidePassword={setHideConfirmPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />

                  {error ? <MsgBox>{error}</MsgBox> : null}

                  <View style={{ height: 25 }} />

                  <StyledButton onPress={handleSubmit} style={{ backgroundColor: Colors.greenPet }}>
                    <ButtonText>
                      {loading ? <ActivityIndicator size="large" color={Colors.primary} /> : 'Registrarse'}
                    </ButtonText>
                  </StyledButton>

                  <ExtraView>
                    <ExtraText>¿Ya tienes una cuenta? </ExtraText>
                    <TextLink
                      onPress={() => {
                        navigation.navigate('Login'); 
                      }}
                    >
                      <TextLinkContent>Inicia sesión</TextLinkContent>
                    </TextLink>
                  </ExtraView>

                  <View style={{ height: 175 }} />
                </StyledFormArea>
              )}
            </Formik>
          </InnerContainer>
        </StyledContainer>
      </KeyboardAvoidingWrapper>
    </StyledSafeAreaLogin>
  );
};

const MyTextInput = React.forwardRef(({ label, icon, isPassword, hidePassword, setHidePassword, error, ...props }, ref) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={Colors.greenPet} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput ref={ref} {...props} />
      {error && <MsgBox>{error}</MsgBox>}
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={Colors.greenPet} />
        </RightIcon>
      )}
    </View>
  );
});

export default Signup;