import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text, View, Alert, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { StackScreenProps } from '@react-navigation/stack';

const auth = getAuth();

const EditProfileScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    laboralExperience: '',
    previousJobs: '',
    education: '',
  });

  const saveProfileData = async () => {
    const userUUID = auth.currentUser?.uid;
    if (userUUID) {
      const profileRef = doc(db, 'users', userUUID);
      try {
        await setDoc(profileRef, {
          // Remove name update to keep it unchangeable
          laboralExperience: profileData.laboralExperience,
          previousJobs: profileData.previousJobs,
          education: profileData.education,
        });
        Alert.alert('Perfil actualizado correctamente');
        navigation.goBack();
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        Alert.alert('Error al actualizar el perfil. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const userUUID = auth.currentUser?.uid;
      if (userUUID) {
        const profileRef = doc(db, 'users', userUUID);
        try {
          const profileSnapshot = await getDoc(profileRef);
          if (profileSnapshot.exists()) {
            const data = profileSnapshot.data();
            setProfileData({
              laboralExperience: data.laboralExperience || '',
              previousJobs: data.previousJobs || '',
              education: data.education || '',
            });
          }
        } catch (error) {
          console.error('Error al obtener datos del perfil:', error);
        }
      }
    };
  
    fetchProfileData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Edita tus datos</Text>
          {/* Remove the name field */}
          <Text style={styles.label}>Experiencia Laboral</Text>
          <TextInput
            value={profileData.laboralExperience}
            onChangeText={(text) => setProfileData({ ...profileData, laboralExperience: text })}
            style={[styles.textInput, styles.largeTextInput]}
            multiline
          />
          <Text style={styles.label}>Trabajos Anteriores</Text>
          <TextInput
            value={profileData.previousJobs}
            onChangeText={(text) => setProfileData({ ...profileData, previousJobs: text })}
            style={[styles.textInput, styles.largeTextInput]}
            multiline
          />
          <Text style={styles.label}>Educación</Text>
          <TextInput
            value={profileData.education}
            onChangeText={(text) => setProfileData({ ...profileData, education: text })}
            style={[styles.textInput, styles.largeTextInput]}
            multiline
          />
          <Button
            title="Guardar Cambios"
            onPress={saveProfileData}
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  largeTextInput: {
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: '#FFA40B',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#111822',
  },
});

export default EditProfileScreen;
