import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import DetailsScreen from './screens/DetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  Scanner: { scannerType: 'QR' | 'Barcode' };
  Details: { 
    scannedData: string;
    codeType: string;
    timestamp: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
