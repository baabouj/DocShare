import React, { createContext } from 'react';

import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import config from '../../firebase/config';

const FirebaseContext = createContext();

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.firestore();
const storage = firebase.storage();

const Firebase = {
  storage,
  storageRef: storage.ref(),
  usersRef: db.collection('users'),
  filesRef: db.collection('files'),
  messagesRef: db.collection('messages'),
  getCurrentUser: () => {
    return firebase.auth().currentUser;
  },
  createUser: async (user) => {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password);

      const uid = Firebase.getCurrentUser().uid;

      await db.collection('users').doc(uid).set({
        name: user.name,
        email: user.email,
        isAdmin: false,
      });

      return { ...user, uid };
    } catch (error) {
      alert(error.message);
    }
  },
  saveFile: async (file, owner) => {
    try {
      await db.collection('files').doc().set({
        uid: owner.uid,
        owner: owner.name,
        downloadURL: file.downloadURL,
        uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
        name: file.name,
        description: file.description,
        status: file.status,
      });
    } catch (error) {
      alert(error.message);
    }
  },
  sendMessage: async (message, uid, isAdmin) => {
    try {
      await db.collection('messages').doc().set({
        sender: message.sender,
        content: message.content,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        isAdmin,
      });
    } catch (error) {
      alert(error);
    }
  },
  getUserInfo: async (uid) => {
    try {
      const user = await db.collection('users').doc(uid).get();
      if (user.exists) {
        return { ...user.data() };
      }
    } catch (error) {
      alert(error);
    }
  },
  deleteUser: async (uid) => {
    try {
      await db
        .collection('users')
        .doc(uid)
        .delete()
        .then((res) => {
          alert('User is removed successfully');
        });
    } catch (error) {
      alert(error);
    }
  },
  makeAdmin: async (uid) => {
    try {
      await db.collection('users').doc(uid).update({
        isAdmin: true,
      });
    } catch (error) {
      alert(error.message);
    }
  },
  editFile: async (file) => {
    try {
      let { name, description, status, id } = file;

      await db.collection('files').doc(id).update({
        name,
        description,
        status,
        id,
      });
    } catch (error) {
      alert(error.message);
    }
  },
  deleteFile: async (uid) => {
    try {
      await db
        .collection('files')
        .doc(uid)
        .delete()
        .then((res) => {
          alert('File is Deleted');
        });
    } catch (error) {
      alert(error);
    }
  },
  logIn: async (email, password) => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  },
  logOut: async () => {
    try {
      await firebase.auth().signOut();

      return true;
    } catch (error) {
      alert(error);
    }
    return false;
  },
};

const FirebaseProvider = (props) => {
  return (
    <FirebaseContext.Provider value={Firebase}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider };
