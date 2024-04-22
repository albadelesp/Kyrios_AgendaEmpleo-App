import React from 'react';
import { Alert, View } from 'react-native';
import { Button, TabView } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { getAuth, signOut } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';



import OffersScreen from '../screens/OffersScreen';
import NewOrEditOfferScreen from '../screens/NewOrEditOfferScreen';
import OfferDetailScreen from '../screens/OfferDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

function TabNavigator(){
  return(
    <Tab.Navigator
    screenOptions={{headerShown: false}}>
      <Tab.Screen
        name = 'Perfil' component={ProfileScreen}
        options={{tabBarIcon: ({size})=> (
          <Ionicons name = "person"
          size = {size} color = '#FFA40B'/>
        ),tabBarLabelStyle: { color: '#111822' }}}
      />
      <Tab.Screen
        name = 'Ofertas' component = {UserStack}
        options={{tabBarIcon: ({size})=> (
          <Ionicons name = "home"
          size = {size} color = '#FFA40B'/>
        ),tabBarLabelStyle: { color: '#111822' }}}
      />
      <Tab.Screen
        name = 'Chat' component={ChatScreen}
        options={{tabBarIcon: ({size})=> (
          <Ionicons name = "chatbubbles"
          size = {size} color = '#FFA40B'/>
        ),tabBarLabelStyle: { color: '#111822' }}}
      />
    </Tab.Navigator>
  )
}

function UserStack() {

  return (
      <Stack.Navigator>
        <Stack.Screen
          name="Offers"
          component={OffersScreen}
          options={() => ({
            headerTitle: 'Registro de Ofertas',
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
  );
}

export default function User(){
  return(
    <NavigationContainer>
      <TabNavigator/>  
    </NavigationContainer>
  );
}