import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  Modal,
  Alert,
  BackHandler,
  LogBox,

} from "react-native";
import { useRouter } from "expo-router";
import {
  Provider,
  Stack,
  Button,
  DialogHeader,
  DialogContent,
  DialogActions,
  TextInput,
} from "@react-native-material/core";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
// import AddTable from "../components/addItem";
//import { useRouter } from 'expo-router';

import { getAPICall, post } from "./util/api";
import Insta from "../components/installation";
import AdminInsta from "../components/adminInstallation";
import { getUser } from "./util/asyncStorage";
import AddEquipment from "../components/addEquipment";

// import SignaturePad from "../../components/SignaturePad ";

//...................................Dailog
const AnimatedDialog = ({
  visible,
  onClose,
  onSubmit,
  customerName,
  mobile,
  setCustomerName,
  address,
  setAddress,
  contactPerson,
  setContactPerson,
  email,
  setEmail,
  setMobile,
  error,
}) => {
  const [show, setShow] = useState(visible);

  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const translateYValue = useRef(new Animated.Value(50)).current;
  const [errorName, setErrorName] = useState("");
  const [errorMobile, setErrorMobile] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorPerson, setErrorPerson] = useState("");
  const [errorEmail, setErrorEmail] = useState("");



  const router = useRouter();

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
}, [])

const handleSubmitd = async () => {
  // Reset error messages
  setErrorName("");
  setErrorAddress("");
  setErrorPerson("");
  setErrorEmail("");
  setErrorMobile("");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const namePattern = /^[A-Za-z\s]+$/;

  // Check for empty fields
  if (
    customerName.trim() === "" ||
    address.trim() === "" ||
    contactPerson.trim() === "" ||
    email.trim() === "" ||
    mobile.trim() === ""
  ) {
    if (customerName.trim() === "") setErrorName("Customer name is required!");
    if (address.trim() === "") setErrorAddress("Address is required!");
    if (contactPerson.trim() === "")
      setErrorPerson("Contact person is required!");
    if (email.trim() === "") setErrorEmail("Email is required!");
    if (mobile.trim() === "") setErrorMobile("Mobile number is required!");
    return false;
  }

  // Validate patterns
  if (!namePattern.test(customerName)) {
    setErrorName("Customer name should contain only alphabets!");
    return false;
  }
  if (!namePattern.test(contactPerson)) {
    setErrorPerson("Contact person should contain only alphabets!");
    return false;
  }
  if (!emailPattern.test(email)) {
    setErrorEmail("Please enter a valid email address!");
    return false;
  }
  if (!/^\d{10}$/.test(mobile)) {
    setErrorMobile("Mobile number must be exactly 10 digits!");
    return false;
  }

  // If all validations pass, create the new customer object
  const newCustomer = {
    customer_name: customerName,
    address: address,
    contact_person: contactPerson,
    email: email,
    mobile: mobile,
  };

  try {
    const response = await post("/api/createCustomer", newCustomer);
    if (response) {
      // Clear form fields
      setCustomerName("");
      setAddress("");
      setContactPerson("");
      setEmail("");
      setMobile("");
      onClose();
      Alert.alert("Success", "Customer created successfully!");
    }
  } catch (error) {
    Alert.alert("Error", "Failed to create customer!");
  }
};


  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(),
      ]);
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(),
        Animated.timing(translateYValue, {
          toValue: 50,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => setShow(false)),
      ]);
    }
  }, [visible]);

 

 return (
    <Modal transparent visible={show} animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.dialogContainer,
            {
              transform: [
                { scale: scaleValue },
                { translateY: translateYValue },
              ],
              opacity: opacityValue,
            },
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <DialogHeader
              title=" New Customer"
              style={styles.dialogHeader}
            />
            <View style={styles.Line1} />
            
            <DialogContent>
              <Stack spacing={2}>
                <TextInput
                  variant="outlined"
                  label="Customer name"
                  style={styles.input}
                  value={customerName}
                  onChangeText={setCustomerName}
                />
                {errorName ? <Text style={styles.errorTextd}>{errorName}</Text> : null}
                <TextInput
                  variant="outlined"
                  label="Address"
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                />
                {errorAddress ? <Text style={styles.errorTextd}>{errorAddress}</Text> : null}
                <TextInput
                  variant="outlined"
                  label="Contact person"
                  style={styles.input}
                  value={contactPerson}
                  onChangeText={setContactPerson}
                />
               {errorPerson ? <Text style={styles.errorTextd}>{errorPerson}</Text> : null}
                <TextInput
                  variant="outlined"
                  label="Mobile Number"
                  style={styles.input}
                  value={mobile}
                  onChangeText={setMobile}
                />
                {errorMobile ? <Text style={styles.errorTextd}>{errorMobile}</Text> : null}
                <TextInput
                  variant="outlined"
                  label="Email"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              {errorEmail ? <Text style={styles.errorTextd}>{errorEmail}</Text> : null}
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    width: "100%",
                    marginTop: 8,
                  }}
                >
                

                  <TouchableOpacity
                    style={styles.customButtoncancel}
                    onPress={onClose}
                  >
                    <Text style={styles.buttonTextcancle}>X</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.customButtond}
                    onPress={handleSubmitd}
                  >
                    <Text style={styles.buttonTextd}>Save</Text>
                  </TouchableOpacity>
                </View>
              </Stack>
            </DialogContent>
            <DialogActions></DialogActions>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};
//......................................................Dailog End

//......................................................add equipment in every process
const CustomerInfo = () => {
  
  useEffect(() => {
    const backAction = () => {
        Alert.alert(
            "Warning", // Title of the alert
            "Pressing OK will discard your entered data. Do you want to go back or stay on this page?", // Message
            [
                {
                    text: "Stay Page",
                    onPress: () => saveDraft(),
                    style: "cancel"
                },
                { text: "Ok", onPress: () => router.push('./home') }
            ]
        );
        return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
    );

    return () => backHandler.remove(); // Cleanup
}, []);


const saveDraft = () => {
    // Your logic to save the draft
    console.log("Draft saved!");
};
 const [customer,setCustomer]=useState({});
 const [equipment,setEquipment]=useState({});
 const [assignedUser , setAssignedUser] = useState({});

 const [itemsTable, setItemsTable] = useState([]);

 
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [mobile, setMobile] = useState("");

  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  const [searchUser, setSearchUser] = useState(""); 
  const [filteredUser, setFilteredUser] = useState([]);

  const [selectedOptionType, setSelectedOptionType] = useState("");
  const [selectedOptionLocation, setSelectedOptionLocation] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchModelQuery, setSearchModelQuery] = useState("");
  const [searchEqpQuery, setSearchEqpQuery] = useState("");
  const [selectedEqpItem, setSelectedEqpItem] = useState(null);
  const [sEquipment, setSEquipment] = useState({});
console.log('sEquipment', sEquipment);
  
  const [selectedEquipmentName, setSelectedEquipmentName] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedsno, setSelectedsno] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredEqpData, setFilteredEqpData] = useState();
  const [selectedSno, setSelectedSno] = useState('');
  const [selectedModel, setSelectedModel] = useState("");
  
  const [isEqpSelected, setIsEqpSelected] = useState(false);
  const [visible, setVisible] = useState(false);
  const [otherCall, setOtherCall] = useState("");
  const [callType, setCallType] = useState(null);

  
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allLocations, setLocations] = useState([
    { label: "Select Location", value: "" },
    { label: "Create New Location", value: "New" },
  ]);
  const [allEquipment, setAllEquipment] = useState([
    { label: "Select Equipment", value: "" },
    { label: "Add New Equipment", value: "Add"},
  ]);
  const [selectedLocation, setSelectedLocation] = useState("");

  
 
  
  const [userData, setUserData] = useState({
    name: '',
    id:0,
    type:null,
  });
  const router = useRouter();

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
  
  const handleSearch = async (text) => {
    setSearchQuery(text); // Update the search query as the user types
    setIsCustomerSelected(false);
    if (searchQuery.length === 0) {
      setFilteredData([]); // Set the filtered customer data
    }

    if (text) {
      try {
        const response = await post("/api/getCustomerByName", { search: text }); ////Customer Name Get
        // const data = await response.json();
        if (Array.isArray(response)) {
          setFilteredData(response); // Set the filtered customer data
        } else {
          setFilteredData([]); // If no data found, clear the list
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setFilteredData([]); // Clear the list in case of error
      }
    } else {
      setFilteredData([]); // Clear the list if the input is empty
    }
  };

  useEffect(()=>{
    handleEqpSearch();
  },[customerId,selectedLocation]);

    const handleEqpSearch = async () => {
      setAllEquipment([
        { label: "Select Equipment", value: "" },
        { label: "Add New Equipment", value: "Add" },
    ]);
    setFilteredEqpData([]);
      try {
          const response = await post("/api/getEquipment", {
              location: selectedLocation,
              customer_id: customerId,
          });
          
          if (response && response.length > 0) {
              setFilteredEqpData(response); // Store the raw response for other purposes

              // Update picker options dynamically using the correct field names
              const serverEqp=response.map((item) => ({
                label: item.equipment_name, // Use the correct key for the equipment name
                value: item.id, // Use the ID as the value
            })); 
            setAllEquipment((prevEquipment) => [...prevEquipment, ...serverEqp]);
          } else {
              setFilteredEqpData([]);
              setAllEquipment([
                  { label: "Select Equipment", value: "" },
                  { label: "Add New Equipment", value: "Add" },
              ]);
          }
      } catch (error) {
          console.error("Error fetching Equipment:", error);
          setFilteredEqpData([]);
      }
  };


  const truncateString = (text, maxLength) => {
    if (!text || typeof text !== 'string') return ''; // Handle invalid input
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }; 
  
  const handleValueChange = (selectedId) => {
    console.log(selectedId);
    
    if (selectedId === "Add") {
      setIsModalVisible(true); // Trigger modal for adding new equipment
      setSelectedEquipment(null); // Clear selection
      setIsEqpSelected(false);
    } else {
      // Filter the raw response data to get details of the selected equipment
      const selectedData = filteredEqpData.find((item) => item.id === selectedId);
      setSelectedEquipment(selectedData || null); // Store the selected JSON object or null
      setIsEqpSelected(true);
      setEquipment(selectedData);
      
    }
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


  // const handleSelectUser = (user) => {
 
  //   // Add functionality to handle what happens when a user is selected
  // };

  const handleSelectItem = (item) => {

    setSearchQuery(item.customer_name); // Fill the search input with selected customer name
    setCustomer(item);
    setCustomerName(item.customer_name);
    setCustomerId(item.id)
    setAddress(item.address);
    setContactPerson(item.contact_person);
    setMobile(item.mobile);
    setFilteredData([]); // Clear the suggestion list
    setIsCustomerSelected(true);
    fetchLocationData(item.id);
  };
  

  const handleSelectUser = (item) => {
    setSearchUser(item.name); // Fill the search input with selected customer name
    setAssignedUser(item);
   setFilteredUser([]); // Clear the suggestion list
  };
  // console.log('Good',filteredEqpData);

  
  
  const handleSubmit = async () => {
    console.log("customer is", customer);
    console.log("equipment is", equipment);
    console.log("assigned user is", assignedUser);
  
    const assignedTo =
      userData.type === 0 && assignedUser && assignedUser.id
        ? assignedUser.id
        : userData.id;
  
    if (!assignedTo || typeof assignedTo !== "number") {
      alert("Assigned user is not valid. Please select a valid user.");
      return; // Stop execution if assigned_to is invalid
    }
  
    const data = {
      customer_id: customer.id,
      customer_name: customer.customer_name,
      address: customer.address,
      contact_person: customer.contact_person,
      email: customer.email,
      mobile: customer.mobile,
      equipment_id: `${ equipment.id}`,
      location:  equipment.location,
      equipment_name:  equipment.equipment_name,
      serial_no:  equipment.serial_no,
      model:  equipment.model,
      brand_name:  equipment.brand_name,
      assigned_to: assignedTo,
      call_type: callType, // Use the selected call type value
      closed: 0,
     
    };

  
    try {
      const response = await post("/api/report", data);
  
      if (response.id !== null) {
        setModalVisible(true); // Show success modal
        setIsModalVisible(false); // Close the modal
      }
    } catch (error) {
      console.error("Error assigning work:", error);
      alert("Failed to assign work. Please try again with valid input.");
    }
  };
  
  const handleNavigateHome = () => {
    setModalVisible(false);
    router.push("./home"); // Navigate to Home screen
  };
  
  const handleSubmitNext = async () => {
    console.log("customer is", customer);
    console.log("equipment is", equipment);
    console.log("assigned user is", assignedUser);
  
    const assignedTo =
      userData.type === 0 && assignedUser && assignedUser.id
        ? assignedUser.id
        : userData.id;
  
    if (!assignedTo || typeof assignedTo !== "number") {
      alert("Assigned user is not valid. Please select a valid user.");
      return; // Stop execution if assigned_to is invalid
    }
  
    const data = {
      customer_id: customer.id,
      customer_name: customer.customer_name,
      address: customer.address,
      contact_person: customer.contact_person,
      email: customer.email,
      mobile: customer.mobile,
      equipment_id: `${ equipment.id}`,
      location:  equipment.location,
      equipment_name:  equipment.equipment_name,
      serial_no:  equipment.serial_no,
      model:  equipment.model,
      brand_name:  equipment.brand_name,
      assigned_to: assignedTo,
      call_type: callType,
      closed: 0,
    };
  
    try {
      const response = await post("/api/report", data);
      console.log("huooh",response);
  
      if (response.report && response.report.id !== null) {
        setIsModalVisible(false);
        routeToDetails("/details", response.report.id, 0); // Navigate to details with report number and remark
      }
    } catch (error) {
      console.error("Error assigning work:", error);
      alert("Failed to assign work. Please try again with valid input.");
    }
  };
  
  const customButtonStyle = {
    backgroundColor: "black",
    marginTop: 9,
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    marginHorizontal: 20, // Conditionally add marginHorizontal
  };
  
    const fetchLocationData = async (id) => {
      setLocations([{ label: "Select Location", value: "" },
        { label: "Create New Location", value: "New" },
      ]);
      try {
        const response = await getAPICall(`/api/getLocations/${id}`);
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
   
  const routeToDetails = (path, reportNumber, remark) => {
    router.push({
      pathname: path,
      params: { reportNumber, remark },
    });
  };
      return (

    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.image}
      />
      <Text style={styles.logoHeading}>SMART KITCHEN SOLUTION'S</Text>
      <View style={styles.Line1} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          variant="outlined"
          label="Search customer"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        
           
        {filteredData.length > 0 && (
          
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()} // Use a unique key, like id
            renderItem={({ item }) => {
              // console.log(item); // Ensure logging for debugging
              return (
                <TouchableOpacity onPress={() => handleSelectItem(item)}>
                  <Text
                    style={styles.suggestionItem}
                  >{`${item.customer_name}  -${item.address}`}</Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
        { searchQuery.length > 0 && 
        filteredData.length === 0 &&  //data
        !isCustomerSelected && 
           (
            <TouchableOpacity
              style={styles.customButtonadd}
              onPress={() => setVisible(true)}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          )}


        {isCustomerSelected && (
         <View style={styles.cardContainer}>
         <View style={styles.customerInfoContainer}>
           <Text style={styles.customerName}>Customer Name: {customerName}</Text>
           <Text style={styles.customerAddress}>Address: {address}</Text>
           <Text style={styles.contactPerson}>Contact Person: {contactPerson}</Text>
         </View>
         
       </View>
        )}
        

        <AnimatedDialog
          visible={visible}
          onClose={() => setVisible(false)}
          onSubmit={handleSubmit}
          customerName={customerName}
          setCustomerName={setCustomerName}
          address={address}
          setAddress={setAddress}
          contactPerson={contactPerson}
          setContactPerson={setContactPerson}
          email={email}
          mobile={mobile}
          setMobile={setMobile}
          setEmail={setEmail}
          error={error}
        />

        {isCustomerSelected && (
          <>

          <Picker
              selectedValue={selectedOptionType}
              style={styles.picker}
              onValueChange={(itemValue) => {

                switch(itemValue){
                  case "Installation":
                    setCallType(0);
                    break;
                    case "Inspection":
                      setCallType(1);
                    break;
                    case "Breakdown":
                      setCallType(2);
                    break;
                    case "PPM":
                      setCallType(3);
                    break;
                    case "option6":
                      setCallType(5);
                    break;

                };
                
                setSelectedOptionType(itemValue);
                if (itemValue === "Installation") {
                  setIsModalVisible(true);
                   // Open dialog when 'Installation' is selected
                  }
              }}
            >
              <Picker.Item label="Select Type of Call" value="Select Type of Call" />
              <Picker.Item label="Breakdown" value="Breakdown" />
              <Picker.Item label="PPM" value="PPM" />
              <Picker.Item label="Installation" value="Installation" />
              <Picker.Item label="Inspection" value="Inspection" />
              <Picker.Item label="Other" value="option6" />
            </Picker>
            {selectedOptionType === "option6" && (
              <TextInput
                style={styles.input}
                placeholder="Enter Type of call"
                value={otherCall}
                onChangeText={setOtherCall}
              />
            )}
          <Picker
  selectedValue={selectedLocation}
  onValueChange={(itemValue) => {
    setSelectedLocation(itemValue);
    if (itemValue === "New") {
      setIsModalVisible(true); // Open AdminInsta modal when 'Create New Location' is selected
    }
  }}
  style={styles.picker}>
  {allLocations.map((location, index) => (
    <Picker.Item
      key={index}
      label={location.label}
      value={location.value}
    />
  ))}
</Picker>
      
<AddEquipment
  customerId={customerId}
  isVisible={isModalVisible}
  setIsModalVisible={setIsModalVisible}
  setSelectedLocationWork={setSelectedLocation}
  onClose={() => {setIsModalVisible(false);
    fetchLocationData(customerId);
  }}
/>

 
  {selectedLocation!=="" && (
               <Picker
               selectedValue={equipment.id}
              onValueChange={handleValueChange}
               style={styles.picker}>
               {allEquipment.map((Equipment, index) => (
                 <Picker.Item
                   key={index}
                   label={Equipment.label}
                   value={Equipment.value}
                 />
               ))}
             </Picker>
            )}


{isEqpSelected && (
              <>
                {/* <Text style={styles.label}>Selected Equipment: {selectedEquipmentName}</Text> */}
                <View style={styles.card}>
  <Text style={styles.cardTitle}>Equipment Information</Text>
  <View style={{Width:1,backgroundColor: "#555", height: 1,}}></View>
  <View style={styles.infoRow}>
    <Text style={styles.label}>EQP Name:</Text>
    <Text style={styles.value}>{truncateString(equipment.equipment_name,14)}</Text>
  </View>
  <View style={styles.infoRow}>
    <Text style={styles.label}>Model/PNC:</Text>
    <Text style={styles.value}>{equipment.model}</Text>
  </View>
  <View style={styles.infoRow}>
    <Text style={styles.label}>Serial Number:</Text>
    <Text style={styles.value}>{equipment.serial_no}</Text>
  </View>
</View>
              </>
            )}



     {userData.type===0 &&
     (<TextInput
        placeholder="Assign User"
         variant="outlined"
        style={styles.searchInput}
        value={searchUser}
        onChangeText={handleSearchUser} // Update search query on change
      />)
     }

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
              <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                width: "100%",
                marginTop: 40,
                marginBottom: 15,
                paddingHorizontal: 8,
              }}
            >
               <TouchableOpacity
                style={customButtonStyle}
                onPress={handleSubmit}
              >{userData.type===0?(
                 <Text style={styles.buttonText}>Assign</Text>
              ):(
                 <Text style={styles.buttonText}>Assign Only</Text>
              )}
              </TouchableOpacity>     

                {userData.type===1 && <TouchableOpacity
                style={customButtonStyle}
                onPress={handleSubmitNext}
              > 
              <Text style={styles.buttonText}>Assign & Next</Text>
              </TouchableOpacity> }        
            </View>
          </>
        )}
        
      </ScrollView>

      {/* <View style={styles.container}> */}
            
            
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
        {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  customerInfoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  // closeButton1: {
  //   marginTop: 20, // Adds space above the button
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   backgroundColor: '#ff0000', // Close button background color
  //   borderRadius: 5,
  // },
  // closeButtonText: {
  //   color: '#fff', // Close button text color
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },

  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  selEqp: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  customerAddress: {
    fontSize: 14,
    color: "#555",
  },
  contactPerson: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchInput: {
    marginBottom: 20,
    // other styles
  },
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 7,
    backgroundColor: "#f5f5f5",
  },
  dailogBtn: {
    marginStart: 255,
    alignSelf: "flex-end",
    marginEnd: 10,
    color: "black",
    borderBlockColor: "black",

    borderColor: "black",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
  },

  image: {
    width: 160,
    height: 65,
    marginBottom: 6,
    marginTop: 60,
    alignSelf: "center",
    padding:5
  },
 dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownContainer: {
    backgroundColor: "#f9f9f9",
  },
  card: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
  },
  customButtontable: {
    backgroundColor: "green",
    marginTop: 9,
    paddingVertical: 6,
    paddingHorizontal: 1,
    // marginHorizontal: 120
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },

  customButtona: {
    // marginRight: 10,
    height: 40,
    marginTop: 9,
    backgroundColor: "black",
    paddingVertical: 6,
    paddingHorizontal: 6,
    // marginHorizontal: 70,
    // marginleft:20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    height: 36,
  },
  containerasp: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // customButtonsign: {
  //   backgroundColor: "green",
  //   height: 36,
  //   marginTop: 9,
  //   paddingVertical: 6,
  //   paddingHorizontal: 24,
  //   // marginHorizontal: 120,
  //   marginStart: 20,
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: "black",
  //   alignItems: "center",
  //   marginBottom: 15,
  //   shadowColor: "#000000",
  //   shadowOffset: { width: 0, height: 10 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 15,
  //   elevation: 5,
  // },
  customButtonadd: {
    backgroundColor: "black",
    // marginTop: 20,
    paddingVertical: 4,
    paddingHorizontal: 15,
    marginStart: 255,
    alignSelf: "flex-end",
    marginEnd: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  customButtonclose: {
    marginTop: 10,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 770,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
//   signContainer:{flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
// height:100,  
//   },
  // modalBackground: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)', // Makes modal background translucent
  // },
  // modalContainer:{
  //   width: '100%',
  //   backgroundColor: 'white',
  //   padding: 20,
  //   borderRadius: 10,
  //   alignItems: 'center',},

  buttonText: {
    color: "#fff",
    fontSize: 16,
    
  },
  Line1: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    marginVertical: 10,
    marginBottom: 10,
  },
  logoHeading: {
    fontSize: 12,
    marginBottom: 0,
    fontWeight: "bold",
    alignSelf: "center",
  },
  logoHeading1: {
    fontSize: 18,
    marginBottom: 12,
    marginTop: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  errorTextd: {
    color: "red",
    marginBottom: 10,
    alignSelf: "center",
  },
  searchInput: {
    marginHorizontal: 10,
    marginTop: 30,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dialogContainer: {
    width: "80%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  dialogHeader: {
    marginBottom: 15,
  },
  input: {
    marginTop: 5,
  },
  customButtond: {
    marginTop: 10,
    //marginRight:50,
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    // marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: 80,
  },

  customButtoncancel: {
    marginTop: 10,
    // marginLeft:2,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 13,
    //marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    width: 80,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 16,
    margin: 16,
  },
  customerInfoContainer: {
    // Additional styles for the info container
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 16,
    marginBottom: 4,
  },
  contactPerson: {
    fontSize: 16,
  },

  customButtons: {
    marginTop: 20,
    marginLeft: 35,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    marginleft: 20,
  },
  buttonTextd: {
    color: "#fff",
    fontSize: 13,
   
  },
  buttonTextcancle: {
    color: "#fff",
    fontSize: 13,
    
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
  card: {
    backgroundColor: '#fff',
    padding: 16,
    paddingHorizontal:25,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },

//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
// },
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
});

const AppProvider = () => (
  <Provider>
    <CustomerInfo />
  </Provider>
);

export default AppProvider;
