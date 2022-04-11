import React, { useState, useContext } from 'react';

import {
  View,
  Platform,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import { v4 as uuidv4 } from 'uuid';
import { LinearProgress, ButtonGroup } from 'react-native-elements';
import { Modal, Portal } from 'react-native-paper';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { IconButton, Colors } from 'react-native-paper';

import Background from '../components/Background';
import TextInput from '../components/TextInput';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { nameValidator } from '../helpers/nameValidator';
import { fileValidator } from '../helpers/fileValidator';

import { LoadingScreen } from '../screens';

import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';

export default function HomeScreen({ navigation, route }) {
  const { file } = route.params;
  const [fileEmpty, setFileEmpty] = useState('');
  const [status, setStatus] = useState(file.status == 'public' ? 0 : 1);
  const buttons = ['Public', 'Private'];
  const [description, setDescription] = useState(file.description);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState({ value: file.name, error: '' });
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 40,
    padding: 20,
    borderRadius: 5,
  };

  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useContext(UserContext);

  const editFile = async () => {
    const nameError = nameValidator(name.value);
    const fileIsEmpty = fileValidator(file);
    if (nameError || fileIsEmpty) {
      setName({ ...name, error: nameError });
      setFileEmpty(fileIsEmpty);
      return;
    }
    showModal();
    try {
      const editedFile = {
        name: name.value,
        description,
        status: status ? 'private' : 'public',
        id: file.id,
      };
      await firebase.editFile(editedFile);
      hideModal();
      setName('');
      setDescription('');
      navigation.navigate('Home');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Background>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <Text
            style={{
              padding: 10,
              color: theme.colors.secondary,
              fontSize: 20,
              fontWeight: '500',
            }}>
            Editing...
          </Text>
        </Modal>
      </Portal>
      <BackButton goBack={navigation.goBack} />
      <Paragraph
        style={{
          fontSize: 28,
          fontWeight: '700',
          color: theme.colors.secondary,
          marginVertical: 50,
        }}>
        Edit File
      </Paragraph>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Description"
        returnKeyType="next"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <ButtonGroup
        onPress={(text) => setStatus(text)}
        selectedIndex={status}
        buttons={buttons}
        containerStyle={{
          backgroundColor: theme.colors.surface,
          width: '100%',
          height: 50,
          borderWidth: 1,
          borderColor: theme.colors.placeholder,
          marginVertical: 15,
        }}
        textStyle={{ fontSize: 16, fontWeight: 'normal' }}
        selectedButtonStyle={{ backgroundColor: theme.colors.secondary }}
      />
      <Button mode="contained" onPress={editFile}>
        Edit
      </Button>
    </Background>
  );
}
