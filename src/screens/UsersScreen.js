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

import Background from '../components/Background';
import Paragraph from '../components/Paragraph';
import Searchbar from '../components/SearchBar';
import Header from '../components/Header';
import UsersList from '../components/UsersList';
import { theme } from '../core/theme';
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';
import { LoadingScreen } from '../screens';

export default function HomeScreen({ navigation }) {
  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useContext(UserContext);

  const [modal, setModal] = useState({ visible: false, data: [] });
  const insets = useSafeAreaInsets();
  const [navigate, setNavigate] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setusers] = useState(null);
  const [search, setSearch] = useState('');
  const [searchedusers, setSearchedusers] = useState([]);
  const usersRef = firebase.usersRef;
  useEffect(() => {
    const unsubscribe = usersRef.onSnapshot(getCollection);
  });
  const getCollection = (querySnapshot) => {
    let userArr = [];
    querySnapshot.forEach((res) => {
      const data = res.data();
      data.id = res.id;
      userArr.push(data);
    });
    userArr = userArr.sort((a, b) => b.name < a.name);
    setusers(userArr);
  };

  const showModal = (data) => setModal({ visible: true, data });
  const hideModal = () => setModal({ visible: false, data: [] });

  const searchuser = () => {
    if (search) {
      const searcheduser = users.map((user) => {
        const name = user.name.split('').slice(0, search.length).join('');
        const owner = user.owner.split('').slice(0, search.length).join('');
        if (name == search || owner == search) {
          return user;
        } else {
          return 0;
        }
      });
      setSearchedusers(searcheduser.filter((item) => item !== 0));
    }
  };

  const logginOut = async () => {
    const loggedOut = await firebase.logOut();

    if (loggedOut) {
      setUser((state) => ({ ...state, isLoggedIn: false }));
    }
  };
  if (users == null || loading) {
    return <LoadingScreen />;
  }
  if (
    users.length == 0 ||
    (search.length !== 0 && searchedusers !== null && searchedusers.length == 0)
  ) {
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
    <View style={styles.mainContainer}>
      <StatusBar translucent hidden={true} />
      <LinearGradient
        colors={['#B1CAF6', theme.colors.primary]}
        style={styles.linearGradient}>
        <View style={headerStyles.hader}>
          <Header color="white">DocSaver</Header>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={topStyles.container}>
              <Text style={topStyles.welcomeText}>ALL USERS</Text>
            </View>
            <View style={styles.searchbarContainer}>
              <Searchbar
                onChangeText={(text) => {
                  setSearch(text);
                  searchuser();
                }}
                onPress={searchuser}
              />
            </View>
            <View style={styles.sectionTitleContainer} />
            <UsersList
              users={
                search.length !== 0 && searchedusers !== null
                  ? searchedusers
                  : users
              }
              navigation={navigation}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  linearGradient: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 10,
    paddingLeft: 25,
  },
  searchbarContainer: {
    paddingRight: 25,
  },
  sectionTitleContainer: {
    paddingRight: 25,
    marginVertical: 20,
  },
});

const topStyles = StyleSheet.create({
  container: {
    marginTop: 28,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0.45,
    lineHeight: 40,
  },
});
const headerStyles = StyleSheet.create({
  hader: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
});

