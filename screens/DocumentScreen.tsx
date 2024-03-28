import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { auth, db, storage } from '../config/firebase'; 
import { collection, DocumentData, getDocs, deleteDoc, doc, setDoc, addDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';

const DocumentScreen: React.FC = () => {
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [documentName, setDocumentName] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<any>(null);
  
    const navigation = useNavigation();
  
    const fetchUserDocuments = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const documentsRef = collection(db, 'users', userId, 'userDocuments');
          const snapshot = await getDocs(documentsRef);
          const userDocuments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDocuments(userDocuments);
        }
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    };
  
    useEffect(() => {
      fetchUserDocuments(); // Llamada a la función fetchUserDocuments dentro del efecto
    }, []);
  
  
    const renderDocumentItem = ({ item }: { item: DocumentData }) => (
      <View style={styles.documentItem}>
        <Text>{item.name}</Text>
        <TouchableOpacity onPress={() => handleDocumentDownload(item)}>Descargar</TouchableOpacity>
        <TouchableOpacity onPress={() => handleDocumentDelete(item)}>Eliminar</TouchableOpacity>
        {/* Agrega más opciones según sea necesario, como editar o visualizar */}
      </View>
    );


  const handleDocumentUpload = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error('No hay usuario autenticado.');
      }

      const userId = auth.currentUser.uid;
      const userDocumentsRef = collection(db, 'users', userId, 'userDocuments');

      const userDocumentsSnapshot = await getDocs(userDocumentsRef);
      if (userDocumentsSnapshot.empty) {
        await setDoc(doc(userDocumentsRef, 'placeholderDocument'), { placeholder: true });
      }

      if (!documentName) {
        alert('Por favor, introduce un nombre para el documento.');
        return;
      }

      const newDocumentData = {
        name: documentName,
        // Agrega otros datos del documento según sea necesario
      };

      await addDoc(userDocumentsRef, newDocumentData);
      fetchUserDocuments();
      setDocumentName(''); // Limpiar el campo de entrada después de subir el documento
      alert('Documento subido con éxito.');
    } catch (error) {
      console.error('Error al subir el documento:', error);
      alert('Ocurrió un error al subir el documento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleDocumentDownload = async (document: DocumentData) => {
    try {
      const response = await fetch(document.url); // Suponiendo que tienes la URL del documento en el campo 'url'
      const fileUri = FileSystem.documentDirectory + document.name; // Guardar el archivo en el directorio de documentos con el nombre del documento
      await FileSystem.writeAsStringAsync(fileUri, await response.text(), { encoding: FileSystem.EncodingType.UTF8 }); // Escribir el contenido del archivo
      alert('Documento descargado con éxito.');
    } catch (error) {
      console.error('Error al descargar el documento:', error);
      alert('Ocurrió un error al descargar el documento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleDocumentDelete = async (document: DocumentData) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No hay usuario autenticado.');
      }
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'userDocuments', document.id));
      if (document.fileUri) {
        await FileSystem.deleteAsync(document.fileUri);
      }
      setDocuments(documents.filter((doc) => doc.id !== document.id));
      alert('Documento eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
      alert('Ocurrió un error al eliminar el documento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setSelectedFile(res);
    } catch (err) {
      console.error('Error al seleccionar el documento:', err);
    }
  };

  const uploadDocument = async () => {
    try {
      if (!selectedFile || !documentName) {
        alert('Por favor, selecciona un archivo y proporciona un nombre para el documento.');
        return;
      }

      const fileName = selectedFile.name;
      const fileUri = selectedFile.uri;

      // Subir el archivo a Firebase Storage
      const response = await storage.ref(`documents/${fileName}`).putFile(fileUri);
      const downloadUrl = await response.ref.getDownloadURL();

      // Guardar metadatos en Firestore
      await db.collection('documents').add({
        name: documentName,
        url: downloadUrl,
        // Puedes agregar más metadatos según sea necesario
      });

      // Limpiar el estado después de la carga exitosa
      setSelectedFile(null);
      setDocumentName('');
      alert('Documento subido con éxito.');
    } catch (error) {
      console.error('Error al subir el documento:', error);
      alert('Ocurrió un error al subir el documento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del documento"
        value={documentName}
        onChangeText={text => setDocumentName(text)}
      />
      <Button 
        title="Añadir Documento"
        buttonStyle={styles.buttonNewDocument}
        titleStyle={{ color: '#111822' }}
        onPress={handleDocumentUpload}
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
  buttonNewDocument: {
    backgroundColor: '#FFA40B',
    width: '100%',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
