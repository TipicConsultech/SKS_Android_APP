import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
// import * as ImagePicker from 'expo-image-picker';
import { getUser } from './util/asyncStorage';  
import male from '../assets/images/Person.png'
import female from '../assets/images/Woman.png'
import { getAPICall } from './util/api';
import { deletePayload, fetchPayloads, savePayloadToAsyncStorage } from './util/drafts';

// const dd =(getUser);
// console.log(dd);
const ProfilePage = () => {
    const [profileData, setProfileData] = useState({
      name: '',
      id:0,
      address: '',
      mobileNo: '',
      email: '',
      gender: '',
      type:null,
      profilepic: '', 
    });
  
    useEffect(() => {
      const fetchUserData = async () => {
        const user = await getUser();
        if (user) {
          // Update profileData with user information
          setProfileData({
            name: user.name,
            id: user.id,
            type:user.type,
            address: user.address || '',
            mobileNo: user.mobile || '',
            email: user.email,
            gender: user.gender || '',
            
          });
        }
      };

    
  
      fetchUserData();  // Fetch user data on component mount
      
    }, []);

async function add(){
  const payload = {
    signature_by: "John Doe", // Example customer name
    remark: "Replaced faulty cable and tested successfully.",
    nature_complaint: "Power outage in unit 3",
    actual_fault: "Damaged cable in the main power line",
    action_taken: "Replaced the damaged cable and checked connections.",
    customer_suggestion: "Ensure routine maintenance to avoid such issues.",
    signature: "base64EncodedSignatureString", // Example signature in base64 format
    report_id: 1234, // Example report ID
    created_by: 5678, // Example user ID
    spare_parts: [
      {
        description: "Power Cable - 10 meters",
        qty: 2,
        remark: "High voltage resistant",
      },
      {
        description: "Fuse - 20A",
        qty: 5,
        remark: "Stocked for future replacements",
      },
    ],
  };

  let data= null;

  try {
    // Wait for the data to be fetched
     data = await fetchPayloads();

    
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  if (data !== null ) {
    console.log(data.length);
    
    addPayloadIfNotExists(data, payload);
  } else {
    console.log("Data is either null or empty, payload not added.");
  }
}
    

async function addPayloadIfNotExists(array, newPayload) {
  // Check if a JSON object with the same report_id exists in the array
  const isPresent = await array.some((item) => item.report_id === newPayload.report_id);
 
  if (isPresent) {
    // Show an alert if the report_id is already present
    alert(`JSON data with report_id ${newPayload.report_id} is already present.`);
    deletePayload(newPayload.report_id); 
  } else {
    // Add the new payload to the array
   savePayloadToAsyncStorage(newPayload)
    console.log(array);
    
  }
}


    useEffect(() => {
      const fetchUserImage = async () => {
        const response= await getAPICall(`/api/userImage/${profileData.id}`);
        
        setProfileData((prevUserData) => ({
          ...prevUserData, // Spread the previous user data
          profilepic: response, // Add or update the profilepic property
        }));
      }
  
      fetchUserImage();
    },[profileData.id]);
  
    const getProfileImage = () => {
      return profileData.gender.toLowerCase() === '' ? female : male ;
    };
    let usertype='';
   if(profileData.type===1){
    usertype='Service Engineer'
   }
   else(usertype='Admin')
    return (
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.name}>{usertype}</Text>
  
        {/* Profile Picture */}
        <TouchableOpacity>
          {/* <Image source={profileData.profilePic} style={styles.profilePic} /> */}
          

{profileData ? (
      <Image
      source={{ uri: `data:image/jpeg;base64,${profileData.profilepic}` }}
      style={styles.profilePic}// Use style for dimensions // Use style for dimensions
      />
    ):(<Image
      source={require('../assets/images/Person.png')}
      style={styles.profilePic}// Use style for dimensions // Use style for dimensions
    />)}
        </TouchableOpacity>
  
        {/* User ID */}
        <View style={styles.field}>
  <Ionicons name="person-circle" size={24} color="black" />
  <TextInput
    style={styles.input}
    value={String(`Id: ${profileData.id}`)} // Ensure id is converted to string.
    editable={false}
  />
</View>
  
        {/* Name Field */}
        <View style={styles.field}>
          <Ionicons name="person" size={24} color="black" />
          <TextInput
            style={styles.input}
            value={profileData.name}
            editable={false}
          />
        </View>
  
        {/* Gender Field */}
        <View style={styles.field}>
          <Ionicons name="male-female" size={24} color="black" />
          <TextInput
            style={styles.input}
            value={profileData.gender}
            editable={false}
          />
        </View>
  
        {/* Address Field */}
        <View style={styles.field}>
          <Ionicons name="home" size={24} color="black" />
          <TextInput
            style={styles.input}
            value={profileData.address}
            placeholder="Address"
            editable={false}
          />
        </View>
  
        {/* Mobile Number Field */}
        <View style={styles.field}>
          <Ionicons name="call" size={24} color="black" />
          <TextInput
            style={styles.input}
            value={profileData.mobileNo}
            placeholder="Mobile No"
            editable={false}
          />
        </View>
  
        {/* Email ID Field */}
        <View style={styles.field}>
          <Ionicons name="mail" size={24} color="black" />
          <TextInput
            style={styles.input}
            value={profileData.email}
            placeholder="Email ID"
            editable={false}
          />
        </View>
  
        {/* Back Button */}
        <TouchableOpacity 
      style={styles.button} 
      onPress={() => router.push('/profile')}
    >
      <Text style={styles.buttonText}>Back</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.button} 
      onPress={() => add()}
    >
      <Text style={styles.buttonText}>add</Text>
    </TouchableOpacity>

    
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    padding: 12, // Padding of 2 in terms of Tailwind translates to 8 pixels
    borderRadius: 4, // Optional: Add some border radius for better appearance
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold', // Optional: Make the text bold
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 75,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  signatureLabel: {
    fontSize: 18,
    marginVertical: 10,
  },
  signature: {
    width: 200,
    height: 100,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  input: {
    borderBottomWidth: 0,
    borderColor: '#ccc',
    marginLeft: 15,
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  signatureLabel: {
    fontSize: 18,
    marginVertical: 10,
    color: '#555',
    alignSelf: 'flex-start',
  },
  signature: {
    width: '90%',
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default ProfilePage;
