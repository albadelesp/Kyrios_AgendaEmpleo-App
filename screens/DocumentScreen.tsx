import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import { auth, db, storage } from '../config/firebase'; 
import { collection, DocumentData, getDocs, deleteDoc, doc, setDoc, addDoc, query, where } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import FlashMessage, { showMessage } from "react-native-flash-message";

const DocumentScreen: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [documentName, setDocumentName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fetchDocuments, setFetchDocuments] = useState<(() => Promise<void>) | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempDocumentName, setTempDocumentName] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const documentsRef = collection(db, 'users', userId, 'userDocuments');
          
          const snapshot = await getDocs(query(documentsRef, where('userId', '==', userId)));
          
          const userDocuments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDocuments(userDocuments);
        }
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    };
    setFetchDocuments(() => fetchUserDocuments);
    fetchUserDocuments();
  }, []);

  const renderDocumentItem = ({ item }: { item: DocumentData }) => (
    <View style={styles.documentItem}>
      <View style={styles.documentIcon}>
        <MaterialIcons name="description" size={50} color="black" />
      </View>
      <Text style={styles.documentName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleDocumentDownload(item)}>
        <Text style={styles.downloadButton}>Descargar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDocumentDelete(item)}>
        <Text style={styles.deleteButton}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
  

  const handleDocumentUpload = async (selectedFile: any, documentName: string, userId: string) => {
    try {
      console.log('Iniciando handleDocumentUpload');

      if (!auth.currentUser) {
        throw new Error('No hay usuario autenticado.');
      }

      if (!selectedFile) {
        showMessage({
          message: 'Por favor, selecciona un archivo.',
          type: 'warning',
        });
        return;
      }

      if (!documentName) {
        showMessage({
          message: 'Por favor, introduce un nombre para el documento.',
          type: 'warning',
        });
        return;
      }

      const userId = auth.currentUser.uid;

      const userDocumentsRef = collection(db, 'users', userId, 'userDocuments');

      const userDocumentsSnapshot = await getDocs(userDocumentsRef);

      if (userDocumentsSnapshot.empty) {
        await setDoc(doc(userDocumentsRef, 'placeholderDocument'), { placeholder: true });
      }

      const fileName = selectedFile.name;

      const fileExtension = fileName.split('.').pop();
      const fileUri = selectedFile.uri;

      const storageRef = ref(storage, `documents/${fileName}`);
      const response = await fetch(fileUri);
      const fileBlob = await response.blob();
      await uploadBytes(storageRef, fileBlob);

      const downloadUrl = await getDownloadURL(storageRef);

      await addDoc(userDocumentsRef, { 
        name: `${documentName}.${fileExtension}`, 
        url: downloadUrl, 
        userId, 
        storagename: fileName 
      });

      setSelectedFile(null);
      setDocumentName('');

      showMessage({
        message: 'Documento subido con éxito.',
        type: 'success',
      });

      if (fetchDocuments) {
        await fetchDocuments();
      }

    } catch (error) {
      console.error('Error al subir el documento:', error);
      showMessage({
        message: 'Ocurrió un error al subir el documento. Por favor, inténtalo de nuevo más tarde.',
        type: 'danger',
      });
    }
  };

  const handleDocumentDownload = async (document: DocumentData) => {
    try {
      if (document.url) {
        const downloadUrl = document.url;
        const fileName = document.name;
        const fileInfo = await FileSystem.downloadAsync(
          downloadUrl,
          FileSystem.cacheDirectory + fileName
        );
        const localUri = fileInfo.uri;
        await Sharing.shareAsync(localUri);
      } else {
        Alert.alert('El documento no tiene una URL válida.');
      }
    } catch (error) {
      console.error('Error al compartir el documento:', error);
      Alert.alert('Ocurrió un error al compartir el documento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleDocumentDelete = async (document: DocumentData) => {
    try {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        Alert.alert('Error al eliminar el documento. Inténtalo de nuevo más tarde.');
        return;
      }

      const documentRef = doc(db, 'users', userId, 'userDocuments', document.id);
      await deleteDoc(documentRef);

      const storageRef = ref(storage, `documents/${document.storagename}`);
      await deleteObject(storageRef);

      Alert.alert('Documento eliminado con éxito.');

      if (fetchDocuments) {
        await fetchDocuments();
      }
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
      Alert.alert('Ocurrió un error al eliminar el documento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync();
      if (!res.canceled) {
        const file = res.assets[0];
        setSelectedFile({ uri: file.uri, name: file.name });
        setTempDocumentName('');
        setModalVisible(true);
      } else {
        console.log('Selección cancelada');
      }
    } catch (err) {
      console.error('Error al seleccionar el documento:', err);
    }
  };

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <TextInput
          placeholder="Escribe el nombre del documento"
          value={tempDocumentName}
          onChangeText={setTempDocumentName}
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Guardar"
            buttonStyle={styles.button}
            titleStyle={{ color: '#000000' }} 
            onPress={() => {
              setDocumentName(tempDocumentName);
              setModalVisible(false);
              const userId = auth.currentUser?.uid;
              if (userId) {
                handleDocumentUpload({ uri: selectedFile.uri, name: selectedFile.name }, tempDocumentName, userId);
              }
            }}
          />
          <Button
            title="Cancelar"
            buttonStyle={styles.button}
            titleStyle={{ color: '#000000' }}
            onPress={() => setModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );  

  return (
    <View style={styles.container}>
      <Button 
        title="Añadir Documento"
        buttonStyle={styles.buttonNewDocument}
        titleStyle={{ color: '#111822' }}
        onPress={pickDocument}
      />
      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={item => item.id}
      />
      {renderModal()}
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonNewDocument: {
    backgroundColor: '#FFA40B',
    marginBottom: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  documentIcon: {
    marginRight: 10,
  },
  documentName: {
    flex: 1,
    fontSize: 16,
  },
  downloadButton: {
    marginRight: 20,
    color: '#000',
  },
  deleteButton: {
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#FFA40B',
    width: '80%',
  },
});

export default DocumentScreen;
