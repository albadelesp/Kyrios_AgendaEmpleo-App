import React from 'react';
import { Alert, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import OffersScreen from '../screens/OffersScreen';
import NewOrEditOfferScreen from '../screens/NewOrEditOfferScreen';
import OfferDetailScreen from '../screens/OfferDetailScreen';
import ChatScreen from '../screens/ChatScreen';

import { getAuth, signOut } from 'firebase/auth';

const Stack = createStackNavigator();

async function logout() {
  Alert.alert(
    "¿Desea cerrar sesión?",
    "¿Está seguro?",
    [
      {
        text: "Sí",
        onPress: async () => {
          const auth = getAuth();
          try {
            await signOut(auth);
          } catch (err) {
            console.log("An error has ocurred");
          }
        },
      },
      {
        text: "No",
      },
    ]
  );
}

export default function UserStack() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Offers"
          component={OffersScreen}
          options={{
            headerTitle: 'Registro de Ofertas',
            headerRight: () => (
              <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Button
                  onPress={() => logout()}
                  title="Logout"
                  buttonStyle={{ backgroundColor: '#111822' }}
                  titleStyle={{ color: '#FFA40B' }}
                />
              </View>
            )
          }}
        />
        <Stack.Screen
          name="NewOrEditOffer"
          component={NewOrEditOfferScreen}
          options={({ route }) => ({
            headerTitle: 'Nueva Oferta o Edición de Oferta',
            headerRight: () => (
              <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Button
                  onPress={() => logout()}
                  title="Logout"
                  buttonStyle={{ backgroundColor: '#111822' }}
                  titleStyle={{ color: '#FFA40B' }}
                />
              </View>
            )
          })}
        />

        <Stack.Screen
          name="OfferDetail"
          component={OfferDetailScreen}
          options={{
            headerTitle: 'Detalle Oferta',
            headerRight: () => (
              <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Button
                  onPress={() => logout()}
                  title="Logout"
                  buttonStyle={{ backgroundColor: '#111822' }}
                  titleStyle={{ color: '#FFA40B' }}
                />
              </View>
            )
          }}
        />
        
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerTitle: 'Chat',
            headerRight: () => (
              <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Button
                  onPress={() => logout()}
                  title="Logout"
                  buttonStyle={{ backgroundColor: '#111822' }}
                  titleStyle={{ color: '#FFA40B' }}
                />
              </View>
            )
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
