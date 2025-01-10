import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../App';
import MachineScreen from './MachineScreen';
import RawMaterialScreen from './RawMaterialScreen';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }: HomeScreenProps): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Scanner', { scannerType: 'QR' })}
        >
          <Text style={styles.buttonText}>QR Code Scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Scanner', { scannerType: 'Barcode' })}
        >
          <Text style={styles.buttonText}>Barcode Scanner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;