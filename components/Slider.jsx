import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { getAPICall, post } from '../app/util/api';
const { height } = Dimensions.get("window");

const BottomSheet = ({ Enabled, setIsEnabled, userType}) => {
  const translateY = useRef(new Animated.Value(height)).current; // Start at the bottom
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [callTypeOpen, setCallTypeOpen] = useState(false);
  const [remarkOpen, setRemarkOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedEquipment, setSelectedEquipent] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [selectedServiceEnggId, setSelectedServiceEnggId] = useState(null);

  
  const [allRemarks, setAllRemarks] = useState([
    { value: 0, label: "Not Working" },
    { value: 1, label: "Working Moderately" },
    { value: 2, label: "Working Fully" },
    { value: 3, label: "Faulty/unserviceable" },
  ]);
  const [selectedRemark, setSelectedRemark] = useState([]);
  const [allCallType, setAllCallType] = useState([
    { value: 0, label: "Breakdown" },
    { value: 1, label: "PPM" },
    { value: 2, label: "Installation" },
    { value: 3, label: "Inspection" },
    { value: 5, label: "other" },

  ]);
  const [selectedCallType, setSelectedCallType] = useState([]);
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(0);

  
  const [searchText, setSearchText] = useState("");

  const [userText, setUserText] = useState("");

  const [users, setUsers] = useState([]);
  // Fetch customers from API when searchText changes
  useEffect(() => {
    if (searchText.length > 0) {
      fetchCustomers(searchText);
    }
    else if(searchText.length <= 0){
      setCustomers([])

    }
  }, [searchText]);

  useEffect(() => {
    if (userText.length > 0) {
      fetchUsers(userText);
    }
    else if(searchText.length <= 0){
      setUsers([])

    }
  }, [userText]);

  useEffect(() => {
    fetchLocation(selectedCustomerId);
  }, [selectedCustomerId]);

  useEffect(() => {
    fetchEqueipment();
  }, [selectedCustomerId,locations]);

  const fetchLocation = async (custID) => {
    try {
      const response = await getAPICall(`/api/getLocationsByCompany/${custID}`);
  
  
      if (!Array.isArray(response)) {
        console.error("Expected an array but got:", response);
        return;
      }
  
      const locationList = response.map((item) => ({
        label: item,
        value: item, // Store ID as value
      }));

  
      
  
      setLocations(locationList);
   
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // console.log(selectedLocations[0] !== "all" && locationOpen===false);


  
  const fetchEqueipment = async () => {
    
  const payload ={
    'location': selectedLocations[0] === undefined ? ["all"]:selectedLocations,
    'customer_id':selectedCustomerId
  } 

  
  if(selectedCustomerId !== 0){

    try {
      const response = await post(`/api/getEquipments`,payload);

  
      if (!Array.isArray(response)) {
        console.error("Expected an array but got:", response);
        return;
      }
  
      const equipmentList = response.map((item) => ({
        label: item.equipment_name,
        value: item.equipment_name, // Store ID as value
      }));

     
      
  
      setEquipments(equipmentList);
   
    } catch (error) {
      console.error("Error fetching locations:", error);
    }

  }
  };
  

  const fetchCustomers = async (search) => {
  
    try {
      const response = await post(
        "/api/getCustomerByName",
        { search }
      );
   
      
      const customerList = response.map((item) => ({
        label: item.customer_name,
        value: item.id, // Store ID as value
      }));
      setCustomers(customerList);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
 
  };

  const fetchUsers = async (search) => {
  
    try {
      const response = await post(
        "/api/allUser",{ search }
      );
   
      
      const customerList = response.map((item) => ({
        label: item.name,
        value: item.id, // Store ID as value
      }));
      setUsers(customerList);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
 
  };
  // Function to open the bottom sheet (Move Up)
  const openSheet = () => {
    Animated.timing(translateY, {
      toValue: height * 0.008, // Moves up (70% visible)
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to close the bottom sheet (Move Down)
  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: height, // Moves back down (fully hidden)
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsEnabled(false)); // Set visibility state to false after animation completes
  };

  // Effect to handle Enabled prop changes
  useEffect(() => {
    if (Enabled) {
      openSheet(); // Open when Enabled is true
    } else {
      closeSheet(); // Close when Enabled is false
    }
  }, [Enabled]);

  return Enabled ? (
    <View style={styles.overlayContainer}>
    <TouchableOpacity onPress={closeSheet} />
  
    <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }]}>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Filters</Text>
        <TouchableOpacity onPress={closeSheet}>
          <Text style={styles.closeButton}>X</Text>
        </TouchableOpacity>
      </View>
  
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} style={{ width: "100%" }}>
        {/* Wrap dropdowns inside a ScrollView */}
        <View style={styles.container}>
        {(open === false && remarkOpen === false && callTypeOpen === false && locationOpen === false && searchOpen === false) && (
          <>
            
              <Text style={styles.label}>Service Engineer</Text>
              <DropDownPicker
                open={userOpen}
                setOpen={setUserOpen}
                items={users}
                value={selectedServiceEnggId}
                setValue={setSelectedServiceEnggId}
                searchable
                searchPlaceholder="Search Service Engineer..."
                onChangeSearchText={setUserText}
                placeholder="Select a customer"
                style={styles.dropdown}
                listMode="MODAL"
              />
           
          </>
        )}

{(open === false && remarkOpen === false && callTypeOpen === false && locationOpen === false && userOpen === false) && (
          <>
            
              <Text style={styles.label}>Customer</Text>
              <DropDownPicker
                open={searchOpen}
                setOpen={setSearchOpen}
                items={customers}
                value={selectedCustomerId}
                setValue={setSelectedCustomerId}
                searchable
                searchPlaceholder="Search Customer..."
                onChangeSearchText={setSearchText}
                placeholder="Select a customer"
                style={styles.dropdown}
                listMode="MODAL"
              />
           
          </>
        )}
  
        {(open === false && remarkOpen === false && callTypeOpen === false) && (
          <>
            <Text style={styles.label}>Select Location</Text>
            <DropDownPicker
              open={locationOpen}
              setOpen={setLocationOpen}
              value={selectedLocations}
              setValue={setSelectedLocations}
              items={locations}
              setItems={setLocations}
              multiple
              mode="BADGE"
              placeholder="Select an option"
              style={{ marginBottom: locationOpen ? 260 : 5 }}
              dropDownContainerStyle={{ maxHeight: 250 }}
              listMode="SCROLLVIEW"
            />
          </>
        )}
  
        {(selectedLocations.length > 0 && locationOpen === false && remarkOpen === false && callTypeOpen === false) && (
          <>
            <Text style={styles.label}>Select Equipment</Text>
            <DropDownPicker
              open={open}
              setOpen={setOpen}
              value={selectedEquipment}
              setValue={setSelectedEquipent}
              items={equipments}
              setItems={setEquipments}
              multiple
              mode="BADGE"
              placeholder="Select an option"
              style={styles.dropdown}
              dropDownContainerStyle={{ maxHeight: 250 }}
              listMode="SCROLLVIEW"
            />
          </>
        )}
  
        {(open === false && remarkOpen === false && locationOpen === false) && (
          <>
            <Text style={styles.label}>Call Type</Text>
            <DropDownPicker
              open={callTypeOpen}
              setOpen={setCallTypeOpen}
              value={selectedCallType}
              setValue={setSelectedCallType}
              items={allCallType}
              setItems={setAllCallType}
              multiple
              mode="BADGE"
              placeholder="Select an option"
              style={{ marginBottom: callTypeOpen ? 180 : 5 }}
              dropDownContainerStyle={{ maxHeight: 250 }}
              listMode="SCROLLVIEW"
            />
          </>
        )}
  
        {(open === false && locationOpen === false && callTypeOpen === false) && (
          <>
            <Text style={styles.label}>Remark</Text>
            <DropDownPicker
              open={remarkOpen}
              setOpen={setRemarkOpen}
              value={selectedRemark}
              setValue={setSelectedRemark}
              items={allRemarks}
              setItems={setAllRemarks}
              multiple
              mode="BADGE"
              placeholder="Select an option"
              style={{ marginBottom: remarkOpen ? 220 : 5 }}
              dropDownContainerStyle={{ maxHeight: 250 }}
              
            />
          </>
        )}
  
        {(remarkOpen === false && callTypeOpen === false && open === false && searchOpen === false && locationOpen === false) && (
          <>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center", gap: 10, marginBottom: 30 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#000",
                  borderRadius: 8,
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  marginVertical: 5,
                  backgroundColor: "black"
                }}
                onPress={() => console.log("Apply clicked")}
              >
                <Text style={{ textAlign: "center", color: "white" }}>Apply</Text>
              </TouchableOpacity>
  
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#000",
                  borderRadius: 8,
                  paddingHorizontal: 5,
                  backgroundColor: "red",
                  paddingVertical: 10,
                  marginVertical: 5
                }}
                onPress={() => console.log("Remove Filter clicked")}
              >
                <Text style={{ textAlign: "center", color: "white" }}>Remove Filter</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
         </View>
      </ScrollView>
    </Animated.View>
  </View>
  
  ) : null;
};

export default BottomSheet;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    top:30,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  overlayContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 0,
    zIndex: 15, // Ensure it's above other content
  },
  // overlay: {
  //   position: "absolute",
  //   top: 90,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: "rgb(255,255,255)", // Dim background
  // },
  bottomSheet: {
    position: "absolute",
    width: "100%",
    height: "100%", // 70% of the screen
    backgroundColor: "#fff",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10, // Shadow effect
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 20,
    color: "red",
  },
  sheetContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
