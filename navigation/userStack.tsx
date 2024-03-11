import React from 'react';
import { Alert, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, signOut } from 'firebase/auth';

import OffersScreen from '../screens/OffersScreen';
import NewOrEditOfferScreen from '../screens/NewOrEditOfferScreen';
import OfferDetailScreen from '../screens/OfferDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

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
            console.log("An error has occurred");
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
          options={({ navigation }) => ({
            headerTitle: 'Registro de Ofertas',
            headerLeft: () => (
              <View style={{ paddingLeft: 10 }}>
                <Button
                  onPress={() => navigation.navigate('ProfileScreen')}
                  title="Perfil"
                  type="clear"
                  titleStyle={{ color: '#FFA40B' }}
                />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 10 }}>
                <Button
                  onPress={() => logout()}
                  title="Salir"
                  buttonStyle={{ backgroundColor: '#111822' }}
                  titleStyle={{ color: '#FFA40B' }}
                />
              </View>
            )
          })}
        />
        <Stack.Screen
          name="NewOrEditOffer"
          component={NewOrEditOfferScreen}
          options={({ navigation }) => ({
            headerTitle: 'Nueva Oferta o Edición de Oferta',
            headerRight: () => (
              <View style={{ paddingRight: 10 }}>
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
              <View style={{ paddingRight: 10 }}>
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
              <View style={{ paddingRight: 10 }}>
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
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            headerTitle: 'Perfil',
          }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{
            headerTitle: 'Editar Perfil',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
