import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native'; 

interface ProfileData {
  laboralExperience: string;
  previousJobs: string;
  education: string;
}

const ProfileScreen: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    laboralExperience: '',
    previousJobs: '',
    education: '',
  });

  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;

          const profileDocRef = doc(db, 'users', userId);
          const profileDocSnapshot = await getDoc(profileDocRef);

          if (profileDocSnapshot.exists()) {
            const data = profileDocSnapshot.data();
            setProfileData({
              laboralExperience: data.laboralExperience || '',
              previousJobs: data.previousJobs || '',
              education: data.education || '',
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
  }, []);

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tu información</Text>
        <Button
          raised
          buttonStyle={styles.buttonEditProfile}
          titleStyle={{ color: '#FFA40B' }}
          containerStyle={{ width: 50 }} 
          icon={{
            name: "edit",
            size: 25,
            color: "white"
          }}
          onPress={handleEditProfile}
        />
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
});

export default ProfileScreen;
