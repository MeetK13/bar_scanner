import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

function MachineScreen(): JSX.Element {
  return (
    <View style={styles.container}>
    <Text>Machine Screen</Text>
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

export default MachineScreen;