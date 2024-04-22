import React from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';
import { Offer } from '../models/Offer';
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore"; 
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import { useIsFocused } from "@react-navigation/native"; 
import { useNavigation } from '@react-navigation/native'; 
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Ionicons from '@expo/vector-icons/Ionicons';

const OffersScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [refresher, setRefresher] = React.useState(false);
  const [offers, setOffers] = React.useState<Offer[] | undefined>(undefined);
  const focus = useIsFocused();

  async function deleteOffer(docId: string) {
    Alert.alert(
      "Se va a proceder a eliminar la oferta",
      "¿Está seguro?",
      [
        {
          text: "Sí",
          onPress: async () => {
            const user_uuid = getAuth().currentUser?.uid;
            const offer_collection_name = `users/${user_uuid}/offers/${docId}`;
            await deleteDoc(doc(db, offer_collection_name));
            setRefresher(!refresher);
          },
        },
        {
          text: "No",
        },
      ]
    );
  }

  React.useEffect(() => {
    const user_uuid = getAuth().currentUser?.uid;
    const collection_name = `users/${user_uuid}/offers`;

    const fetchData = async() => {
      const firebaseOffers : Offer[] = [];
      const querySnapshot = await getDocs(collection(db, collection_name));
      querySnapshot.forEach((doc) => {
        const dict_offer_from_firestore = doc.data();
        const offer: Offer = {
          documentId: doc.id,
          position: dict_offer_from_firestore.position,
          company: dict_offer_from_firestore.company,
          schedule: dict_offer_from_firestore.schedule,
          job_address: dict_offer_from_firestore.job_address,
          job_latitude: dict_offer_from_firestore.job_latitude,
          job_longitude: dict_offer_from_firestore.job_longitude,
          registration_date: dict_offer_from_firestore.registration_date,
          mandatory_education: dict_offer_from_firestore.mandatory_education,
          required_education: dict_offer_from_firestore.required_education,
          mandatory_experience: dict_offer_from_firestore.mandatory_experience,
          required_experience: dict_offer_from_firestore.required_experience,
          interview_date: dict_offer_from_firestore.interview_date,
          interview_hour: dict_offer_from_firestore.interview_hour,
          contact_person: dict_offer_from_firestore.contact_person,
          interview_address: dict_offer_from_firestore.interview_address,
          interview_latitude: dict_offer_from_firestore.interview_latitude,
          interview_longitude: dict_offer_from_firestore.interview_longitude,
          interview_state: dict_offer_from_firestore.interview_state,
          interview_color: dict_offer_from_firestore.interview_color,
        }
        firebaseOffers.push(offer);
      });

      return firebaseOffers;
    }

    fetchData()
      .then((saved_offers: Offer[]) => {
        setOffers(saved_offers)
      })
      .catch(console.error);

  }, [focus, refresher]);

  const handleDownloadPDF = async () => {
    try {
      if (!offers) {
        console.error('No offers available');
        return;
      }
  
      let htmlContent = '';
  
      offers.forEach((offer) => {
        const offerHTML = `
        <div>
        <h1><strong>Puesto:</strong> ${offer.position}</h1>
        <p><strong>Empresa:</strong> ${offer.company}</p>
        <p><strong>Horario:</strong> ${offer.schedule}</p>
        <p><strong>Dirección de la empresa:</strong> ${offer.job_address}</p>
        <p><strong>Requisitos educativos:</strong> ${offer.required_education}</p>
        <p><strong>Requisitos laborales:</strong> ${offer.required_experience}</p>
        <p><strong>Fecha de la entrevista:</strong> ${offer.interview_date}</p>
        <p><strong>Persona de contacto:</strong> ${offer.contact_person}</p>
        <p><strong>Dirección de la entrevista:</strong> ${offer.interview_address}</p>
        </div>
        <br />
        `;
  
        htmlContent += offerHTML;
      });
  
      const options = {
        html: htmlContent,
        width: 612,
        height: 792,
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

  return (
    <View style={styles.container}>      
      <FlatList
        style={styles.offerList}
        data={offers}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => {
          return (
            <View style={{borderColor: 'black', borderWidth: 2, borderRadius: 5, padding: 20, marginBottom: 20}}>
              <Text style={{ fontSize: 18, textAlign: 'center' }}>Aún no tienes ofertas</Text>
            </View>
          )
        }}
        renderItem={({ item }) => {
          return (
            <View style={{backgroundColor: '#FFC247', borderColor: 'black', borderWidth: 2, borderRadius: 5, padding: 20, marginBottom: 20}}>
              <Text style={{ fontSize: 22 }}>{item.position}</Text>
              <Text style={{ fontSize: 20 }}>{item.company}</Text>
              <Text style={{ fontSize: 18 }}>Fecha de inscripción: {item.registration_date}</Text>
              <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 16 }}>Estado de la oferta: </Text>
              <View style={{ backgroundColor: item.interview_color }}>
              <Text style={{ fontSize: 16, fontStyle: 'italic' }}>{item.interview_state}</Text>
              </View>
              </View>
              <View style={{ marginTop: 20, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                  raised
                  buttonStyle={styles.buttonViewOffer}
                  titleStyle={{ color: '#111822' }}
                  containerStyle={{ width: 50 }}
                  icon={{
                    name: "visibility",
                    size: 25,
                    color: "white"
                  }}
                  onPress={() => {
                    navigation.navigate('OfferDetail', { offer: item })
                  }}
                />
                <Button
                  raised
                  buttonStyle={styles.buttonEditOffer}
                  titleStyle={{ color: '#FFA40B' }}
                  containerStyle={{ width: 50 }} 
                  icon={{
                    name: "edit",
                    size: 25,
                    color: "white"
                  }}
                  onPress={() => {
                    navigation.navigate('NewOrEditOffer', { offer: item })
                  }}
                />
                <Button
                  raised
                  buttonStyle={styles.buttonRemoveOffer}
                  titleStyle={{ color: '#FFA40B' }}
                  containerStyle={{ width: 50 }} 
                  icon={{
                    name: "delete",
                    size: 25,
                    color: "white"
                  }}
                  onPress={() => {
                    deleteOffer(item.documentId!);
                  }}
                />
              </View>
            </View>
          )
        }}
      />
      <Button
        titleStyle={{ color: '#111822', fontSize: 14}}
        title="Descargar Ofertas"
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  containerOffers: {
    padding: 20,
    width: '100%'
  },

  offerList: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
    padding: 20,
    marginBottom: 30
  },

  buttonViewOffer: {
    backgroundColor: '#FFA40B',
    width: '100%',
    height: 50,
  },

  buttonEditOffer: {
    backgroundColor: '#111822',
    width: '100%',
    height: 50,
  },

  buttonRemoveOffer: {
    backgroundColor: 'red',
    width: '100%',
    height: 50,
  },

  buttonNewOffer: {
    backgroundColor: '#FFA40B',
    width: '100%'
  },

  buttonGoToChat: {
    backgroundColor: '#FFA40B',
    width: '100%',
    marginBottom: 20
  }
});

export default OffersScreen;