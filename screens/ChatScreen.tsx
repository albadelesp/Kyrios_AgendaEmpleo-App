import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { GiftedChat, IMessage, Bubble, BubbleProps } from 'react-native-gifted-chat';
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
        console.log("Sending message as:", currentUser.displayName || "Anónimo");
        const displayName = currentUser.displayName || 'Anónimo';  // Ensure there's a fallback
        addDoc(collection(db, 'messages'), {
            text: newMessage.text,
            createdAt: new Date(),
            user: {
                _id: currentUser.uid,
                name: displayName,  // Store the displayName in Firestore
            },
        })
        .then(() => {
            console.log(`${displayName}: Message sent successfully`);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
    }
}, []); 



const renderBubble = (props: BubbleProps<IMessage>) => {
  const isCurrentUser = props.currentMessage?.user?._id === auth.currentUser?.uid;

  return (
      <View>
          <Text style={{
              color: 'black', 
              fontSize: 12, 
              padding: 5,
              textAlign: isCurrentUser ? 'right' : 'left'
          }}>
              {isCurrentUser ? (auth.currentUser?.displayName || 'Anónimo') : (props.currentMessage?.user?.name || 'Anónimo')}
          </Text>
          <Bubble
              {...props}
              wrapperStyle={{
                  left: { backgroundColor: '#E8E8E8' },
                  right: { backgroundColor: '#6495ED' }
              }}
              textStyle={{
                  left: { color: '#000' },
                  right: { color: '#fff' }
              }}
          />
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
      user={{ _id: auth.currentUser?.uid || 'anonymous' }}
      renderBubble={renderBubble}
    />
  );
  
}
