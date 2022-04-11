import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../core/theme';

export default function Header(props) {
  return (
    <Text
      style={{
        fontSize: 21,
        fontWeight: 'bold',
        paddingVertical: 12,
        color: props.color || theme.colors.primary
      }}
      {...props}
    />
  );
}