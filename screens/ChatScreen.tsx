import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import { View, Text } from 'react-native';


export default function Chat() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const navigation = useNavigation();

  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  // Escuchar los mensajes en tiempo real desde Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), snapshot => {
      const messagesData: IMessage[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const message: IMessage = {
          _id: doc.id,
          text: data.text,
          createdAt: new Date(data.createdAt.seconds * 1000), // Convertir la fecha de Firestore a Date
          user: {
            _id: data.user._id, // ID del usuario
            name: data.user.name // Nombre del usuario
          }
        };
        messagesData.push(message);
      });
      setMessages(messagesData);
    });
  
    return () => unsubscribe(); // Detener la escucha de cambios cuando se desmonta el componente
  }, []);
  

  const onSend = useCallback((messages: IMessage[] = []) => {
    const newMessage = messages[0];
    const currentUser = auth.currentUser;
    if (currentUser) {
      addDoc(collection(db, 'messages'), {
        text: newMessage.text,
        createdAt: new Date(),
        user: {
          _id: currentUser.uid,
          name: currentUser.displayName, // Nombre del usuario
        },
      })
        .then(() => {
          console.log('Message sent successfully');
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    }
  }, []);  

  const renderBubble = (props: any) => {
    return (
      <View
        style={{
          ...props.containerStyle,
          backgroundColor: props.position === 'left' ? '#E8E8E8' : '#6495ED',
          borderRadius: 10, 
          marginBottom: 5, 
          maxWidth: '80%', 
          paddingHorizontal: 10, 
          paddingVertical: 5,
          marginLeft: props.position === 'left' ? -20 : 10
        }}
      >
        {props.position === 'left' && <Text style={{ color: '#333'}}>{props.currentMessage.user?.name}</Text>}
        <Text style={{ color: props.position === 'left' ? '#333' : '#FFF', fontSize: 18 }}>{props.currentMessage.text}</Text>
      </View>
    );
  };
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={onSignOut}>
          <AntDesign name="logout" size={24} color={colors.gray} style={{ marginRight: 10 }} />
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={messages => onSend(messages)}
      user={{ _id: auth?.currentUser?.uid || '' }}
      renderBubble={renderBubble}
    />
  );
  
}
