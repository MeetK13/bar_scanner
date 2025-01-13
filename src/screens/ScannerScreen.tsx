import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ActivityIndicator, Alert} from 'react-native';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {getRawMaterialByBarcode} from '../services/rawMaterial';

type ScannerScreenProps = {
  route: RouteProp<RootStackParamList, 'Scanner'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Scanner'>;
};

function ScannerScreen({route, navigation}: ScannerScreenProps): JSX.Element {
  const {scannerType} = route.params;
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
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

  const codeScanner = useCodeScanner({
    codeTypes:
      scannerType === 'QR'
        ? ['qr']
        : ['ean-13', 'ean-8', 'code-128', 'upc-e', 'upc-a'],
    onCodeScanned: async (codes: Code[]) => {
      try {
        if (isProcessing) return; // Prevent multiple scans while processing
        if (codes.length > 0 && codes[0].value) {
          setIsProcessing(true);
          const barcodeId = codes[0].value;

          // Fetch raw material details
          const rawMaterialData = await getRawMaterialByBarcode(barcodeId);

          navigation.navigate('Details', {
            scannedData: barcodeId,
            codeType: codes[0].type,
            timestamp: new Date().toLocaleString(),
            rawMaterialDetails: rawMaterialData.data,
          });
        }
      } catch (error: any) {
        console.error('Error scanning code:', error);
        Alert.alert(
          'Error',
          error.message ||
            'Failed to fetch raw material details. Please try again.',
          [{text: 'OK'}],
        );
      } finally {
        setIsProcessing(false);
      }
    },
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

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
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
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
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});

export default ScannerScreen;
