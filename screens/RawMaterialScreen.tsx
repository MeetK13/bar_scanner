import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function RawMaterialScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>Raw Material Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RawMaterialScreen;