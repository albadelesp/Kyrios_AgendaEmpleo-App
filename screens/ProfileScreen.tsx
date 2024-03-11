import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';


interface ProfileData {
    laboralExperience: string;
    previousJobs: string;
    education: string;
  }

const ProfileScreen: React.FC<{ profileData: ProfileData }> = ({ profileData }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Vida Laboral</Text>
        <Text style={styles.sectionText}>{profileData.laboralExperience}</Text>
        
        <Text style={styles.sectionTitle}>Trabajos Anteriores</Text>
        <Text style={styles.sectionText}>{profileData.previousJobs}</Text>
        
        <Text style={styles.sectionTitle}>Educación</Text>
        <Text style={styles.sectionText}>{profileData.education}</Text>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollViewContentContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
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
});

export default ProfileScreen;
