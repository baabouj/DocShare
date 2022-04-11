import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-native-paper';

import { theme } from './src/core/theme';

import { UserProvider } from './src/contexts/UserContext';
import { FirebaseProvider } from './src/contexts/FirebaseContext';

import AppStackScreens from './src/stacks/AppStackScreens';

export default function App() {
  return (
    <Provider theme={theme}>
      <FirebaseProvider>
        <UserProvider>
          <NavigationContainer>
            <AppStackScreens />
          </NavigationContainer>
        </UserProvider>
      </FirebaseProvider>
    </Provider>
  );
}
