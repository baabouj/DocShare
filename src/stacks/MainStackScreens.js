import React, { useContext } from 'react';
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '../core/theme';
import {
  HomeScreen,
  UploadFileScreen,
  AllFilesScreen,
  ChatScreen,
  EditFileScreen,
  PreviewFileScreen,
  UsersScreen,
} from '../screens';

import {
  Feather,
  Ionicons,
  AntDesign,
  SimpleLineIcons,
} from '@expo/vector-icons';

import { UserContext } from '../contexts/UserContext';

const MainStack = createStackNavigator();

function MainStackTabs() {
  const [user] = useContext(UserContext);
  const MainStackTabs = createBottomTabNavigator();
  const tabBarOptions = {
    showLabel: false,
    style: {
      paddingBottom: 12,
      backgroundColor: '#B1CAF6',
    },
  };

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused }) => {
      let iconName = '';
      switch (route.name) {
        case 'Home':
          return (
            <AntDesign
              name="home"
              size={28}
              color={focused ? '#560CCE' : '#204ae2'}
            />
          );
        case 'AllFiles':
          return (
            <Ionicons
              name="documents-outline"
              size={28}
              color={focused ? '#560CCE' : '#204ae2'}
            />
          );
        case 'Chat':
          return (
            <Ionicons
              name="chatbox-outline"
              size={28}
              color={focused ? '#560CCE' : '#204ae2'}
            />
          );
        case 'UploadFile':
          return (
            <Feather
              name="upload"
              size={28}
              color={focused ? '#560CCE' : '#204ae2'}
            />
          );
        case 'Users':
          return (
            <SimpleLineIcons
              name="people"
              size={28}
              color={focused ? '#560CCE' : '#204ae2'}
            />
          );
        default:
          return (
            <AntDesign
              name="home"
              size={28}
              color={focused ? '#560CCE' : '#204ae2'}
            />
          );
      }
    },
  });
  return (
    <MainStackTabs.Navigator
      initialRouteName="Home"
      tabBarOptions={tabBarOptions}
      screenOptions={screenOptions}>
      <MainStackTabs.Screen name="Home" component={HomeScreen} />
      <MainStackTabs.Screen name="AllFiles" component={AllFilesScreen} />
      <MainStackTabs.Screen name="Chat" component={ChatScreen} />
      <MainStackTabs.Screen name="UploadFile" component={UploadFileScreen} />
      {user.isAdmin && (
        <MainStackTabs.Screen name="Users" component={UsersScreen} />
      )}
    </MainStackTabs.Navigator>
  );
}

export default function MainStackScreen() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <MainStack.Screen name="Main" component={MainStackTabs} />
      <MainStack.Screen name="EditFile" component={EditFileScreen} />
      <MainStack.Screen name="PreviewFile" component={PreviewFileScreen} />
    </MainStack.Navigator>
  );
}
