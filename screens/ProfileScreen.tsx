import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ProfileData {
  name: string;
  laboralExperience: string;
  previousJobs: string;
  education: string;
}

const ProfileScreen: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    laboralExperience: '',
    previousJobs: '',
    education: '',
  });

  const navigation = useNavigation();

  useFocusEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;

          const profileDocRef = doc(db, 'users', userId);
          const profileDocSnapshot = await getDoc(profileDocRef);

          if (profileDocSnapshot.exists()) {
            const data = profileDocSnapshot.data();
            setProfileData({
              name: data?.name || '',
              laboralExperience: data?.laboralExperience || '',
              previousJobs: data?.previousJobs || '',
              education: data?.education || '',
            });
          } else {
            console.log('El documento del perfil no existe');
          }
        } else {
          console.log('El usuario no está autenticado');
        }
      } catch (error) {
        console.error('Error al obtener datos del perfil:', error);
      }
    };
    
    fetchProfileData();
  },);

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  const handleNavigateToDocumentScreen = () => {
    navigation.navigate('DocumentScreen');
  };

  const handleDownloadPDF = async () => {
    try {
      const htmlContent = `
        <h1>Nombre:</h1>
        <p>${profileData.name}</p>
        <h1>Vida Laboral:</h1>
        <p>${profileData.laboralExperience}</p>
        <h1>Trabajos Anteriores:</h1>
        <p>${profileData.previousJobs}</p>
        <h1>Educación:</h1>
        <p>${profileData.education}</p>
      `;

      const options = {
        html: htmlContent,
        width: 612, // Ancho de la página en pixels (US Letter paper format)
        height: 792, // Alto de la página en pixels (US Letter paper format)
      };

      const { uri } = await Print.printToFileAsync(options);
      console.log('URI del PDF generado:', uri);
      handleSharePDF(uri);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };
  
  const handleSharePDF = async (pdfUri: string) => {
    try {
      await Sharing.shareAsync(pdfUri);
    } catch (error) {
      console.error('Error al compartir PDF:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const profileDocRef = doc(db, 'users', userId);
        await updateDoc(profileDocRef, {
          name: profileData.name,
          laboralExperience: profileData.laboralExperience,
          previousJobs: profileData.previousJobs,
          education: profileData.education,
        });
        console.log('Perfil actualizado correctamente');
      } else {
        console.log('El usuario no está autenticado');
      }
    } catch (error) {
      console.error('Error al guardar perfil:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tu información</Text>
        <View style={styles.buttonContainer}>
          <Button
            raised
            buttonStyle={styles.buttonEditProfile}
            titleStyle={{ color: '#FFA40B' }}
            containerStyle={{ width: 50 }} 
            icon={{
              name: "edit",
              size: 25,
              color: "orange"
            }}
            onPress={handleEditProfile}
          />
          <Button
            raised
            buttonStyle={styles.documentButton}
            titleStyle={{ color: '#FFA40B' }}
            containerStyle={{ width: 50, marginLeft: 10 }} 
            icon={{
              name: "file",
              type: "font-awesome",
              size: 25,
              color: "orange"
            }}
            onPress={handleNavigateToDocumentScreen}
          />
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Vida Laboral</Text>
        <Text style={styles.sectionText}>{profileData.laboralExperience}</Text>
      </View>
  
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Trabajos Anteriores</Text>
        <Text style={styles.sectionText}>{profileData.previousJobs}</Text>
      </View>
  
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Educación</Text>
        <Text style={styles.sectionText}>{profileData.education}</Text>
      </View>
  
      <Button
        titleStyle={{ color: '#111822', fontSize: 14}}
        title="Descargar Informacion"
        onPress={handleDownloadPDF}
        buttonStyle={{ backgroundColor: 'transparent' }}
        icon = {
               <Ionicons
                name='download-outline'
                size={30}
                color="orange"
                />
                  }
       iconPosition="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonEditProfile: {
    backgroundColor: '#111822',
    borderRadius: 5,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonDownloadPDF: {
    backgroundColor: '#FFA40B',
    width: '100%',
    marginBottom: 20
  },
  documentButton: {
    backgroundColor: '#111822',
    borderRadius: 5,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;
