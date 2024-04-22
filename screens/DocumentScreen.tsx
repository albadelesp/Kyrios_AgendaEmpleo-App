import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { auth, db, storage } from '../config/firebase'; 
import { collection, DocumentData, getDocs, deleteDoc, doc, setDoc, addDoc, query, where } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

const DocumentScreen: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [documentName, setDocumentName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fetchDocuments, setFetchDocuments] = useState<(() => Promise<void>) | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const documentsRef = collection(db, 'users', userId, 'userDocuments');
          
          // Filtrar documentos por userId
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
      {/* Icono de documento */}
      <View style={styles.documentIcon}>
        <MaterialIcons name="description" size={50} color="black" />
      </View>
      {/* Nombre del documento */}
      <Text style={styles.documentName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleDocumentDownload(item)}>
        <Text>Descargar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDocumentDelete(item)}>
        <Text>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  const handleDocumentUpload = async (selectedFile: any, documentName: string, userId: string) => {
    try {
      console.log('Iniciando handleDocumentUpload');
      if (!auth.currentUser) {
        throw new Error('No hay usuario autenticado.');
      }
      console.log('auth.currentUser:', auth.currentUser);
  
      if (!selectedFile) {
        console.log('No se ha seleccionado ningún archivo.');
        Alert.alert('Por favor, selecciona un archivo.');
        return;
      }
      console.log('selectedFile:', selectedFile);
  
      if (!documentName) {
        console.log('El nombre del documento está vacío.');
        Alert.alert('Por favor, introduce un nombre para el documento.');
        return;
      }
      console.log('documentName:', documentName);
  
      const userId = auth.currentUser.uid;
      console.log('userId:', userId);
  
      const userDocumentsRef = collection(db, 'users', userId, 'userDocuments');
      console.log('userDocumentsRef:', userDocumentsRef);
  
      const userDocumentsSnapshot = await getDocs(userDocumentsRef);
      console.log('userDocumentsSnapshot:', userDocumentsSnapshot);
  
      if (userDocumentsSnapshot.empty) {
        console.log('No hay documentos del usuario.');
        await setDoc(doc(userDocumentsRef, 'placeholderDocument'), { placeholder: true });
      }
  
      const fileName = selectedFile.name;
      console.log('fileName:', fileName);
  
      // Obtener la extensión del archivo
      const fileExtension = fileName.split('.').pop();
  
      const fileUri = selectedFile.uri;
      console.log('fileUri:', fileUri);
  
      // Define storageRef
      const storageRef = ref(storage, `documents/${fileName}`);
  
      // Fetch the file content as Blob
      const response = await fetch(fileUri);
      const fileBlob = await response.blob();
  
      // Upload the Blob to Firebase Storage
      await uploadBytes(storageRef, fileBlob);
  
      // Get the download URL of the uploaded file
      const downloadUrl = await getDownloadURL(storageRef);
  
      // Guardar los metadatos del archivo en Firestore, incluyendo la extensión
      await addDoc(userDocumentsRef, { name: `${documentName}.${fileExtension}`, url: downloadUrl, userId, storagename: fileName });
      console.log('Metadatos guardados en Firestore correctamente.');
  
      setSelectedFile(null);
      setDocumentName('');
      console.log('Documento subido con éxito.');
      Alert.alert('Documento subido con éxito.');
      
      if (fetchDocuments) {
        await fetchDocuments();
      }

    } catch (error) {
      console.error('Error al subir el documento:', error);
      Alert.alert('Ocurrió un error al subir el documento. Por favor, inténtalo de nuevo más tarde.');
    }
  };  
  

  
  const handleDocumentDownload = async (document: DocumentData) => {
    try {
      // Verifica que la URL de descarga exista
      if (document.url) {
        const downloadUrl = document.url;
        // Obtén el nombre del archivo con su extensión desde Firestore
        const fileName = document.name;
        console.log(document.name);
        const fileInfo = await FileSystem.downloadAsync(
          downloadUrl,
          FileSystem.cacheDirectory + fileName
        );
        const localUri = fileInfo.uri;
        await Sharing.shareAsync(localUri);
      } else {
        console.error('El documento no tiene una URL válida.');
        Alert.alert('El documento no tiene una URL válida.');
      }
    } catch (error) {
      console.error('Error al compartir el documento:', error);
      Alert.alert('Ocurrió un error al compartir el documento. Por favor, inténtalo de nuevo más tarde.');
    }
  };
  


  const handleDocumentDelete = async (document: DocumentData) => {
    try {
      const userId = auth.currentUser?.uid; // Get the current user ID
  
      if (!userId) {
        console.error('Error al eliminar el documento: ID de documento o ID de usuario no disponibles.');
        Alert.alert('Error al eliminar el documento. Inténtalo de nuevo más tarde.');
        return;
      }
  
      // Delete the document from Firestore
      const documentRef = doc(db, 'users', userId, 'userDocuments', document.id);
      await deleteDoc(documentRef);
  
      // Delete the file from Firebase Storage
      const storageRef = ref(storage, `documents/${document.storagename}`);
      console.log(document.storagename);
      await deleteObject(storageRef);
  
      console.log('Documento eliminado con éxito de Firestore y Firebase Storage.');
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
      console.log('Res de DocumentPicker:', res);
      if (!res.canceled) {
        const file = res.assets[0];
  
        // Pedir al usuario que ingrese el nombre del documento mediante un cuadro de diálogo
        Alert.prompt(
          'Nombre del documento',
          'Por favor, ingresa el nombre del documento:',
          (documentName) => {
            if (documentName) {
              setSelectedFile({ uri: file.uri, name: file.name });
              setDocumentName(documentName);
              console.log('selectedFile:', selectedFile); // Verifica las propiedades name y uri
              console.log('Antes');
              const userId = auth.currentUser?.uid;
              if (userId) {
                handleDocumentUpload({ uri: file.uri, name: file.name }, documentName, userId);
              } else {
                console.error('No hay usuario autenticado para subir documentos.');
              }
              console.log('Después');
            } else {
              console.log('El usuario no ingresó un nombre para el documento.');
            }
          }
        );
      } else {
        console.log('Selección cancelada');
      }
    } catch (err) {
      console.error('Error al seleccionar el documento:', err);
    }
  };   

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  documentIcon: { 
    marginRight: 0,
  },
  documentName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonNewDocument: {
    backgroundColor: '#FFA40B',
    width: '100%',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default DocumentScreen;
