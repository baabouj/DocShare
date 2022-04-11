import React, { useState, useContext, useEffect, useRef } from 'react';

import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Easing,
  SafeAreaViewBase,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
const { width, height } = Dimensions.get('screen');

import {
  FontAwesome5,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { Modal, Portal, IconButton } from 'react-native-paper';

import Background from './Background';
import Paragraph from './Paragraph';
import Button from './Button';
import Header from './Header';

import { theme } from '../core/theme';

import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';

import { LoadingScreen } from '../screens';

import * as WebBrowser from 'expo-web-browser';

export default function FilesScreen({ navigation, data }) {
  const [modal, setModal] = useState({ visible: false, data: [] });
  const firebase = useContext(FirebaseContext);
  const [user] = useContext(UserContext);
  const [files, setfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchedfiles, setSearchedfiles] = useState([]);
  const showModal = (data) => setModal({ visible: true, data });
  const hideModal = () => setModal({ visible: false, data: [] });

  const SPACING = 20;
  const AVATAR_SIZE = 70;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

  const scrollY = useRef(new Animated.Value(0)).current;
  if (data.length == 0) {
    return (
      <Background>
        <Paragraph>No Files Uploaded</Paragraph>
      </Background>
    );
  }
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Portal>
        <Modal
          visible={modal.visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.96)',
            margin: 20,
            padding: 20,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            overflow: 'auto',
          }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: '700', margin: 5 }}>
              {modal.data.name}
            </Text>
            <Text style={{ fontSize: 18, opacity: 0.7, margin: 1 }}>
              {modal.data.description || 'no description'}
            </Text>
            <Text
              style={{
                fontSize: 12,
                opacity: 0.7,
                color: '#0099cc',
                textAlign: 'center',
              }}>
              {modal.data.owner}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 1,
              }}>
              <IconButton
                icon="file-download-outline"
                color={theme.colors.primary}
                size={30}
                onPress={() =>
                  WebBrowser.openBrowserAsync(modal.data.downloadURL)
                }
              />
              <IconButton
                icon="file-find-outline"
                color={theme.colors.primary}
                size={30}
                onPress={() => {
                  navigation.navigate('PreviewFile', {
                    url: modal.data.downloadURL,
                  });
                  hideModal();
                }}
              />
              {modal.data.uid == user.uid && (
                <>
                  <IconButton
                    icon="file-edit-outline"
                    color={theme.colors.primary}
                    size={30}
                    onPress={() => {
                      navigation.navigate('EditFile', { file: modal.data });
                      hideModal();
                    }}
                  />
                  <IconButton
                    icon="file-remove-outline"
                    color={theme.colors.primary}
                    size={30}
                    onPress={async () => {
                      setLoading(true);
                      await firebase.deleteFile(modal.data.id);
                      setLoading(false);
                      hideModal();
                    }}
                  />
                </>
              )}
            </View>
          </View>
        </Modal>
      </Portal>
      <Animated.FlatList
        data={data}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{}}
        renderItem={({ item, index }) => {
          const inputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 2),
          ];
          const opacityInputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 0.5),
          ];
          const scale = scrollY.interpolate({
            inputRange: opacityInputRange,
            outputRange: [1, 1, 1, 0],
          });
          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0],
          });
          return (
            <Animated.View
              style={{
                flexDirection: 'row',
                margin: SPACING,
                marginLeft: 10,
                padding: SPACING,
                marginTop: 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                opacity,
                transform: [{ scale }],
                overflow: 'hidden',
              }}>
              <View style={{ marginRight: 12 }}>
                <MaterialCommunityIcons
                  name="file"
                  size={50}
                  color={theme.colors.primary}
                />
              </View>
              <TouchableOpacity
                style={{
                  flex: 1,
                }}
                onPress={() => showModal(item)}>
                <View>
                  <Text style={{ fontSize: 22, fontWeight: '600' }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 18, opacity: 0.7 }}>
                    {item.description || 'no description'}
                  </Text>
                  <Text
                    style={{
                      color: '#0099cc',
                      fontSize: 11,
                      fontWeight: '400',
                      fontStyle: 'normal',
                      textAlign: 'left',
                      letterSpacing: 0.12,
                      lineHeight: 19,
                    }}>
                    {item.owner}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
