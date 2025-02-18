// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   Animated,
//   Easing,
//   Modal,
//   Alert,
//   BackHandler,
//   LogBox,

// } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   Provider,
//   Stack,
//   Button,
//   DialogHeader,
//   DialogContent,
//   DialogActions,
//   TextInput,
// } from "@react-native-material/core";
// import { Picker } from "@react-native-picker/picker";
// import { router } from "expo-router";
// import AddTable from "../components/addItem";
// //import { useRouter } from 'expo-router';

// import { post } from "./util/api";
// import Insta from "../components/installation";
// import { getUser } from "./util/asyncStorage";
// // import SignaturePad from "../../components/SignaturePad ";

// //......................................................Dailog
// const AnimatedDialog = ({
//   visible,
//   onClose,
//   onSubmit,
//   customerName,
//   mobile,
//   setCustomerName,
//   address,
//   setAddress,
//   contactPerson,
//   setContactPerson,
//   email,
//   setEmail,
//   setMobile,
//   error,
// }) => {
//   const [show, setShow] = useState(visible);

//   const scaleValue = useRef(new Animated.Value(0)).current;
//   const opacityValue = useRef(new Animated.Value(0)).current;
//   const translateYValue = useRef(new Animated.Value(50)).current;
//   const [errord, setErrord] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
// }, [])

//   const Sd = async () => {
   
//     if (
//       customerName.trim() === "" ||
//       address.trim() === "" ||
//       contactPerson.trim() === "" ||
//       email.trim() === "" ||
//       mobile.trim() === ""
//     ) {
//       setErrord("All fields are required!");
//     } else {
//       const newCustomer = {
//         customer_name: customerName,
//         address: address,
//         contact_person: contactPerson,
//         email: email,
//         mobile: mobile,
//       };
//       const responce = await post("/api/createCustomer", newCustomer);
//       if (responce) {
//         setErrord("");
//         onClose();
//         Alert.alert("Success", "Customer created successfully!");

//         setCustomerName("");
//         setAddress("");
//         setContactPerson("");
//         setEmail("");
//         setMobile("");

        
//       }
//     }
//   };

//   useEffect(() => {
//     if (visible) {
//       setShow(true);
//       Animated.parallel([
//         Animated.timing(scaleValue, {
//           toValue: 1,
//           duration: 300,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }).start(),
//         Animated.timing(opacityValue, {
//           toValue: 1,
//           duration: 300,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }).start(),
//         Animated.timing(translateYValue, {
//           toValue: 0,
//           duration: 300,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }).start(),
//       ]);
//     } else {
//       Animated.parallel([
//         Animated.timing(scaleValue, {
//           toValue: 0,
//           duration: 300,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }).start(),
//         Animated.timing(opacityValue, {
//           toValue: 0,
//           duration: 300,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }).start(),
//         Animated.timing(translateYValue, {
//           toValue: 50,
//           duration: 300,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }).start(() => setShow(false)),
//       ]);
//     }
//   }, [visible]);

//  return (
//     <Modal transparent visible={show} animationType="none">
//       <View style={styles.overlay}>
//         <Animated.View
//           style={[
//             styles.dialogContainer,
//             {
//               transform: [
//                 { scale: scaleValue },
//                 { translateY: translateYValue },
//               ],
//               opacity: opacityValue,
//             },
//           ]}
//         >
//           <ScrollView contentContainerStyle={styles.scrollContainer}>
//             <DialogHeader
//               title="         New Customer"
//               style={styles.dialogHeader}
//             />
//             <View style={styles.Line1} />
//             {errord ? <Text style={styles.errorTextd}>{errord}</Text> : null}
//             <DialogContent>
//               <Stack spacing={2}>
//                 <TextInput
//                   variant="outlined"
//                   label="Customer name"
//                   style={styles.input}
//                   value={customerName}
//                   onChangeText={setCustomerName}
//                 />
//                 <TextInput
//                   variant="outlined"
//                   label="Address"
//                   style={styles.input}
//                   value={address}
//                   onChangeText={setAddress}
//                 />
//                 <TextInput
//                   variant="outlined"
//                   label="Contact person"
//                   style={styles.input}
//                   value={contactPerson}
//                   onChangeText={setContactPerson}
//                 />

//                 <TextInput
//                   variant="outlined"
//                   label="Mobile Number"
//                   style={styles.input}
//                   value={mobile}
//                   onChangeText={setMobile}
//                 />
//                 <TextInput
//                   variant="outlined"
//                   label="Email"
//                   style={styles.input}
//                   value={email}
//                   onChangeText={setEmail}
//                 />

//                 <View
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     flexDirection: "row",
//                     width: "100%",
//                     marginTop: 8,
//                   }}
//                 >
//                   <TouchableOpacity
//                     style={styles.customButtond}
//                     onPress={Sd}
//                   >
//                     <Text style={styles.buttonTextd}>Save</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.customButtoncancel}
//                     onPress={onClose}
//                   >
//                     <Text style={styles.buttonTextcancle}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </Stack>
//             </DialogContent>
//             <DialogActions></DialogActions>
//           </ScrollView>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };
// //......................................................Dailog End
// const CustomerInfo = () => {
  
//   useEffect(() => {
//     const backAction = () => {
//         Alert.alert("Hold on!", "You have unsaved changes. Do you want to save as a draft or close?", [
//             {
//                 text: "Save as Draft",
//                 onPress: () => saveDraft(),
//                 style: "cancel"
//             },
//             { text: "Close", onPress: () => BackHandler.exitApp() }
//         ]);
//         return true; // Prevent default behavior
//     };

//     const backHandler = BackHandler.addEventListener(
//         "hardwareBackPress",
//         backAction
//     );

//     return () => backHandler.remove(); // Cleanup
// }, []);

// const saveDraft = () => {
//     // Your logic to save the draft
// };
//  const [customer,setCustomer]=useState({});
//  const [equipment,setEquipment]=useState({});
//  const [itemsTable, setItemsTable] = useState([]);

 
//   const [customerName, setCustomerName] = useState("");
//   const [address, setAddress] = useState("");
//   const [contactPerson, setContactPerson] = useState("");
//   const [mobile, setMobile] = useState("");
//   // const [equipmentName, setequipmentName] = useState();
//   const [customersug, setCustomersug] = useState("");

//   const [visit, setVisit] = useState("");
//   const [actualFault, setActualFault] = useState("");
//   const [actionteken, setActionTeken] = useState("");
//   const [selectedOptionremark, setSelectedOptionremark] = useState("");
//   const [selectedOptionType, setSelectedOptionType] = useState("");
//   const [selectedOptionLocation, setSelectedOptionLocation] = useState("");
//   const [isVisible, setIsVisible] = useState(false);
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");

//   const [isModalVisible, setIsModalVisible] = useState(false);
  

//   const [errord, setErrord] = useState("");
//   const [searchQuery, setSearchQuery] = useState(""); //constomer
//   const [searchModelQuery, setSearchModelQuery] = useState("");
//   const [searchEqpQuery, setSearchEqpQuery] = useState("");
//   const [searchsnoQuery, setSearchsnoQuery] = useState("");
//   const [selectedEquipmentName, setSelectedEquipmentName] = useState("");
//   const [selectedsno, setSelectedsno] = useState("");

//   const [callType, setCallType] = useState(null); // State to store selected call type

  
//   const [selectedOptionRemark, setSelectedOptionRemark] = useState(null);

//   const [currentValue, setCurrentValue] = useState(0); //for remark 
//   const [selectedValue, setSelectedValue] = useState('Select Remark'); //for remark

//   const [filteredData, setFilteredData] = useState([]);
//   const [filteredModelData, setFilteredModelData] = useState([]);
//   const [filteredEqpData, setFilteredEqpData] = useState([]);
//   const [filteredsnoData, setFilteredsnoData] = useState([]);
//   const [serchedCustomer, setSerchedCustomer] = useState([]);
  

//   const [isCustomerSelected, setIsCustomerSelected] = useState(false);
//   const [isEqpSelected, setIsEqpSelected] = useState(false);
//   const [isModelSelected, setIsModelSelected] = useState(false);
//   const [issnoSelected, setIssnoSelected] = useState(false);

//   const [visible, setVisible] = useState(false);
//   const [serialNo, setserialNo] = useState();

//   const router = useRouter();
//   const [otherCall, setOtherCall] = useState("");
//   const [otherLocation, setOtherLocation] = useState("");
//   const [reportNumber, setReportNumber] = useState(1);
//   const [selectedModel, setSelectedModel] = useState("");

//   const [signature, setSignature] = useState(null); 
//   const [signVisible, setSignVisible] = useState(false)
//   const[ user,setUser] = useState('')
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const data = await getUser();
//       if (data) {
//         // Update profileData with user information
//         setUser({
//           name: data.name,
//           id: data.id,
//         });
//       }
      
//     };

//     fetchUserData();  // Fetch user data on component mount
//   }, []);

//   const handleSearch = async (text) => {
//     setSearchQuery(text); // Update the search query as the user types
//     setIsCustomerSelected(false);
//     if (searchQuery.length === 0) {
//       setFilteredData([]); // Set the filtered customer data
//     }

//     if (text) {
//       try {
//         const response = await post("/api/getCustomerByName", { search: text });

//         // const data = await response.json();

//         if (Array.isArray(response)) {
//           setFilteredData(response); // Set the filtered customer data
          
//         } else {
//           setFilteredData([]); // If no data found, clear the list
//         }
//       } catch (error) {
//         console.error("Error fetching customers:", error);
//         setFilteredData([]); // Clear the list in case of error
//       }
//     } else {
//       setFilteredData([]); // Clear the list if the input is empty
//     }
//   };

//   const handleEqpSearch = async (text) => {
//     setSearchEqpQuery(text);
//     if (searchEqpQuery.length === 0) {
//       setFilteredEqpData([]); // Set the filtered customer data
//     }

//     if (text) {
//       try {
//         const response = await post("/api/getEquipmentByName", {
//           search: text,
//         });
//         // const data = await response.json();

//         if (response) {
//           setFilteredEqpData(response); // Set the filtered customer data
//         } else {
//           setFilteredEqpData([]); // If no data found, clear the list
//         }
//       } catch (error) {
//         console.error("Error fetching Equpment:", error);
//         setFilteredEqpData([]); // Clear the list in case of error
//       }
//     } else {
//       setFilteredEqpData([]); // Clear the list if the input is empty
//     }
//   };

//   const handleSelectItem = (item) => {

//     setSearchQuery(item.customer_name); // Fill the search input with selected customer name
//     setCustomer(item);
//     setCustomerName(item.customer_name);
//     setAddress(item.address);
//     setContactPerson(item.contact_person);
//     setMobile(item.mobile);
//     setFilteredData([]); // Clear the suggestion list
//     setIsCustomerSelected(true);
//   };
//   const handleSelectEqpItem = (item) => {
//     setSearchEqpQuery(item.equipment_name);
//     setFilteredEqpData([]);
//     setIsEqpSelected(true);
//     setEquipment(item);
//     setSelectedEquipmentName(item.equipment_name);
//     setSelectedModel(item.model)
//     setSelectedsno(item.serial_no)
//   };


//   const handleAddItem = () => {
//     setIsVisible(!isVisible); // Show the table when the button is clicked
//   };
//   const handlecancel = () => {
//     setIsVisible(false); // Show the table when the button is clicked
//   };
//   const handleClose = () => {
//     setIsVisible(false);
//   };

//   const pickerItems = [
//     { label: "Select Remark", value: "Select Remark" },
//     { label: "Not Working", value: '0' },
//     { label: "Working Moderately", value:'1' },
//     { label: "Working Fully", value: '2' },
//     { label: "Faulty/unserviceable", value: '3' },
//   ];

//   // Filter items based on currentValue
//   const filteredItems = pickerItems.filter(
//     (item) => parseInt(item.value) >= currentValue || isNaN(item.value)
//   );
//   const S = () => {
//     if (
//       searchQuery.trim() === "" ||
      
//       searchEqpQuery.trim() === ""
//     ) {
//       setError("All fields are required!");
//     } else {
//       setError("");

      
//       //setReportNumber(prevNumber => prevNumber + 1);
    
//       const newCustomer = {
//           customer_name:customerName, 
//           address:address,
//           contact_person:contactPerson, 
//           mobile:mobile
//       };
     
//    const reportData={
       
//         "nature_of_complaint":visit,
//         "actual_fault":actualFault,
//         "action_taken":actionteken,
//       //  "status":selectedOptionRemark,
//       "remark": parseInt(selectedValue),
//         "customer_suggestion":customersug,
//         "call_type":callType,
//       };

      
//       router.push({
//         pathname: 'reportPage',
//         params: { equipmentData:JSON.stringify(equipment),reportData:JSON.stringify(reportData),customreData:JSON.stringify(customer),itemData:JSON.stringify(itemsTable) }, // Pass data as string
//       });
//       setSearchQuery("");
//       setFilteredData([]);
//       setIsCustomerSelected(false);
//       setIsEqpSelected(false);
//     }
//   };
    
//   return (

//     <View style={styles.container}>
//       <Image
//         source={require("../../assets/images/logo.png")}
//         style={styles.image}
//       />
//       <Text style={styles.logoHeading}>SMART KITCHEN SOLUTION'S</Text>
//       <View style={styles.Line1} />
//       {error ? <Text style={styles.errorText}>{error}</Text> : null}
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <TextInput
//           variant="outlined"
//           label="Search customer"
//           style={styles.searchInput}
//           value={searchQuery}
//           onChangeText={handleSearch}
//         />
        
           
//         {filteredData.length > 0 && (
          
//           <FlatList
//             data={filteredData}
//             keyExtractor={(item) => item.id.toString()} // Use a unique key, like id
//             renderItem={({ item }) => {
//               return (
//                 <TouchableOpacity onPress={() => handleSelectItem(item)}>
//                   <Text
//                     style={styles.suggestionItem}
//                   >{`${item.customer_name}  -${item.address}`}</Text>
//                 </TouchableOpacity>
//               );
//             }}
//           />
//         )}
//         { searchQuery.length > 0 && 
//         filteredData.length === 0 &&  //data
//         !isCustomerSelected && 
//            (
//             <TouchableOpacity
//               style={styles.customButtonadd}
//               onPress={() => setVisible(true)}
//             >
//               <Text style={styles.buttonText}>Add</Text>
//             </TouchableOpacity>
//           )}


//         {isCustomerSelected && (
//          <View style={styles.cardContainer}>
//          <View style={styles.customerInfoContainer}>
//            <Text style={styles.customerName}>Customer Name: {customerName}</Text>
//            <Text style={styles.customerAddress}>Address: {address}</Text>
//            <Text style={styles.contactPerson}>Contact Person: {contactPerson}</Text>
//          </View>
         
//        </View>
//         )}
        

//         {/* {filteredData.data === "0" &&
//           searchQuery.length > 0 &&
//           !isCustomerSelected && (
//             <TouchableOpacity
//               style={styles.customButtonadd}
//               onPress={() => setVisible(true)}
//             >
//               <Text style={styles.buttonText}>Add</Text>
//             </TouchableOpacity>
//           )} */}

//         <AnimatedDialog
//           visible={visible}
//           onClose={() => setVisible(false)}
//           onSubmit={S}
//           customerName={customerName}
//           setCustomerName={setCustomerName}
//           address={address}
//           setAddress={setAddress}
//           contactPerson={contactPerson}
//           setContactPerson={setContactPerson}
//           email={email}
//           mobile={mobile}
//           setMobile={setMobile}
//           setEmail={setEmail}
//           error={error}
//         />

//         {isCustomerSelected && (
//           <>
//            {/* <Picker
//               selectedValue={selectedOptionType}
//               style={styles.picker}
//               onValueChange={(itemValue) => {
//                 setSelectedOptionType(itemValue);
//                 if (itemValue === "Installation") {
//                   setIsModalVisible(true);
//                    // Open dialog when 'Installation' is selected
                   
//                 }
//               }}
//             >
//               <Picker.Item label="Select Type of Call" value="Select Type of Call" />
//               <Picker.Item label="Installation" value= '' />
//               <Picker.Item label="Inspection" value="Inspection" />
//               <Picker.Item label="Breakdown" value="Breakdown" />
//               <Picker.Item label="PPM" value="PPM" />
//               <Picker.Item label="Other" value="option6" />
//             </Picker> */}

// <Picker
//               selectedValue={selectedOptionType}
//               style={styles.picker}
//               onValueChange={(itemValue) => {

//                 switch(itemValue){
//                   case "Installation":
//                     setCallType(0);
//                     break;
//                     case "Inspection":
//                       setCallType(1);
//                     break;
//                     case "Breakdown":
//                       setCallType(2);
//                     break;
//                     case "PPM":
//                       setCallType(4);
//                     break;
//                     case "option6":
//                       setCallType(5);
//                     break;
//                 };
//                 setSelectedOptionType(itemValue);
//                 if (itemValue === "Installation") {
//                   setIsModalVisible(true);
//                    // Open dialog when 'Installation' is selected
                   
//                 }
//               }}
//             >
//               <Picker.Item label="Select Type of Call" value="Select Type of Call" />
//               <Picker.Item label="Breakdown" value="Breakdown" />
//               <Picker.Item label="PPM" value="PPM" />
//               <Picker.Item label="Installation" value="Installation" />
//               <Picker.Item label="Inspection" value="Inspection" />
//               <Picker.Item label="Other" value="option6" />
//             </Picker>

//             {selectedOptionType === "option6"&&(
//               <TextInput
//               styles={styles.input}
//               placeholder=" Enter the Type Of call"
//               Value={otherCall}
//               onChangeText={setOtherCall}
//              />
//             )}
//             {/* {selectedOptionType === "option6" && (
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter Type of call"
//                 value={otherCall}
//                 onChangeText={setOtherCall}
//               />
//             )} */}
              
//               {/* <Picker
//               selectedValue={selectedOptionLocation}
//               style={styles.picker}
//               onValueChange={(itemValue) =>
//                 setSelectedOptionLocation(itemValue)
//               }
//             >
//               <Picker.Item label="Select Location" value="Select Location" />
//               <Picker.Item label="Smart Kitchen" value="Smart Kitchen" />
//               <Picker.Item label="Pantry" value="Pantry" />
//               <Picker.Item label="Gym" value="Gym" />
//               <Picker.Item label="Other" value="optiona5" />
//             </Picker>
//             {selectedOptionLocation === "optiona5" && (
//               <TextInput
//                 style={styles.input}
//                 variant="outlined"
//                 label="Other Location"
//                 value={otherLocation}
//                 onChangeText={setOtherLocation}
//               />
//             )} */}
//             <Insta 
//               customer={customer}
//               isVisible={isModalVisible}
//               onClose={() => setIsModalVisible(false)}
//             />

//             {/* Conditionally render the model search box */}
//             {isCustomerSelected && (
//               <>
              
//                 <TextInput
//                   variant="outlined"
//                   label="Search equipment"
//                   style={styles.searchInput}
//                   value={searchEqpQuery}
//                   onChangeText={handleEqpSearch}
//                 />
                
//                 {filteredEqpData.length > 0 && (
//                   <FlatList
//                     data={filteredEqpData}
//                     keyExtractor={(item) => item.id.toString()}
//                     renderItem={({ item }) => (
//                       <TouchableOpacity
//                         onPress={() => handleSelectEqpItem(item)}
//                       >
//                         <Text style={styles.suggestionItem}>
//                           {item.equipment_name}
//                         </Text>
//                       </TouchableOpacity>
//                     )}
//                   />
//                 )}
//               </>
//             )}

//             {isEqpSelected && (
//               <>
//                 {/* <Text style={styles.label}>Selected Equipment: {selectedEquipmentName}</Text> */}
//                 <View style={styles.card}>
//   <Text style={styles.cardTitle}>Equipment Information</Text>
//   <View style={{Width:1,backgroundColor: "#555", height: 1,}}></View>
//   <View style={styles.infoRow}>
//     <Text style={styles.label}>Selected Equipment:</Text>
//     <Text style={styles.value}>{selectedEquipmentName}</Text>
//   </View>
//   <View style={styles.infoRow}>
//     <Text style={styles.label}>Model/PNC:</Text>
//     <Text style={styles.value}>{selectedModel}</Text>
//   </View>
//   <View style={styles.infoRow}>
//     <Text style={styles.label}>Serial Number:</Text>
//     <Text style={styles.value}>{selectedsno}</Text>
//   </View>
// </View>
//               </>
//             )}

//             {isEqpSelected && (
//               <>
//                 <TextInput
//                   variant="outlined"
//                   label="Nature of complaint/visit"
//                   style={styles.searchInput}
//                   value={visit}
//                   onChangeText={setVisit}
//                   multiline
//                   maxLength={200}
//                   numberOfLines={4}
                
//                 />
//                 <TextInput
//                   variant="outlined"
//                   label="Actual fault"
//                   style={styles.searchInput}
//                   value={actualFault}
//                   onChangeText={setActualFault}
//                   multiline
//                   maxLength={200}
//                   numberOfLines={4}
//                 />
//                 <TextInput
//                   variant="outlined"
//                   label="Action Taken"
//                   style={styles.searchInput}
//                   value={actionteken}
//                   onChangeText={setActionTeken}
//                   multiline
//                   maxLength={200}
//                   numberOfLines={4}

//                 />

// {/* <Picker
//   selectedValue={selectedOptionRemark}
//   style={styles.picker}
//   onValueChange={(itemValue) => setSelectedOptionRemark(itemValue)}
// >
//   <Picker.Item label="Select Remark" value={null} />
//   <Picker.Item label="Faulty/unserviceable" value={3} />
//   <Picker.Item label="Working Fully" value={2} />
//   <Picker.Item label="Working Moderately" value={1} />
//   <Picker.Item label="Not Working" value={0} />
// </Picker> */}

// <Picker
//         selectedValue={selectedValue.toString()}    //it pass as a string if i want pass as int than remove .tosting extention.
//         onValueChange={(value) => setSelectedValue(value)}
//       >
//         {filteredItems.map((item) => (
//           <Picker.Item key={item.value} label={item.label} value={item.value} />
//         ))}
      
//       </Picker>

//                 <TextInput
//                   variant="outlined"
//                   label="Customer Suggestion"
//                   style={styles.searchInput}
//                   value={customersug}
//                   onChangeText={setCustomersug}
//                   multiline
//                   maxLength={200}
//                   numberOfLines={4}
//                 />
//               </>
//             )}

//             <Text style={styles.logoHeading1}>
//               Service Engineer: {user.name}{" "}
//             </Text>

//             {isVisible && (
//               <View>
              
//                 <AddTable setItemsTable={setItemsTable}/>
//               </View>
//             )}

//             <View
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flexDirection: "row",
//                 width: "100%",
//                 marginTop: 10,
//                 marginBottom: 15,
//                 paddingHorizontal: 8,
//               }}
//             >
             
//               <View>
//               <TouchableOpacity
//         style={[
//           styles.customButtontable, 
//           { backgroundColor: isVisible ? 'red' : 'black' } // Change color based on visibility state
//         ]}
//         onPress={handleAddItem}
//       >
//         <Text style={styles.buttonText}>
//           {isVisible ? 'Close Table' : 'Add Spare Parts'} {/* Change text based on visibility */}
//         </Text>
//       </TouchableOpacity>    

  
//               </View>

//               <TouchableOpacity
//                 style={styles.customButton}
//                 onPress={S}
//               > 
//               <Text style={styles.buttonText}>Next</Text>
//               </TouchableOpacity>

//  {/* <View style={styles.signContainer}>  
//   <TouchableOpacity style={styles.customButtonsign} onPress={Ssign}>
//     <Text style={styles.buttonText}>Sign</Text>
//   </TouchableOpacity>
  
//   <Modal visible={signVisible} transparent={true} animationType="slide">
//     <View style={styles.modalBackground}>
//       <View style={styles.modalContainer}>
//         <SignaturePad 
//           isVisible={signVisible} 
//           onOK={handleOnSign} 
//           onClose={handleCloseSign} 
//         />
        
//         <TouchableOpacity style={styles.closeButton1} onPress={handleCloseSign}>
//           <Text style={styles.closeButtonText}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </Modal>

//   {signature && (
//     <Image 
//       resizeMode={"cover"}    
//       style={{ width: 300, height: 180, paddingBottom: 20 }}    
//       source={{ uri: signature }} 
//     />
//   )}
// </View> */}


             
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   customerInfoContainer: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//   },
//   // closeButton1: {
//   //   marginTop: 20, // Adds space above the button
//   //   paddingVertical: 10,
//   //   paddingHorizontal: 20,
//   //   backgroundColor: '#ff0000', // Close button background color
//   //   borderRadius: 5,
//   // },
//   // closeButtonText: {
//   //   color: '#fff', // Close button text color
//   //   fontSize: 16,
//   //   fontWeight: 'bold',
//   // },

//   customerName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   selEqp: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   customerAddress: {
//     fontSize: 14,
//     color: "#555",
//   },
//   contactPerson: {
//     fontSize: 14,
//     color: "#555",
//     marginTop: 5,
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   searchInput: {
//     marginBottom: 20,
//     // other styles
//   },
//   container: {
//     flex: 1,
//     padding: 5,
//     paddingTop: 30,
//     backgroundColor: "#f5f5f5",
//   },
//   dailogBtn: {
//     marginStart: 255,
//     alignSelf: "flex-end",
//     marginEnd: 10,
//     color: "black",
//     borderBlockColor: "black",

//     borderColor: "black",
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     backgroundColor: "#f8f8f8",
//     marginBottom: 10,
//   },
//   image: {
//     width: "33%",
//     height: 50,
//     marginBottom: 15,
//     marginTop: 20,
//     alignSelf: "center",
//   },
//   customButton: {
//     backgroundColor: "green",
//     marginTop: 9,
//     paddingVertical: 6,
//     paddingHorizontal: 24,
//     // marginHorizontal: 120,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "black",
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 5,
//   },
//   customButton: {
//     backgroundColor: "green",
//     marginTop: 9,
//     paddingVertical: 6,
//     paddingHorizontal: 24,
//     // marginHorizontal: 120,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "black",
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 5,
//   },
//   customButtontable: {
//     backgroundColor: "green",
//     marginTop: 9,
//     paddingVertical: 6,
//     paddingHorizontal: 1,
//     // marginHorizontal: 120,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "black",
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 5,
//   },

//   customButtona: {
//     // marginRight: 10,
//     height: 40,
//     marginTop: 9,
//     backgroundColor: "black",
//     paddingVertical: 6,
//     paddingHorizontal: 6,
//     // marginHorizontal: 70,
//     // marginleft:20,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: "black",
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 5,
//     height: 36,
//   },
//   containerasp: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   // customButtonsign: {
//   //   backgroundColor: "green",
//   //   height: 36,
//   //   marginTop: 9,
//   //   paddingVertical: 6,
//   //   paddingHorizontal: 24,
//   //   // marginHorizontal: 120,
//   //   marginStart: 20,
//   //   borderRadius: 8,
//   //   borderWidth: 1,
//   //   borderColor: "black",
//   //   alignItems: "center",
//   //   marginBottom: 15,
//   //   shadowColor: "#000000",
//   //   shadowOffset: { width: 0, height: 10 },
//   //   shadowOpacity: 0.2,
//   //   shadowRadius: 15,
//   //   elevation: 5,
//   // },
//   customButtonadd: {
//     backgroundColor: "black",
//     // marginTop: 20,
//     paddingVertical: 4,
//     paddingHorizontal: 15,
//     marginStart: 255,
//     alignSelf: "flex-end",
//     marginEnd: 10,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: "black",
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 5,
//   },
//   customButtonclose: {
//     marginTop: 10,
//     backgroundColor: "red",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     marginHorizontal: 770,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "black",
//     alignItems: "center",
//     alignSelf: "center",
//     marginBottom: 15,
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 5,
//   },
// //   signContainer:{flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// // height:100,  
// //   },
//   // modalBackground: {
//   //   flex: 1,
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   //   backgroundColor: 'rgba(0, 0, 0, 0.5)', // Makes modal background translucent
//   // },
//   // modalContainer:{
//   //   width: '100%',
//   //   backgroundColor: 'white',
//   //   padding: 20,
//   //   borderRadius: 10,
//   //   alignItems: 'center',},

//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   Line1: {
//     width: "100%",
//     height: 2,
//     backgroundColor: "black",
//     marginVertical: 10,
//     marginBottom: 20,
//   },
//   logoHeading: {
//     fontSize: 18,
//     marginBottom: 8,
//     fontWeight: "bold",
//     alignSelf: "center",
//   },
//   logoHeading1: {
//     fontSize: 18,
//     marginBottom: 12,
//     marginTop: 25,
//     fontWeight: "bold",
//     alignSelf: "center",
//   },
//   errorText: {
//     color: "red",
//     marginBottom: 10,
//   },
//   errorTextd: {
//     color: "red",
//     marginBottom: 10,
//     alignSelf: "center",
//   },
//   searchInput: {
//     marginHorizontal: 10,
//     marginTop: 30,
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   dialogContainer: {
//     width: "80%",
//     padding: 10,
//     backgroundColor: "white",
//     borderRadius: 20,
//     elevation: 5,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   dialogHeader: {
//     marginBottom: 15,
//   },
//   input: {
//     marginTop: 5,
//   },
//   customButtond: {
//     marginTop: 10,
//     //marginRight:50,
//     backgroundColor: "green",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     // marginHorizontal: 20,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "black",
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 5,
//     width: 80,
//   },

//   customButtoncancel: {
//     marginTop: 10,
//     // marginLeft:2,
//     backgroundColor: "#BF0000",
//     paddingVertical: 10,
//     paddingHorizontal: 13,
//     //marginHorizontal: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "black",
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 5,
//     width: 80,
//   },
//   cardContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 3, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     padding: 16,
//     margin: 16,
//   },
//   customerInfoContainer: {
//     // Additional styles for the info container
//   },
//   customerName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   customerAddress: {
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   contactPerson: {
//     fontSize: 16,
//   },

//   customButtons: {
//     marginTop: 20,
//     marginLeft: 35,
//     backgroundColor: "green",
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     marginHorizontal: 120,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "black",
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 5,
//     marginleft: 20,
//   },
//   buttonTextd: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   buttonTextcancle: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   picker: {
//     borderColor: "#ccc",
//     borderWidth: 2,
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     paddingHorizontal: 10,
//     height: 48,
//     justifyContent: "center",
//     elevation: 3,
//     margin: 7,
//     marginTop: 30,
//     marginBottom: 15,
//     marginHorizontal: 10,
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 16,
//     paddingHorizontal:25,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     margin: 16,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#333',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 6,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#555',
//   },
//   value: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// const AppProvider = () => (
//   <Provider>
//     <CustomerInfo />
//   </Provider>
// );

// export default AppProvider;
