import React, { useContext, useEffect } from 'react';
import { Image } from 'react-native';
import Background from '../components/Background';

import { UserContext } from '../contexts/UserContext';
import { FirebaseContext } from '../contexts/FirebaseContext';

export default function LoadingScreen() {
  const [_, setUser] = useContext(UserContext);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    setTimeout(async () => {
      const user = await firebase.getCurrentUser();

      if (user) {
        const userInfo = await firebase.getUserInfo(user.uid);
        const { name, email, isAdmin } = userInfo;

        setUser({
          isLoggedIn: true,
          uid: user.uid,
          name,
          email,
          isAdmin,
        });
      } else {
        setUser((state) => ({ ...state, isLoggedIn: false }));
      }
    }, 500);
  });

  return (
    <Background>
      <Image source={require('../assets/loadingAnimation.gif')} />
    </Background>
  );
}
