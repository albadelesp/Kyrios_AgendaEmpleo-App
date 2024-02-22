import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import kyrios from '../assets/kyrios.jpg';
//const kyrios = require('../../assets/kyrios.jpg');

const auth = getAuth();

const RegisterScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [value, setValue] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    error: ''
  })

  async function signUp() {
    if (value.email === '' || value.password === '' || value.password === '') {
      setValue({
        ...value,
        error: 'Email, contraseña y confirmación de contraseña son obligatorios.'
      })
      return;
    }

    if (value.password.length < 6) {
      setValue({
        ...value,
        error: 'La contraseña debe tener al menos 6 carácteres.'
      })
      return;
    }

    if (value.password !== value.password_confirmation) {
      setValue({
        ...value,
        error: 'La contraseña no coincide.'
      })
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, value.email, value.password);
      navigation.navigate('Login');
    } catch (error) {
      let msg = '';
      if (error instanceof Error) {
        msg = error.message;
        if (msg.includes('auth/email-already-in-use')) {
          msg = 'Este email ya está en uso';
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
      
        <View style={styles.imageContainer}>
          <Image source={kyrios} style={styles.image} />
        </View>

        {!!value.error && <View style={styles.error}><Text>{value.error}</Text></View>}

        <View style={styles.controls}>
          <Input
            autoComplete='off'
            placeholder='Introduce tu email...'
            containerStyle={styles.control}
            value={value.email}
            onChangeText={(text) => setValue({ ...value, email: text.trim() })}
            leftIcon={<Icon
              name='envelope'
              size={16}
            />}
          />

          <Input
            autoComplete='off'
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

          <Input
            autoComplete='off'
            placeholder='Repite tu contraseña...'
            containerStyle={styles.control}
            value={value.password_confirmation}
            onChangeText={(text) => setValue({ ...value, password_confirmation: text })}
            secureTextEntry={true}
            leftIcon={<Icon
              name='key'
              size={16}
            />}
          />

          <Button
            title="CREAR CUENTA"
            buttonStyle={styles.buttonRegister} 
            titleStyle={{ color: '#111822' }}
            onPress={signUp}
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

  buttonRegister: {
    backgroundColor: '#FFA40B',
    color: '#FFA40B',
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

export default RegisterScreen;
