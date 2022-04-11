import * as React from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import PDFReader from 'rn-pdf-reader-js';

import Background from '../components/Background';
import BackButton from '../components/BackButton';

export default function PreviewFileScreen({ navigation, route }) {
  const { url } = route.params;
  return Platform.OS === 'web' ? (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <iframe src={url} height={'100%'} width={'100%'} />
    </Background>
  ) : (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <PDFReader
          source={{ uri: "http://gahp.net/wp-content/uploads/2017/09/sample.pdf" }}
        />
    </Background>
  );
}
