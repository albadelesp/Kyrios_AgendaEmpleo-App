import React, { useEffect }  from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebase } from '@react-native-firebase/messaging';
import kyrios from '../assets/kyrios.jpg';

const auth = getAuth();

const LoginScreen = () => {
  const [value, setValue] = React.useState({
    email: '',
    password: '',
    error: ''
  })

  async function signIn() {
    if (value.email === '' || value.password === '') {
      setValue({
        ...value,
        error: 'Email y contraseña son campos obligatorios.'
      })
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);
    } catch (error) {
      let msg = '';
      if (error instanceof Error) {
        msg = error.message;
        if (msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password')) {
          msg = 'Credenciales inválidas';
        }
      } else {
        msg = 'Error inesperado';
      }
      setValue({
        ...value,
        error: msg
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
        {!!value.error && <View style={styles.error}><Text>{value.error}</Text></View>}

        <View style={styles.imageContainer}>
          <Image source={kyrios} style={styles.image} />
        </View>

        <View style={styles.controls}>
          <Input
            autoComplete='email'
            placeholder='Email'
            containerStyle={styles.control}
            value={value.email}
            onChangeText={(text) => setValue({ ...value, email: text.trim() })}
            leftIcon={<Icon
              name='envelope'
              size={16}
            />}
          />

          <Input
            autoComplete='password'
            placeholder='Contraseña'
            containerStyle={styles.control}
            value={value.password}
            onChangeText={(text) => setValue({ ...value, password: text })}
            secureTextEntry={true}
            leftIcon={<Icon
              name='key'
              size={16}
            />}
          />

          <Button title="Login" buttonStyle={styles.buttonLogin} titleStyle={{ color: '#111822' }} onPress={signIn} />
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

  imageContainer: {
    flex: 1,
    flexGrow: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },

  image: {
    width: 200,
    height: 200,
  },

  controls: {
    flex: 1,
    flexGrow: 6,
    width: '100%',
    paddingLeft: '10%',
    paddingRight: '10%'
  },

  control: {
    width: '100%',
    marginTop: 10
  },

  buttonLogin: {
    backgroundColor: '#FFA40B',
    width: '100%',
    marginTop: 30
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: '#fff',
    backgroundColor: '#D54826FF',
  }
});

export default LoginScreen;
