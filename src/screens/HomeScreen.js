import React, { useContext, useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FAB, Portal } from 'react-native-paper';

import Searchbar from '../components/SearchBar';
import Header from '../components/Header';
import FilesList from '../components/FilesList';
import { theme } from '../core/theme';
import { SimpleLineIcons, Entypo } from '@expo/vector-icons';

import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';
import { LoadingScreen } from '../screens';

export default function HomeScreen({ navigation }) {
  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useContext(UserContext);
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [navigate, setNavigate] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(null);
  const [search, setSearch] = useState('');
  const [searchedFiles, setSearchedFiles] = useState([]);
  const filesRef = firebase.filesRef;
  useEffect(() => {
    const unsubscribe = filesRef
      .where('uid', '==', user.uid)
      .onSnapshot(getCollection);
  });
  const getCollection = (querySnapshot) => {
    let filesArr = [];
    querySnapshot.forEach((res) => {
      const data = res.data();
      data.id = res.id;
      filesArr.push(data);
    });
    filesArr = filesArr.sort((a, b) => b.uploadedAt - a.uploadedAt);
    setFiles(filesArr);
  };
  const searchFile = () => {
    if (search) {
      const searchedFile = files.map((file) => {
        const name = file.name.split('').slice(0, search.length).join('');
        const owner = file.owner.split('').slice(0, search.length).join('');
        if (name == search || owner == search) {
          return file;
        } else {
          return 0;
        }
      });
      setSearchedFiles(searchedFile.filter((item) => item !== 0));
    }
  };
  const logginOut = async () => {
    setLoading(true);
    const loggedOut = await firebase.logOut();
    if (loggedOut) {
      setUser((state) => ({ ...state, isLoggedIn: false }));
    }
    setLoading(false);
  };
  if (files == null || loading) {
    return <LoadingScreen />;
  }
  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent hidden={true} />
      <LinearGradient
        colors={['#B1CAF6', theme.colors.primary]}
        style={styles.linearGradient}>
        <View style={headerStyles.hader}>
          <Header color="white">DocSaver</Header>
          <View style={headerStyles.rightContainer}>
            <TouchableOpacity onPress={logginOut}>
              <SimpleLineIcons name="logout" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={topStyles.container}>
              <Text style={topStyles.nameText}>Hi, {user.name}</Text>
              <Text style={topStyles.welcomeText}>Welcome Back</Text>
            </View>

            <View style={styles.searchbarContainer}>
              <Searchbar
                onChangeText={(text) => {
                  setSearch(text);
                  searchFile();
                }}
                onPress={searchFile}
              />
            </View>

            <View style={styles.sectionTitleContainer}>
              <View style={sectionStyles.container}>
                <Text style={sectionStyles.section}>My Posts</Text>
                <Text style={sectionStyles.seeall}>See all</Text>
              </View>
            </View>
            <View style={styles.mainContainer}>
              <FilesList
                data={
                  search.length !== 0 && searchedFiles !== null
                    ? searchedFiles
                    : files
                }
                navigation={navigation}
              />
            </View>
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
    marginVertical: 31,
  },
});

const topStyles = StyleSheet.create({
  container: {
    marginTop: 28,
    marginBottom: 30,
    //backgroundColor: 'green',
  },
  nameText: {
    fontSize: 25,
    fontWeight: '400',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0.45,
    lineHeight: 40,
  },
});
const sectionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    color: '#363636',
    //fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'left',
    letterSpacing: 0.3,
    lineHeight: 27,
  },
  seeall: {
    color: '#5e5d5d',
    //fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    letterSpacing: 0.27,
    lineHeight: 27,
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
  rightContainer: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  leftContainer: {
    position: 'absolute',
    left: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 5,
  },
});
