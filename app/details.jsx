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
import { useLocalSearchParams, useRouter } from "expo-router";
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
import Draft from "../assets/images/draft.png"
import { useRoute } from "@react-navigation/native";
import AddTable from "../components/addItem";
import { getUser } from "./util/asyncStorage";
import { fetchPayloads, savePayloadToAsyncStorage } from "./util/drafts";

const CustomerInfo = () => {

  const route = useRoute();
  // const { r_id } = route.params ;
  // const { remark } = route.params ;
  const { reportNumber, remark } = useLocalSearchParams();
  console.log("Received ID:", reportNumber);
  console.log("Received Remark:",remark );


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
                { text: "Ok", onPress: () => router.push('./profile') }
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
 
const saveDraft=()=>{
  console.log('saved');
  
}

 const [itemsTable, setItemsTable] = useState([]);
console.log(itemsTable);

 
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [mobile, setMobile] = useState("");
  // const [equipmentName, setequipmentName] = useState();
  const [customersug, setCustomersug] = useState("");

  const [visit, setVisit] = useState("");
  const [actualFault, setActualFault] = useState("");
  const [actionteken, setActionTeken] = useState("");
  const [selectedOptionremark, setSelectedOptionremark] = useState("");
  const [selectedOptionType, setSelectedOptionType] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [nextBtnVisible, setNextBtnVisible] = useState(true);
  

  const router = useRouter();
//   const [otherCall, setOtherCall] = useState("");
//   const [otherLocation, setOtherLocation] = useState("");
//   const [reportNumber, setReportNumber] = useState(1);
//   const [selectedModel, setSelectedModel] = useState("");

//   const [signature, setSignature] = useState(null); 
//   const [signVisible, setSignVisible] = useState(false)

  const [user, setUser] = useState({ 
    name: '', 
  });
  
  const [currentValue, setCurrentValue] = useState(0); 
  const [selectedValue, setSelectedValue] = useState("Select Remark"); 
  const [allDrafts, setAllDraft] = useState(null); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


 

  useEffect(() => {
    const fetchUserData = async () => {
  
      try {
        // Wait for the data to be fetched
         const data = await fetchPayloads();
         setAllDraft(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAllDraft(null);
      }
      const userData = await getUser(); // Fetch the user data
      if (userData) {
        // Update state with user information
        setUser({
          name: userData.name,
          id: userData.id, // Ensure this is an integer
          address: userData.address || '',
          mobileNo: userData.mobile || '',
          email: userData.email,
          gender: userData.gender || '',
        });
      }
    };
  
    fetchUserData();  // Fetch user data on component mount
  }, []);
 

  // const pickerItems = [
  //   { label: "Select Remark", value: "Select Remark" },
  //   { label: "Not Working", value: "0" },
  //   { label: "Working Moderately", value: "1" },
  //   { label: "Working Fully", value: "2" },
  //   { label: "Faulty/unserviceable", value: "3" },
  // ];

  // // Filter items based on currentValue
  // const filteredItems = pickerItems.filter(
  //   (item) => parseInt(item.value) >= currentValue || isNaN(item.value)
  // );

  const pickerItems = [
    { label: "Select Remark", value: "Select Remark" },
    { label: "Not Working", value: "0" },
    { label: "Working Moderately", value: "1" },
    { label: "Working Fully", value: "2" },
    { label: "Faulty/unserviceable", value: "3" },
  ];
  
  // Dynamic filtering based on remark
  const filteredItems = pickerItems.filter((item) => {
    // Convert value to a number, ignoring non-numeric values like "Select Remark"
    const numericValue = parseInt(item.value);
    
    // Display all fields if remark is "0"
    if (remark === "0") {
      return true;
    }
  
    // Show only items with value >= currentValue, or non-numeric items
    return numericValue >= parseInt(remark) || isNaN(remark);
  });
  
  // Example usage
  console.log(filteredItems);
  

  const handleAddItem = () => {
    setIsVisible(!isVisible); // Show the table when the button is clicked
    if(isVisible==false){
      setNextBtnVisible(false);
    }
    else{
      setNextBtnVisible(true);
    }
  };
  const handlecancel = () => {
    setIsVisible(false); // Show the table when the button is clicked
    
  };
  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit =() =>{
    router.push('/enggprofile')
  }


  async function saveAsDraft() {
    if (isButtonDisabled) return;
    if (!visit || !actualFault || !actionteken || selectedValue === "Select Remark" || !customersug) {
      Alert.alert("Validation Error", "All fields are required to proceed.");
      return;
    }

    const payload = {
      remark: selectedValue,
      nature_complaint: visit,
      actual_fault: actualFault,
      action_taken: actionteken,
      customer_suggestion: customersug,
      report_id: reportNumber,
      created_by: user.id,
      spare_parts: itemsTable
        ? itemsTable.map((item) => ({
            description: item.description,
            qty:parseInt(item.quantity, 10),
            remark: item.remark,
          }))
        : [],
    };
   if(allDrafts!== null){
  addPayloadIfNotExists(allDrafts,payload);
   }
   
  }

  async function addPayloadIfNotExists(array, newPayload) {
    // Check if a JSON object with the same report_id exists in the array
    const isPresent = await array.some((item) => item.report_id === newPayload.report_id);
   
    if (isPresent) {
      // Show an alert if the report_id is already present
      alert(`Draft with Same Report ${newPayload.report_id} is already present.`);
    
    } else {
      setIsButtonDisabled(true);
      // Add the new payload to the array
    const responce= await savePayloadToAsyncStorage(newPayload)
       if(responce===true){
        alert("Draft Saved Succefully");
        router.push('./profile');
       }
      
    }
  }


  async function addPayloadIfNotExists(array, newPayload) {
    // Check if a JSON object with the same report_id exists in the array
    const isPresent = await array.some((item) => item.report_id === newPayload.report_id);
   
    if (isPresent) {
      // Show an alert if the report_id is already present
      alert(`Draft with Same Report ${newPayload.report_id} is already present.`);
    
    } else {
      // Add the new payload to the array
    const responce= await savePayloadToAsyncStorage(newPayload)
       if(responce===true){
        alert("Draft Saved Succefully");
        router.push('./profile');
       }
      
    }
  }


  
  const handleSubmit2 = () => {
    // Validation: Check if all required fields are filled
    if (!visit || !actualFault || !actionteken || selectedValue === "Select Remark" || !customersug) {
      Alert.alert("Validation Error", "All fields are required to proceed.");
      
    }
    else if(visit && actualFault && actionteken && selectedValue !== "Select Remark" && customersug)
    addPayloadIfNotExists1(allDrafts,reportNumber);
  };

  async function addPayloadIfNotExists1(array, id) {
    // Check if a JSON object with the same report_id exists in the array
    const isPresent = await array.some((item) => item.report_id === id);
   
    if (isPresent) {
      // Show an alert if the report_id is already present
      alert(`Draft with Same Report ${id} is already present.`);
    
    } else {
      const reportData = {
        report_id: reportNumber,
        nature_complaint: visit,
        actual_fault: actualFault,
        action_taken: actionteken,
        remark: parseInt(selectedValue),
        customer_suggestion: customersug,
      };
    
      router.push({
        pathname: 'reportPageAssign',
        params: {
          reportDetailsData: JSON.stringify(reportData),
          itemData: JSON.stringify(itemsTable),
          report_id: reportNumber,
        }, // Pass data as string
      });
    }
  }
    
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
          
          
              <>
              <Text style={styles.logoHeading1}>
              Service Engineer: {user.name}{" "}
            </Text> 

                <TextInput
                  variant="outlined"
                  label="Nature of complaint/visit"
                  style={styles.searchInput}
                  value={visit}
                  onChangeText={setVisit}
                  multiline
                  maxLength={200}
                  numberOfLines={4}
                
                />
                <TextInput
                  variant="outlined"
                  label="Actual fault"
                  style={styles.searchInput}
                  value={actualFault}
                  onChangeText={setActualFault}
                  multiline
                  maxLength={200}
                  numberOfLines={4}
                />
                <TextInput
                  variant="outlined"
                  label="Action Taken/To be Taken"
                  style={styles.searchInput}
                  value={actionteken}
                  onChangeText={setActionTeken}
                  multiline
                  maxLength={200}
                  numberOfLines={4}

                />


      
                 
                <TextInput
                  variant="outlined"
                  label="Finally Status"
                  style={styles.searchInput}
                  value={customersug}
                  onChangeText={setCustomersug}
                  multiline
                  maxLength={200}
                  numberOfLines={4}
                />

{isVisible && (
              <View>
              
                <AddTable setItemsTable={setItemsTable} setNextBtnVisible={setNextBtnVisible}/>
              </View>
            )}

<View>
              <TouchableOpacity
        style={[
          styles.customButtontable, 
          { backgroundColor: isVisible ? 'red' : 'black',
            paddingHorizontal:10
           } // Change color based on visibility state
        ]}
        onPress={handleAddItem}
      >
        <Text style={styles.buttonText}>
          {isVisible ? 'Close Table' : 'Add Spare Parts'} {/* Change text based on visibility */}
        </Text>
      </TouchableOpacity>    

  
              </View>

<Picker  style={styles.picker}
      
      selectedValue={selectedValue.toString()}    //it pass as a string if i want pass as int than remove .tosting extention.
      onValueChange={(value) => setSelectedValue(parseInt(value))}
    >
      {filteredItems.map((item) => (
        <Picker.Item key={item.value} label={item.label} value={item.value} />
      ))}
     {/* <Picker.Item label="Select Remark" value="Select Remark" />
                  <Picker.Item label="Not Working" value="0" />
                  <Picker.Item label="Working Moderately" value="1" />
                  <Picker.Item label="Working Fully" value="2" />
                  <Picker.Item label="Faulty/unserviceable" value="3" />

                </Picker> */}
    </Picker>
            

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                marginTop: 10,
                marginBottom: 15,
                paddingHorizontal: 8,
              }}
            >
             
             { nextBtnVisible && (<TouchableOpacity
                style={styles.customButtonDraft}
                onPress={saveAsDraft}
                disabled={isButtonDisabled}
              > 
              <Text style={styles.buttonTextDraft}>Save As Draft</Text>
              <Image
    source={Draft} // Replace with the correct path to your PNG icon
    style={{
      width: 20, // Width of the icon
      height: 20, // Height of the icon
      
    }}
  />
              </TouchableOpacity>)}

             { nextBtnVisible && (<TouchableOpacity
                style={styles.customButton}
                onPress={handleSubmit2}
              > 
              <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>)}

             
            </View>
          </>
        
      </ScrollView>
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

  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
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
    marginBottom: 5,
    // other styles
  },
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 30,
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
    width: "33%",
    height: 50,
    marginBottom: 15,
    marginTop: 20,
    alignSelf: "center",
  },
 
  customButton: {
    backgroundColor: "black",
    marginTop: 9,
    paddingVertical: 6,
    paddingHorizontal: 24,
    // marginHorizontal: 120,
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
  },

  customButtonDraft: {
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    marginTop: 9,
    paddingVertical: 6,
    paddingHorizontal: 24,
    // marginHorizontal: 120,
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
  },
  customButtontable: {
    backgroundColor: "green",
    marginTop: 15,
    paddingVertical: 6,
    
    
    marginHorizontal: 90,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginBottom: 5,
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
    fontSize: 13,
    fontWeight: "bold",
  },
  buttonTextDraft: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
    paddingRight:4
  },
  Line1: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    marginVertical: 10,
    marginBottom: 20,
  },
  logoHeading: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
    alignSelf: "center",
  },
  logoHeading1: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 10,
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
    backgroundColor: "green",
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
    backgroundColor: "#BF0000",
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
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextcancle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});

const AppProvider = () => (
  <Provider>
    <CustomerInfo />
  </Provider>
);

export default AppProvider;
