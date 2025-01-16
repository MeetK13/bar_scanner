import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ScannerScreen from '../screens/ScannerScreen';
import DetailsScreen from '../screens/DetailsScreen';
import QRDetailsScreen from '../screens/QRDetailsScreen';
import MachineScreen from '../screens/MachineScreen';
import RawMaterialScreen from '../screens/RawMaterialScreen';
import { TabNavigator } from './TabNavigator';
import { useAuth } from '../Context/AuthContext';

export type RootStackParamList = {
  MainTabs: {
    screen: string;
    params: {
      user: any;  
    };
  } | undefined;
  Login: undefined;
  Home: undefined;
  Scanner: {scannerType: 'QR' | 'Barcode'};
  Details: {
    scannedData: string;
    codeType: string;
    timestamp: string;
    rawMaterialDetails?: {
      _id: string;
      lotNo: string;
      partNo: string;
      qty: number;
      usedQty: number;
      displayLotQty: string;
      mrnNo: string;
      barcodeId: string;
      isCompleted: boolean;
      rawMaterial: {
        name: string;
        description: string;
        category: string;
        partNo: string;
        quantityPer: number;
        units: string;
        maxQuantity: number;
        minimumQuantity: number;
        rate: number;
        reorderQuantity: number;
      };
    };
  };
  QRDetails: {
    scannedData: string;
    codeType: string;
    timestamp: string;
    machineDetails?: {
      _id: string;
      name: string;
      machineType: string;
      description: string;
      capacityOrSpec: string;
      identificationNo: string;
      make: string;
      location: string;
      InstallationOn: string;
      remarks?: string;
      productIdArr: string[];
      assemblyBool: boolean;
      loadingCapacity: string;
      createdAt: string;
      updatedAt: string;
      moulds: Array<{
        mouldId: string;
        mouldName: string;
      }>;
    };
  };
  Machine: { 
    scannedData: string;
    codeType: string;
    timestamp: string;
  };
  "RawMaterial": { 
    scannedData: string;
    codeType: string;
    timestamp: string;
  };  
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function StackNavigator() {
  const { isAuthorized } = useAuth();

  return (
    <Stack.Navigator 
      initialRouteName={isAuthorized ? "MainTabs" : "Login"}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {!isAuthorized ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen 
            name="Scanner" 
            component={ScannerScreen}
            options={{
              title: 'Scan Code',
            }}
          />
          <Stack.Screen 
            name="Details" 
            component={DetailsScreen}
            options={{
              title: 'Scan Details',
            }}
          />
          <Stack.Screen 
            name="QRDetails" 
            component={QRDetailsScreen}
            options={{
              title: 'QR Code Details',
            }}
          />
          <Stack.Screen 
            name="Machine" 
            component={MachineScreen}
            options={{
              title: 'Machine Details',
            }}
          />
          <Stack.Screen 
            name="RawMaterial" 
            component={RawMaterialScreen}
            options={{
              title: 'Raw Material Details',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}