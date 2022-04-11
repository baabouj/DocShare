import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import { theme } from '../core/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Searchbar({ onChangeText, onPress }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchText}
        placeholder="Search..."
        onChangeText={onChangeText}
      />

      <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
      <Ionicons name="search" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 10, height: 0 },
    shadowRadius: 15,
    shadowOpacity: 0.8,
    elevation: 5,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#204ae2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchText: {
    flex: 1,
    color: '#121212',
    //fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    letterSpacing: 1.05,
    lineHeight: 27,
    marginLeft: 15,
  },
});
