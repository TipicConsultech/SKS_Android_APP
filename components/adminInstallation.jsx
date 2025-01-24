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

const AdminInsta = ({ isVisible, onClose,customer,customerId,setIsModalVisible}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter(); // Access router for navigation
  const [equipmentname, setEquipmentName] = useState('');
  const [modelno, setModelNo] = useState('');
  const [serialno, setSerialNo] = useState('');
  const [location, setLocation] = useState('');
  
  const [selectedOptionLocation, setSelectedOptionLocation] = useState('');
  
  const [otherLocation, setOtherLocation] = useState('');
  const [brandname, setBrandName] = useState('');
  const [selectedOptionremark, setSelectedOptionremark] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);
  const [searchUser, setSearchUser] = useState(""); 
  const [assignedUser, setAssignedUser] = useState(""); 
  const [userData, setUserData] = useState({
    name: '',
    id:0,
    type:null,
  });
  const [allLocations, setLocations] = useState([
    { label: "Select Location", value: "" },
    { label: "Create New Location", value: "New" },
  ]);
  const [selectedLocation, setSelectedLocation] = useState("");


  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUser();
      if (user) {
        // Update profileData with user information
        setUserData({
          name: user.name,
          id: user.id,
          type:user.type,
        });
      }
    };
    fetchUserData();  // Fetch user data on component mount
  }, []);

  useEffect(() => {
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

    fetchLocationData();
  }, [customerId]);
  
  

  const handleSelectUser = (item) => {
    setSearchUser(item.name); // Fill the search input with selected customer name
    setAssignedUser(item);
   setFilteredUser([]); // Clear the suggestion list
  };


  const handleSearchUser = async (text) => {
    setSearchUser(text); // Update the search query as the user types

    // If the input is empty, clear the filtered list and exit early
    if (text.length === 0) {
      setFilteredUser([]);
      return;
    }

    // If the input is not empty, proceed with fetching data
    try {
      const response = await post("/api/allUser",{ search: text });

      console.log(response); // Check the response from the API

      if (Array.isArray(response)) {
        setFilteredUser(response); // Update with filtered data if response is an array
      } else {
        setFilteredUser([]); // If no data is found, clear the list
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setFilteredUser([]); // Clear the list in case of an error
    }
  };

  
  const handleNavigateHome = () => {
    setModalVisible(false);
    router.push('./home');  // Navigate to Home screen
};

  const handleAddItem = async() => {
    
    const newEquipment = {
        "customer_id":customer.id,
        "customer_name":customer.customer_name,
        "address":customer.address,
        "contact_person":customer.contact_person,
        "email":customer.email,
        "mobile":customer.mobile,
        "equipment_name": equipmentname,
        "model":modelno,
        "serial_no":serialno,
        "location": selectedLocation === "New" ? location : selectedLocation,
        "brand_name":brandname,
        "call_type":0,
       "assigned_to": userData.type === 0 ? `${assignedUser.id}` : userData.id,

  //     "assigned_to": userData.type === 0 
  // ? (`${assignedUser.id}` ? `${assignedUser.id}` : `${userData.id}`) 
  // : `${assignedUser.id}`,
   "closed":0,
    };

    
if(selectedLocation !== "" || location!==""){
    try {
        const response = await post("/api/assignReportWithEquipment", newEquipment);
       
        
        if (response.report.id!==null) {
          setModalVisible(true);
          setIsModalVisible(false);
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


  const routeToDetails = (path, reportNumber, remark) => {
    router.push({
      pathname: path,
      params: { reportNumber, remark },
    });
  };

  const handleAddItemNext = async() => {
    
    const newEquipment = {
        "customer_id":customer.id,
        "customer_name":customer.customer_name,
        "address":customer.address,
        "contact_person":customer.contact_person,
        "email":customer.email,
        "mobile":customer.mobile,
        "location": selectedLocation === "New" ? location : selectedLocation,
        "equipment_name": equipmentname,
        "model":modelno,
        "serial_no":serialno,
        "brand_name":brandname,
        "call_type":0,
       "assigned_to": userData.type === 0 ? `${assignedUser.id}` : userData.id,
        "closed":0,
    };
    console.log(newEquipment);
    try {
        const response = await post("/api/assignReportWithEquipment", newEquipment);
        if (response.report.id !== null) {
          routeToDetails("/details",response.report.id,0);
          setIsModalVisible(false);
      }  // Navigate to details page on success
      } catch (error) {
        console.error("Error assigning report with equipment:", error); // Log the error
      
        // Optional: Show an alert or notification to the user about the error
        alert("Failed to assign report. Please try again.");
      }
      
    
  };

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
              // keyboardType="numeric"
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
        {filteredUser.length > 0 && (
        <FlatList
          data={filteredUser}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectUser(item)} style={styles.suggestionItem}>
              {/* Ensure the name is wrapped properly in <Text> */}
              <Text style={styles.userText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
  {userData.type===0 &&(
            <TextInput
            placeholder="Assign User"
             variant="outlined"
            style={styles.searchInputa}
            value={searchUser}
            onChangeText={handleSearchUser} // Update search query on change
          />
          )} 
          </ScrollView>
          <View style={styles.buttonContainer}>
            
           
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.buttonText}>Assign Only</Text>
            </TouchableOpacity>
            {userData.type===1 &&
               <TouchableOpacity style={styles.addButton} onPress={handleAddItemNext}>
               <Text style={styles.buttonText}>Assign & Next</Text>
             </TouchableOpacity>
            }
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
                        <Text style={styles.modalText}>Assign work successfully!</Text>
                        <Button title="Go to Home" onPress={handleNavigateHome} />
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

export default AdminInsta;
