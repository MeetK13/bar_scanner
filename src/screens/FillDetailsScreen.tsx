import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { MultiSelect, Dropdown } from 'react-native-element-dropdown';

interface MouldName {
  label: string;
  value: string;
}

interface Material {
  label: string;
  value: string;
}

const FillDetailsScreen: React.FC = () => {
  const [mouldName, setMouldName] = useState<string>('');
  const [mouldNumber, setMouldNumber] = useState<string>('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [mcNumber, setMcNumber] = useState<string>('');
  const [operatorName, setOperatorName] = useState<string>('');

  const mouldNames: MouldName[] = [
    { label: 'ORNAMENT YXA', value: 'ornament_yxa' },
  ];

  const materials: Material[] = [
    { label: 'FG00905 5 L TRISTAR SHIELD STAB', value: 'fg00905' },
    { label: 'Die Cut Rear RH 3/11', value: 'diecut_rear_rh' },
    { label: 'Die Cut Rear LH 3/10', value: 'diecut_rear_lh' },
    { label: 'Die Cut Front RH 3/09', value: 'diecut_front_rh' },
    { label: 'Die Cut Front LH 3/08', value: 'diecut_front_lh' },
    { label: 'SIDE BRANDIND INSERT (STUD)', value: 'side_branding' },
    { label: 'BUTTER PAPER (673*415)', value: 'butter_paper' },
    { label: 'Sticky Polythene 3X4', value: 'sticky_polythene' },
    { label: 'EP 200', value: 'ep200' },
    { label: 'UA 1200 (BLACK)', value: 'ua1200' },
    { label: '1300', value: '1300' },
    { label: 'AP 78 EP', value: 'ap78ep' },
    { label: 'PP GREY 8900', value: 'ppgrey8900' },
    { label: 'M-90', value: 'm90' },
    { label: 'Ammonia Solution', value: 'ammonia' },
    { label: 'Hydrochloric Acid', value: 'hcl' }
  ];

  const handleSubmit = () => {
    // Add your submit logic here
    console.log({
      mouldName,
      mouldNumber,
      selectedMaterials,
      mcNumber,
      operatorName
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fill Details</Text>

      <Text style={styles.label}>Mould Name</Text>
      <Dropdown
        style={styles.dropdown}
        data={mouldNames}
        labelField="label"
        valueField="value"
        placeholder="Select a mould..."
        value={mouldName}
        onChange={item => setMouldName(item.value)}
        search
      />

      <Text style={styles.label}>Mould Number</Text>
      <TextInput
        style={styles.input}
        value={mouldNumber}
        onChangeText={setMouldNumber}
        placeholder="Enter mould number"
      />

      <Text style={styles.label}>Material</Text>
      <MultiSelect
        style={styles.dropdown}
        data={materials}
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

      <Text style={styles.label}>M/C NO. / Name</Text>
      <TextInput
        style={styles.input}
        value={mcNumber}
        onChangeText={setMcNumber}
        placeholder="MOLDING"
      />

      <Text style={styles.label}>Operator Name</Text>
      <TextInput
        style={styles.input}
        value={operatorName}
        onChangeText={setOperatorName}
        placeholder="Enter operator name"
      />

      <View style={styles.submitContainer}>
        <Text style={styles.submitButton} onPress={handleSubmit}>
          Submit
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
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
  submitContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#2f3c87',
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FillDetailsScreen;