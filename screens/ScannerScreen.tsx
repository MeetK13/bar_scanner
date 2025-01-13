import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Camera, Code, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type ScannerScreenProps = {
  route: RouteProp<RootStackParamList, 'Scanner'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Scanner'>;
};

function ScannerScreen({ route, navigation }: ScannerScreenProps): JSX.Element {
  const { scannerType } = route.params;
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  // Added loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Added async permission handling
    const getPermission = async () => {
      try {
        await requestPermission();
      } catch (error) {
        console.error('Error requesting camera permission:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getPermission();
  }, [requestPermission]);

  // In ScannerScreen.tsx, modify the codeScanner:
const codeScanner = useCodeScanner({
  codeTypes: scannerType === 'QR' 
    ? ['qr']
    : ['ean-13', 'ean-8', 'code-128', 'upc-e', 'upc-a'],
  onCodeScanned: (codes: Code[]) => {
    try {
      if (codes.length > 0 && codes[0].value) {
        // Navigate to Machine for QR codes, Raw Material for barcodes
        navigation.navigate(scannerType === 'QR' ? 'Machine' : 'RawMaterial', {
          scannedData: codes[0].value,
          codeType: codes[0].type,
          timestamp: new Date().toLocaleString(),
        });
      }
    } catch (error) {
      console.error('Error scanning code:', error);
    }
  },
});

  // Added loading state check
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Added permission check
  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>Camera permission is required</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.centered}>
        <Text>Camera device not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={StyleSheet.absoluteFill} 
        device={device} 
        isActive={true} 
        codeScanner={codeScanner}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          {scannerType === 'QR' 
            ? 'Position the QR Code within the camera view' 
            : 'Position the Barcode within the camera view'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ScannerScreen;