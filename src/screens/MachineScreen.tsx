import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';


type MachineScreenRouteProp = RouteProp<RootStackParamList, 'Machine'>;

function MachineScreen(): JSX.Element {
  const route = useRoute<MachineScreenRouteProp>();
  const params = route.params;

  // Show placeholder when no scan data is available
  if (!params) {
    return (
      <View style={styles.container}>
        <Text>Please scan a QR code to view machine details</Text>
      </View>
    );
  }

  function parseQRData(data: string): Record<string, string> {
    try {
      const parsed = JSON.parse(data);
      return typeof parsed === 'object' ? parsed : { content: data };
    } catch {
      try {
        const url = new URL(data);
        return {
          type: 'URL',
          url: url.href,
          hostname: url.hostname,
          pathname: url.pathname,
          search: url.search
        };
      } catch {
        return {
          type: 'Plain Text',
          content: data
        };
      }
    }
  }

  const { scannedData, codeType, timestamp } = params;
  const parsedData = parseQRData(scannedData); // Reuse the parseQRData function from DetailsScreen

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Scanned ${codeType} at ${timestamp}:\n${JSON.stringify(parsedData, null, 2)}`,
      });
    } catch (error) {
      console.error('Error sharing data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Machine Details</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.label}>Code Type:</Text>
          <Text style={styles.value}>{codeType}</Text>
        </View>

        {Object.entries(parsedData).map(([key, value]) => (
          <View key={key} style={styles.infoSection}>
            <Text style={styles.label}>{key}:</Text>
            <Text style={styles.value} selectable={true}>{value}</Text>
          </View>
        ))}

        <TouchableOpacity 
          style={[styles.button, styles.shareButton]}
          onPress={handleShare}
        >
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Add the same styles as in DetailsScreen
const styles = StyleSheet.create({
  // Copy all styles from DetailsScreen.tsx
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
  // Added share button style
  shareButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MachineScreen;