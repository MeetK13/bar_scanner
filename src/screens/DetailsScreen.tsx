import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type DetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'Details'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Details'>;
};

// Added better error handling and type checking
function parseQRData(data: string): Record<string, string> {
  try {
    const parsed = JSON.parse(data);
    return typeof parsed === 'object' ? parsed : {content: data};
  } catch {
    try {
      const url = new URL(data);
      return {
        type: 'URL',
        url: url.href,
        hostname: url.hostname,
        pathname: url.pathname,
        search: url.search,
      };
    } catch {
      return {
        type: 'Plain Text',
        content: data,
      };
    }
  }
}

function DetailsScreen({route, navigation}: DetailsScreenProps): JSX.Element {
  const {scannedData, codeType, timestamp, rawMaterialDetails} = route.params;
  const parsedData = parseQRData(scannedData);

  // share functionality
  const handleShare = async () => {
    try {
      const shareData = rawMaterialDetails
        ? {
            barcode: scannedData,
            material: rawMaterialDetails.rawMaterial.name,
            description: rawMaterialDetails.rawMaterial.description,
            quantity: `${rawMaterialDetails.qty} ${rawMaterialDetails.rawMaterial.units}`,
            timestamp: timestamp,
          }
        : parsedData;

      await Share.share({
        message: `Scanned ${codeType} at ${timestamp}:\n${JSON.stringify(
          shareData,
          null,
          2,
        )}`,
      });
    } catch (error) {
      console.error('Error sharing data:', error);
    }
  };

  const renderRawMaterialDetails = () => {
    if (!rawMaterialDetails) return null;

    const {rawMaterial} = rawMaterialDetails;

    return (
      <View style={styles.materialSection}>
        <Text style={styles.sectionTitle}>Raw Material Details</Text>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Material Name:</Text>
          <Text style={styles.value}>{rawMaterial.name}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{rawMaterial.description}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{rawMaterial.category}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Part Number:</Text>
          <Text style={styles.value}>{rawMaterial.partNo}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Quantity Details:</Text>
          <Text style={styles.value}>
            {rawMaterialDetails.qty} {rawMaterial.units}
            (Used: {rawMaterialDetails.usedQty} {rawMaterial.units})
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>MRN Number:</Text>
          <Text style={styles.value}>{rawMaterialDetails.mrnNo}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Stock Limits:</Text>
          <Text style={styles.value}>
            Min: {rawMaterial.minimumQuantity} {rawMaterial.units}
            {'\n'}
            Max: {rawMaterial.maxQuantity} {rawMaterial.units}
            {'\n'}
            Reorder at: {rawMaterial.reorderQuantity} {rawMaterial.units}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Rate:</Text>
          <Text style={styles.value}>₹{rawMaterial.rate}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {rawMaterialDetails
              ? 'Raw Material Details'
              : 'Scanned Code Details'}
          </Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Code Type:</Text>
          <Text style={styles.value}>{codeType}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Barcode ID:</Text>
          <Text style={styles.value} selectable={true}>
            {scannedData}
          </Text>
        </View>

        {rawMaterialDetails
          ? renderRawMaterialDetails()
          : Object.entries(parsedData).map(([key, value]) => (
              <View key={key} style={styles.infoSection}>
                <Text style={styles.label}>{key}:</Text>
                <Text style={styles.value} selectable={true}>
                  {value}
                </Text>
              </View>
            ))}

        <TouchableOpacity
          style={[styles.button, styles.shareButton]}
          onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Scanner', {
              scannerType: codeType === 'qr' ? 'QR' : 'Barcode',
            })
          }>
          <Text style={styles.buttonText}>Scan Another Code</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  materialSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoSection: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  shareButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailsScreen;
