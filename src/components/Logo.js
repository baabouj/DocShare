import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { theme } from '../core/theme'

export default function Logo() {
  return (
    <View style={styles.image}>
      <Entypo name="documents" size={110} color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
});
