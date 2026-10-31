// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Navigators & Screens
import OptionsDrawer from './OptionsDrawer';
import Login from '../screens/Login';
import Signup from '../screens/Signup';

const Stack = createStackNavigator();


const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Welcome" component={OptionsDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;