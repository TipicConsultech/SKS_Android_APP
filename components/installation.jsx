import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { TextInput } from "@react-native-material/core";
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const Insta = ({ isVisible, onClose, customer }) => {
  const router = useRouter(); 
  const [equipmentname, setEquipmentName] = useState('');
  const [modelno, setModelNo] = useState('');
  const [serialno, setSerialNo] = useState('');
  const [location, setLocation] = useState('');
  const [selectedOptionLocation, setSelectedOptionLocation] = useState('');
  const [visit, setVisit] = useState('');
  const [actualFault, setActualFault] = useState('');
  const [actiontaken, setActionTeken] = useState('');
  const [customersug, setCustomersug] = useState('');
  const [otherLocation, setOtherLocation] = useState('');
  const [brandname, setBrandName] = useState('');
  const [selectedOptionremark, setSelectedOptionremark] = useState('');

  const handleAddItem = () => {
    const newEquipment = {
      equipment_name: equipmentname,
      model: modelno,
      serial_no: serialno,
      location: selectedOptionLocation === 'optiona5' ? otherLocation : location,
      brand_name: brandname,
    };

    const newReport = {
      nature_of_complaint: visit,
      actual_fault: actualFault,
      action_taken: actiontaken,
      customer_suggestion: customersug,
      call_type: 'Installation',
      status: selectedOptionremark,
    };

    router.push({
      pathname: 'reportPage',
      params: {
        equipmentData: JSON.stringify(newEquipment),
        reportData: JSON.stringify(newReport),
        customreData: JSON.stringify(customer),
      },
    });
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.header}>Add New Equipment</Text>

            <TextInput
              variant="outlined"
              label="Equipment Name"
              style={styles.input}
              value={equipmentname}
              onChangeText={setEquipmentName}
            />

            <TextInput
              variant="outlined"
              label="Brand Name (Make)"
              style={styles.input}
              value={brandname}
              onChangeText={setBrandName}
            />

            <TextInput
              variant="outlined"
              label="Model No"
              style={styles.input}
              value={modelno}
              onChangeText={setModelNo}
            />

            <TextInput
              variant="outlined"
              label="Serial No"
              style={styles.input}
              value={serialno}
              onChangeText={setSerialNo}
              keyboardType="numeric"
            />

            <TextInput
              variant="outlined"
              label="Location"
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />

           

            <TextInput
              variant="outlined"
              label="Nature of complaint/visit"
              style={styles.input}
              value={visit}
              onChangeText={setVisit}
              multiline
              maxLength={200}
            />

            <TextInput
              variant="outlined"
              label="Actual fault"
              style={styles.input}
              value={actualFault}
              onChangeText={setActualFault}
              multiline
              maxLength={200}
            />

            <TextInput
              variant="outlined"
              label="Action Taken"
              style={styles.input}
              value={actiontaken}
              onChangeText={setActionTeken}
              multiline
              maxLength={200}
            />

            <TextInput
              variant="outlined"
              label="Customer Suggestion"
              style={styles.input}
              value={customersug}
              onChangeText={setCustomersug}
              multiline
              maxLength={200}
            />

            <Picker
              selectedValue={selectedOptionremark}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedOptionremark(itemValue)}
            >
              <Picker.Item label="Select Remark" value="" />
              <Picker.Item label="Working Fully" value="Working Fully" />
              <Picker.Item label="Working Moderately" value="Working Moderately" />
              <Picker.Item label="Not Working" value="Not Working" />
            </Picker>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.buttonText}>Add Equipment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    height: '80%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 10,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  header: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    height: 48,
    justifyContent: "center",
    elevation: 3,
    margin: 7,
    marginTop: 30,
    marginBottom: 15,
    marginHorizontal: 10,
  },
});

export default Insta;
