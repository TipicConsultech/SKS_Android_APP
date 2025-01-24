import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Button, TextInput } from "@react-native-material/core";
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { getAPICall, post } from '../app/util/api';
import { FlatList } from 'react-native';
import { getUser } from '../app/util/asyncStorage';
// import { post } from '../app/util/api';

const AddEquipment = ({ isVisible,customerId,setIsModalVisible,onClose}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter(); // Access router for navigation
  const [equipmentname, setEquipmentName] = useState('');
  const [modelno, setModelNo] = useState('');
  const [serialno, setSerialNo] = useState('');
  const [location, setLocation] = useState('');
  const [brandname, setBrandName] = useState('');
  const [allLocations, setLocations] = useState([
    { label: "Select Location", value: "" },
    { label: "Create New Location", value: "New" },
  ]);
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    fetchLocationData();
  }, [customerId]);
  
  const fetchLocationData = async () => {
    setLocations([{ label: "Select Location", value: "" },
      { label: "Create New Location", value: "New" },
    ]);
    try {
      const response = await getAPICall(`/api/getLocations/${customerId}`);
      if (response.data) {
        const serverLocations = response.data.map((location) => ({
          label: location,
          value: location,
        }));
        // Merge static and dynamic locations
        setLocations((prevLocations) => [...prevLocations, ...serverLocations]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleNavigateHome = () => {
    setModalVisible(false);
    router.push('./home');  // Navigate to Home screen
};



  const handleAddItem = async() => {
    
    const newEquipment = {
        "equipment_name": equipmentname,
        "model":modelno,
        "serial_no":serialno,
        "location": selectedLocation === "New" ? location : selectedLocation,
        "brand_name":brandname,
        "customer_id":customerId
    };

    
if(selectedLocation !== "" || location!==""){
    try {
        const response = await post("/api/newEquipment", newEquipment);
        if (response.id) {
        setEquipmentName("");
        setBrandName("");
        setLocation("");
        setSelectedLocation("");
        setModelNo("");
        setSerialNo("");
         onClose();
         
      }  // Navigate to home on success
      } catch (error) {
        console.error("Error assigning report with equipment:", error); // Log the error
        alert("Failed to assign report. Please try again.");
      }
    }
    else{
      alert("Select the Location Feild");
    }
    
  };


  // const routeToDetails = (path, reportNumber, remark) => {
  //   router.push({
  //     pathname: path,
  //     params: { reportNumber, remark },
  //   });
  // };

  // const handleAddItemNext = async() => {
  //   const assignedTo =
  //     userData.type === 0 && assignedUser && assignedUser.id
  //       ? assignedUser.id
  //       : userData.id;
  
  //   if (!assignedTo || typeof assignedTo !== "number") {
  //     alert("Assigned user is not valid. Please select a valid user.");
  //     return; // Stop execution if assigned_to is invalid
  //   }
  //   const newEquipment = {
  //       "customer_id":customer.id,
  //       "customer_name":customer.customer_name,
  //       "address":customer.address,
  //       "contact_person":customer.contact_person,
  //       "email":customer.email,
  //       "mobile":customer.mobile,
  //       "location": selectedLocation === "New" ? location : selectedLocation,
  //       "equipment_name": equipmentname,
  //       "model":modelno,
  //       "serial_no":serialno,
  //       "brand_name":brandname,
  //       "call_type":call_type,
  //      "assigned_to":assignedTo,
  //       "closed":0,
  //   };
  //   console.log(newEquipment);
  //   try {
  //       const response = await post("/api/assignReportWithEquipment", newEquipment);
  //       if (response.report.id !== null) {
  //         routeToDetails("/details",response.report.id,0);
  //         setIsModalVisible(false);
  //     }  // Navigate to details page on success
  //     } catch (error) {
  //       console.error("Error assigning report with equipment:", error); // Log the error
      
  //       // Optional: Show an alert or notification to the user about the error
  //       alert("Failed to assign report. Please try again.");
  //     }
      
    
  // };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={FadeIn.duration(300)} 
          exiting={FadeOut.duration(300)}
          layout={Layout.springify()} 
          style={styles.modalContent}
        >
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
  <Text style={{ fontSize: 20, fontWeight: 'bold',paddingTop:10,paddingLeft:15 }}>Add New Equipment</Text>
  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
    <Text style={styles.buttonText}>X</Text>
  </TouchableOpacity>
</View>
          <ScrollView contentContainerStyle={styles.scrollViewContent}
           showsVerticalScrollIndicator={false} 
           showsHorizontalScrollIndicator={false}
           >
            <TextInput
              variant="outlined"
              label="Equipment Name"
              style={styles.input}
              value={equipmentname}
              onChangeText={setEquipmentName}
            />
             <TextInput
              variant="outlined"
              label="Brand Name(Make)"
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
            />

       <Picker
        selectedValue={selectedLocation}
        onValueChange={(itemValue) => setSelectedLocation(itemValue)}
        style={styles.picker}>
        {allLocations.map((location, index) => (
          <Picker.Item
            key={index}
            label={location.label}
            value={location.value}
          />
        ))}
       </Picker>

       {selectedLocation ==="New" &&(
        <TextInput
        variant="outlined"
        label="Location"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />
       )}
        
  
          </ScrollView>
          <View style={styles.buttonContainer}>
            
           
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.buttonText}>Add Equipment</Text>
            </TouchableOpacity>
           
          </View>
        </Animated.View>
      </View>
           <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Equipment Added Successfully</Text>
                        <Button title="Navigate to Assign" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal> 
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
    width: '85%',  // Fixed width size
    height: '80%', // Fixed height size
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  input: {
    marginVertical: 15,
  },
  searchInput: {
    marginVertical: 15,
  },
  searchInputa: {
    marginVertical: 5,

    
  },
  suggestionItem: {
    padding: 10,
       borderBottomWidth: 1,
       borderBottomColor: "#ddd",
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
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    marginTop:15,
  },
  closeButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    marginTop:15,
    // borderColor: 'black',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    // fontWeight: 'bold',
  },
  
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
},
modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
},
picker: {
  borderColor: '#ccc',
  borderWidth: 2,
  borderRadius: 10,
  backgroundColor: "#fff",
  paddingHorizontal: 10,
  height: 48,
  justifyContent: "center",
  elevation: 5,
  margin: 0,
  marginTop: 15,
  marginBottom: 15,
  marginHorizontal:2,
},
});

export default AddEquipment;
