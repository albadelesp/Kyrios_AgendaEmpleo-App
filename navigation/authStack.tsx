import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
 
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Welcome' component={WelcomeScreen} options={{ title: '¡Bienvenido/a a tu agenda de empleo!' }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{ title: 'Entrar' }} />
        <Stack.Screen name='Register' component={RegisterScreen} options={{ title: 'Registro'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}