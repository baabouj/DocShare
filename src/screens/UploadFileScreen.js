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

export default function HomeScreen({ navigation }) {
  const [file, setFile] = useState('');
  const [fileEmpty, setFileEmpty] = useState('');
  const [status, setStatus] = useState(0);
  const buttons = ['Public', 'Private'];
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState({ value: '', error: '' });
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
  const pickFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({});
      const path = normalizePath(file.uri);
      setFile(path);
    } catch (error) {
      alert(error);
    }
  };
  const uploadFile = async () => {
    const nameError = nameValidator(name.value);
    const fileIsEmpty = fileValidator(file);
    if (nameError || fileIsEmpty) {
      setName({ ...name, error: nameError });
      setFileEmpty(fileIsEmpty);
      return;
    }
    try {
      const response = await fetch(file);
      const blob = await response.blob();
      const childPath = `files/${user.uid}/${uuidv4()}`;
      const uploadTask = firebase.storageRef.child(childPath).put(blob);
      showModal();
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setProgress(snapshot.bytesTransferred / snapshot.totalBytes);
        },
        (error) => {
          hideModal();
          alert(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            const newFile = {
              downloadURL,
              name: name.value,
              description,
              status: status ? 'private' : 'public',
            };
            setIsLoaded(true);
            await firebase.saveFile(newFile, user);
            hideModal();
            setFile('');
            setName('');
            setDescription('');
            navigation.navigate('Home');
          });
        }
      );
    } catch (error) {
      alert(error);
    }
  };

  const normalizePath = (path) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const filePrefix = 'file://';
      if (path.startWith(filePrefix)) {
        path = path.substring(filePrefix.length);
        try {
          path = decodeURI(path);
        } catch (error) {
          alert(error);
        }
      }
    }
    return path;
  };

  return (
    <Background>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <Image
            style={{ flex: 1, justifyContent: 'center', marginBottom: 15 }}
            source={require('../assets/uploading.gif')}
          />
          <LinearProgress
            color={theme.colors.primary}
            variant="determinate"
            value={progress}
            trackColor={theme.colors.secondary}
          />
          <Text
            style={{
              padding: 10,
              color: theme.colors.secondary,
              fontSize: 20,
              fontWeight: '500',
            }}>
            {isLoaded ? 'Saving...' : Math.round(progress * 100) + '%'}
          </Text>
        </Modal>
      </Portal>
      <Paragraph
        style={{
          fontSize: 28,
          fontWeight: '700',
          color: theme.colors.secondary,
          marginVertical: 50,
        }}>
        Upload File
      </Paragraph>
      <Button mode="outlined" onPress={pickFile} uppercase={false}>
        {file ? (
          <Entypo name="check" size={24} color={theme.colors.primary} />
        ) : (
          <AntDesign name="addfile" size={24} color={theme.colors.primary} />
        )}{' '}
        {'     '}
        Choose a file
      </Button>
      {fileEmpty ? (
        <View style={styles.container}>
          <Text style={styles.error}>{fileEmpty}</Text>
        </View>
      ) : null}
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
      <Button mode="contained" onPress={uploadFile}>
        upload
      </Button>
    </Background>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
});
