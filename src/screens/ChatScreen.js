import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import BackButton from '../components/BackButton';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { theme } from '../core/theme';
import { Avatar } from 'react-native-elements';

import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';

import { LoadingScreen } from '../screens';

const ChatScreen = ({ navigation }) => {
  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useContext(UserContext);
  const scrollRef = useRef();
  const [messages, setMessages] = useState(null);
  const [message, setMessage] = useState({ content: '', sender: '' });

  const messagesRef = firebase.messagesRef;

  useEffect(() => {
    const unsubscribe = messagesRef
      .orderBy('creation')
      .onSnapshot(getCollection);
  });
  const getCollection = (querySnapshot) => {
    const messagesArr = [];
    querySnapshot.forEach((res) => {
      const data = res.data();
      data.id = res.id;
      messagesArr.push(data);
    });
    setMessages(messagesArr);
  };
  const sendMessage = async () => {
    Keyboard.dismiss();
    if (message.content) await firebase.sendMessage(message, user.uid, user.isAdmin);
    setMessage({ content: '', sender: '' });
  };
  if (messages == null) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.surface,
        paddingTop: StatusBar.currentHeight,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={90}>
        <TouchableNativeFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <>
            <View style={styles.header}>
              <View style={(styles.container, { marginLeft: 10 })}>
                <Text style={{ fontSize: 20, fontWeight: '600' }}>
                  Group Chat
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '400', opacity: 0.7 }}>
                  {messages?.[messages.length - 1]?.uid == user.uid
                    ? 'You'
                    : messages?.[messages.length - 1]?.sender}
                  : {messages?.[messages.length - 1]?.content}
                </Text>
              </View>
            </View>
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                flexGrow: 1,
                paddingTop: 15,
              }}
              ref={scrollRef}
              onContentSizeChange={() =>
                scrollRef.current.scrollToEnd({ animated: true })
              }
              showsVerticalScrollIndicator={false}>
              {messages.map((message) =>
                message.uid == user.uid ? (
                  <View key={message.id} style={styles.sender}>
                    <Text style={styles.sendedText}>{message.content}</Text>
                  </View>
                ) : (
                  <View style={styles.receiver}>
                    <Text style={styles.recieverName}>
                      {message.isAdmin && (
                        <Entypo name="shield" size={18} color="black" />
                      )}
                      {message.sender}
                    </Text>
                    <Text style={styles.recievedText}>{message.content}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={message.content}
                onChangeText={(text) =>
                  setMessage({ content: text, sender: user.name })
                }
                onSubmitEditing={sendMessage}
                placeholder="Type message ..."
                style={styles.textInput}
              />
              <TouchableOpacity onPress={sendMessage}>
                <Ionicons name="send" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </>
        </TouchableNativeFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sender: {
    padding: 15,
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
  receiver: {
    padding: 15,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 20,
    margin: 15,
    maxWidth: '80%',
    position: 'relative',
  },
  recieverName: {
    opacity: 0.6,
  },
  sendedText: {
    color: '#fff',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: '#fff',
    padding: 10,
    color: '#121212',
    borderRadius: 30,
  },
});

export default ChatScreen;
