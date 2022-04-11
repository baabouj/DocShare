import React, { useContext } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { UserContext } from '../contexts/UserContext';

import { LoadingScreen, StartScreen, Dashboard } from '../screens';

import MainStackScreens from './MainStackScreens';
import AuthStackScreens from './AuthStackScreens';

export default function AppStackScreens() {
  const AppStack = createStackNavigator();
  const [user] = useContext(UserContext);

  return (
    <AppStack.Navigator headerMode="none">
      {user.isLoggedIn == null ? (
        <>
          <AppStack.Screen name="LoadingScreen" component={LoadingScreen} />
        </>
      ) : user.isLoggedIn ? (
        <>
        <AppStack.Screen name="Main" component={MainStackScreens} />
        </>
      ) : (
        <AppStack.Screen name="Auth" component={AuthStackScreens} />
      )}
    </AppStack.Navigator>
  );
}
