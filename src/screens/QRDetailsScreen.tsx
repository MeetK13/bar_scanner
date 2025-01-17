import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../Navigator/StackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { MultiSelect,Dropdown } from 'react-native-element-dropdown';
import { QRRawMaterial } from '../services/QRRawMaterial';

type QRDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'QRDetails'>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

interface Material {
  label: string;
  value: string;
}



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

function QRDetailsScreen({route, navigation}: QRDetailsScreenProps): JSX.Element {
  if (!route.params) {
    return (
      <View style={styles.centered}>
        <Text>No scan data available</Text>
      </View>
    );
  }

  const {scannedData, codeType, timestamp, machineDetails} = route.params;
  const parsedData = parseQRData(scannedData);

  //state to store selected mould and corresponding mould number
  const [selectedMould, setSelectedMould] = useState<string | null>(null);
  const [mouldNumber, setMouldNumber] = useState<string | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [rawMaterials, setRawMaterials] = useState<Material[]>([]);
  const [operatorName, setOperatorName] = useState<string>('');
  const [isFocus, setIsFocus] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState<boolean>(false); //for loading indecator

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoadingMaterials(true);
        const response = await QRRawMaterial();
        setRawMaterials(response.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoadingMaterials(false);
      }
    };
  
    loadMaterials();
  }, []); // Runs once when the component mounts

  const handleSubmit = () => {
    // Handle form submission
    console.log('Operator Name:', operatorName);
    // Add logic here, such as sending data to a server, database, etc.
  };

  const handleShare = async () => {
    try {
      const shareData = machineDetails
        ? {
            qrCode: scannedData,
            machineName: machineDetails.name,
            machineType: machineDetails.machineType,
            location: machineDetails.location,
            identificationNo: machineDetails.identificationNo,
            moulds: machineDetails.moulds?.map(m => m.mouldName),
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

  const renderMachineDetails = () => {
    if (!machineDetails) return null;

    return (
      <View style={styles.materialSection}>
        <Text style={styles.sectionTitle}>Machine Details</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>

        <View style={styles.infoSection}>
        <Text style={styles.label}>M/C NO. / Name:</Text>
        <TextInput
          style={[styles.textBox, styles.uneditableTextInput]}
          value={machineDetails.name}
          editable={false} // uneditable
        />
      </View>

        <View style={styles.infoSection}>
        <Text style={styles.label}>Mould Name:</Text>

        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={machineDetails.moulds.map(mould => ({
            label: mould.mouldName,
            value: mould.mouldId,
            number: mould.mouldNumber,
          }))} // Transforming moulds into the format required by Dropdown
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Mould' : '...'}
          value={selectedMould}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelectedMould(item.value);
            setMouldNumber(item.number);
            setIsFocus(false);
          }}
        />
      </View>

      {mouldNumber !== null && (
        <View style={styles.infoSection}>
          <Text style={styles.label}>Mould Number:</Text>
          <TextInput
            style={[styles.textBox, styles.uneditableTextInput]}
            value={mouldNumber ? mouldNumber.toString() : 'Not Available'}
            editable={false} // Make it uneditable
          />
        </View>
      )}

<Text style={styles.label}>Material</Text>
        {loadingMaterials ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <MultiSelect
            style={styles.dropdown}
            data={rawMaterials} // fetching raw materials 
            labelField="label"
            valueField="value"
            placeholder="Search items..."
            searchPlaceholder="Search items..."
            value={selectedMaterials}
            onChange={items => setSelectedMaterials(items)}
            renderSelectedItem={(item, unSelect) => (
              <View style={styles.selectedItem}>
                <Text>{item.label}</Text>
                {unSelect && (
                  <Text style={styles.removeText} onPress={() => unSelect(item)}>
                    x
                  </Text>
                )}
              </View>
            )}
            selectedStyle={styles.selectedItems}
            search
          />
        )}

        <View style={styles.infoSection}>
          <Text style={styles.label}>Operator Name:</Text>
          <TextInput
            style={[styles.textBox, styles.operatorInput]}  
            value={operatorName}
            onChangeText={setOperatorName}  // Updates the state when user types
            placeholder="Enter Operator Name..."
            placeholderTextColor="#000" 
          />
        </View>

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Machine Type:</Text>
          <Text style={styles.value}>{machineDetails.machineType}</Text>
        </View> */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{machineDetails.description}</Text>
        </View> */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Capacity/Specifications:</Text>
          <Text style={styles.value}>{machineDetails.capacityOrSpec}</Text>
        </View> */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Identification Number:</Text>
          <Text style={styles.value}>{machineDetails.identificationNo}</Text>
        </View> */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Make:</Text>
          <Text style={styles.value}>{machineDetails.make}</Text>
        </View> */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{machineDetails.location}</Text>
        </View> */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Installation Date:</Text>
          <Text style={styles.value}>
            {new Date(machineDetails.InstallationOn).toLocaleDateString()}
          </Text>
        </View> */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Loading Capacity:</Text>
          <Text style={styles.value}>{machineDetails.loadingCapacity}</Text>
        </View> */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Assembly Required:</Text>
          <Text style={styles.value}>
            {machineDetails.assemblyBool ? 'Yes' : 'No'}
          </Text>
        </View> */}

        {/* {machineDetails.remarks && (
          <View style={styles.infoSection}>
            <Text style={styles.label}>Remarks:</Text>
            <Text style={styles.value}>{machineDetails.remarks}</Text>
          </View>
        )} */}

        {/* {machineDetails.moulds && machineDetails.moulds.length > 0 && (
          <View style={styles.infoSection}>
            <Text style={styles.label}>Associated Moulds:</Text>
            {machineDetails.moulds.map((mould, index) => (
              <Text key={mould.mouldId} style={styles.value}>
                {index + 1}. {mould.mouldName}
              </Text>
            ))}
          </View>
        )} */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Last Updated:</Text>
          <Text style={styles.value}>
            {new Date(machineDetails.updatedAt).toLocaleString()}
          </Text>
        </View> */}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* <View style={styles.header}>
          <Text style={styles.headerText}>
            {machineDetails ? 'Machine Details' : 'Scanned QR Code Details'}
          </Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View> */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Code Type:</Text>
          <Text style={styles.value}>{codeType}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>QR Code:</Text>
          <Text style={styles.value} selectable={true}>
            {scannedData}
          </Text>
        </View> */}

        {machineDetails
          ? renderMachineDetails()
          : Object.entries(parsedData).map(([key, value]) => (
              <View key={key} style={styles.infoSection}>
                <Text style={styles.label}>{key}:</Text>
                <Text style={styles.value} selectable={true}>
                  {value}
                </Text>
              </View>
            ))}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.shareButton]}
          onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Scanner', {
              scannerType: 'QR',
            })
          }>
          <Text style={styles.buttonText}>Scan Another QR Code</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 3,
  },
  removeText: {
    color: '#666',
    paddingLeft: 10,
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#D3D3D3',
    color: '#333',
  },
  uneditableTextInput: {
    color: '#333',
    backgroundColor: '#f0f0f0',
  },
  operatorInput: {
    backgroundColor: '#f5f5f5',
    color: '#fff',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#666',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    // Removed marginTop, paddingTop, and borderTopWidth
    marginBottom: 12,
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

export default QRDetailsScreen;