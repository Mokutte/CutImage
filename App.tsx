/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropper from './CutImage';

function App(): React.JSX.Element {

  return (
    <SafeAreaView>
  
        <ImageCropper
          source={{
            uri: 'https://files.oaiusercontent.com/file-bhQRX2dhgF4FPvupJi6vx3mJ?se=2024-02-15T01%3A07%3A19Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3Dbe2856a7-cf75-4d39-990b-ad286f7a1d54.webp&sig=g/neio1ALfHxOiUo4oTZyErJhl8jN63ZQkIZDQ%2B16NM%3D',
          }}
        />

       
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
});

export default App;
