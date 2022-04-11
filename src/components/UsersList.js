import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, IconButton, Portal } from 'react-native-paper';

import Background from './Background';
import Paragraph from './Paragraph';
import Searchbar from './SearchBar';
import FilesList from './FilesList';
import { theme } from '../core/theme';
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';
import { LoadingScreen } from '../screens';

export default function HomeScreen({ navigation, users }) {
  const firebase = useContext(FirebaseContext);
  const [user] = useContext(UserContext);

  const [modal, setModal] = useState({ visible: false, data: [] });
  const [loading, setLoading] = useState(false);

  const showModal = (data) => setModal({ visible: true, data });
  const hideModal = () => setModal({ visible: false, data: [] });

  if (users.length == 0) {
    return (
      <Background>
        <Paragraph>No Users Found</Paragraph>
      </Background>
    );
  }
  const SPACING = 20;
  const AVATAR_SIZE = 70;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
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
                    {modal.data.email}
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
                      icon="account-plus-outline"
                      color={theme.colors.primary}
                      size={30}
                      onPress={async () => {
                        setLoading(true);
                        await firebase.makeAdmin(modal.data.id);
                        setLoading(false);
                        hideModal();
                      }}
                    />
                    <IconButton
                      icon="account-remove-outline"
                      color={theme.colors.primary}
                      size={30}
                      onPress={async () => {
                        setLoading(true);
                        await firebase.deleteUser(modal.data.id);
                        setLoading(false);
                        hideModal();
                      }}
                    />
                  </View>
                </View>
              </Modal>
            </Portal>
            <Animated.FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
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
                      overflow: 'hidden',
                    }}>
                    <View style={{ marginRight: 12 }}>
                      {item.isAdmin ? (
                        <MaterialCommunityIcons
                          name="shield-account-outline"
                          size={40}
                          color={theme.colors.primary}
                        />
                      ) : (
                        <SimpleLineIcons
                          name="user"
                          size={30}
                          color={theme.colors.primary}
                        />
                      )}
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
                          {item.email}
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

