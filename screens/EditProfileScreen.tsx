
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface OnSaveCallback {
  (profileData: ProfileData): void;
}

interface ProfileData {
  laboralExperience: string;
  previousJobs: string;
  education: string;
}

const EditProfileScreen: React.FC<{ onSave: OnSaveCallback }> = ({ onSave }) => {
  const [laboralExperience, setLaboralExperience] = useState('');
  const [previousJobs, setPreviousJobs] = useState('');
  const [education, setEducation] = useState('');

  const saveProfile = () => {
    const profileData = {
      laboralExperience,
      previousJobs,
      education
    };
    onSave(profileData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Vida Laboral"
        value={laboralExperience}
        onChangeText={text => setLaboralExperience(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Trabajos Anteriores"
        value={previousJobs}
        onChangeText={text => setPreviousJobs(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Educación"
        value={education}
        onChangeText={text => setEducation(text)}
      />
      <Button title="Guardar" onPress={saveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default EditProfileScreen;
