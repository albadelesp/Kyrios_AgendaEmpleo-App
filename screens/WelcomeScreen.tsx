import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, View, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Button } from 'react-native-elements';
import { getMessaging, getToken } from "firebase/messaging";

const WelcomeScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  useEffect(() => {
    const getDeviceToken = async () => {
      const messagin = getMessaging();
      getToken(messagin, { vapidKey: "BDQ2rklcLZ9_MqLuJfEjylfsxkMXtVjPIYw6KDUm6kOJQY0UgywBUmisneNHVU02X4aveJ14LGDgwgj7jtMlwy8" })
        .then((currentToken) => {
          if (currentToken) {

          } else {
            comprobandoPermisos();
          }
        });
    };

    getDeviceToken();
  }, []);

  const comprobandoPermisos = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        Alert.alert("Notification permission granted");
      }
    }).catch(e => Alert.alert("Denied " + e));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
          
       <View style={{padding: 5}}>
            <Text>Aquí puedes registrar todas las ofertas a las que te inscribes, para que sea
                  más fácil hacer seguimiento de cada una de ellas. ¡A por ello!
            </Text>
        </View>
          
        <View style={styles.buttons}>
          <Button 
            title="ENTRAR" 
            buttonStyle={styles.buttonLogin} 
            titleStyle={{ color: '#111822' }}
            onPress={() => navigation.navigate('Login')}
          />
          <Button 
            title="REGISTRATE"
            buttonStyle={styles.buttonRegister}
            titleStyle={{ color: '#FFA40B' }}
            onPress={() => navigation.navigate('Register')}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  scrollView: {
    flex: 1,
  },

  scrollViewContentContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttons: {
    flex: 1,
    flexGrow: 3,
  },

  buttonLogin: {
    backgroundColor: '#FFA40B',
    width: '100%'
  },

  buttonRegister: {
    backgroundColor: '#111822',
    width: '100%',
    marginTop: 10
  },

  button: {
    width: '100%',
    marginTop: 10
  }
});

export default WelcomeScreen;
