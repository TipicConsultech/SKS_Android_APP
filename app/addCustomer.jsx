import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert, View,Button, Image, Text, TouchableOpacity, ImageBackground, ScrollView, BackHandler } from 'react-native';
import { TextInput, IconButton } from '@react-native-material/core';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { post } from './util/api'; // Ensure you have this API util
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
// import loginScreen from "./loginscreen";

// Import token storage functions
import { StoreToken } from './util/asyncStorage'; // Adjust to actual file path

const AddCustomer = () => {
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [serverError, setServerError] = useState([]);
  const [errorName, setErrorName] = useState("");
  const [errorMobile, setErrorMobile] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorPerson, setErrorPerson] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  
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
 
const saveDraft=()=>{
  // console.log('saved');
  
}

  const validate = () => {
    let valid = true;

    if (!customerName) {
        setErrorName('Customer name is required');
        valid = false;
      }  else {
        setErrorName('');
      }

      if (!contactPerson) {
        setErrorPerson('Contact person name is required');
        valid = false;
      }  else {
        setErrorPerson('');
      }

      if (!address) {
        setErrorAddress('address is required');
        valid = false;
      } else {
        setErrorAddress('');
      }

    if (!email) {
      setErrorEmail('Email is required');
      valid = false;
    } else if (/[A-Z]/.test(email)) {
        setErrorEmail('Email must be in lowercase');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        setErrorEmail('Please enter a valid email');
      valid = false;
    } else {
        setErrorEmail('');
    }
    
    if (!mobile) {
      setErrorMobile('Mobile number is required');
      valid = false;
    } else if (!/^[0-9]{10}$/.test(mobile)) {
        setErrorMobile('Enter a valid 10-digit mobile number');
      valid = false;
    } else {
        setErrorMobile('');
    }


    return valid;
  };
 const type=1;
 const blocked = 0;
 const handleRegister = async () => {
  setServerError([]);
    if (validate()) {
      const data = {
      customer_name: customerName,
      address: address,
      contact_person: contactPerson,
      email: email,
      mobile: mobile,
      };
      try {
        const response = await post('/api/createCustomer', data);
   
        
        if (response && !response.errors) {
          setServerError([]);
          // Show a success message after successful registration
          Alert.alert(
            "Success", 
            "Customer created successfully", 
            [
              {
                text: "OK", 
                onPress: () => {
                  router.push('./home'); // Navigate to the login screen
                }
              }
            ]
          );
        } 
   
        else{
          Alert.alert("Please try again.");
        };
      } catch (error) {
        console.error(error);
        Alert.alert("Customer is Failed to Add", "An error occurred. Please try again.");
      }
    }
  };

  const routeToDashBoard =()=>{
    router.push('/home')
   };
  return (
    <View  style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Add Customer</Text>
        <View style={styles.Line}></View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}
         showsVerticalScrollIndicator={false} // Hide vertical scrollbar
         showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
        >
        <TextInput
          label="Customer Name"
          variant="outlined"
          value={customerName}
          onChangeText={setCustomerName}
          leading={(props) => <Icon name="account" {...props} />}
          style={styles.input}
        />
        {errorName ? <Text style={styles.error}>{errorName}</Text> : null}

        <TextInput
          label="Customer's E-mail"
          variant="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leading={(props) => <Icon name="email" {...props} />}
          style={styles.input}
        />
        {errorEmail ? <Text style={styles.error}>{errorEmail}</Text> : null}

        <TextInput
          label="Contact Person Name"
          variant="outlined"
          value={contactPerson}
          onChangeText={setContactPerson}
      
          leading={(props) => <Icon name="account" {...props} />}
          style={styles.input}
        />
        {errorPerson ? <Text style={styles.error}>{errorPerson}</Text> : null}

        <TextInput
          label="Contact Person Mobile"
          variant="outlined"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          leading={(props) => <Icon name="phone" {...props} />}
          style={styles.input}
        />
        {errorMobile ? <Text style={styles.error}>{errorMobile}</Text> : null}

        <TextInput
          label="Customer's Address"
          variant="outlined"
          value={address}
          onChangeText={setAddress}
          leading={(props) => <Icon name="map-marker" size={24} {...props} />}
          style={styles.input}
        />
        {errorAddress ? <Text style={styles.error}>{errorAddress}</Text> : null}


<View style={styles.buttonContainer}>
        
        <TouchableOpacity
          style={styles.buttonBack}
          onPress={routeToDashBoard}
        >
          <Text style={styles.buttonText}>Cancle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        </View>
        {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
        

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',  // Align buttons horizontally
    justifyContent: 'space-between',  // Space out the buttons evenly
    paddingHorizontal: 20,  // Add horizontal padding around the container
    marginTop: 20,  // Add margin on top for spacing
  },
  scrollViewContent: {
    paddingBottom: 50,
    paddingTop: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'start',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 13,
    paddingHorizontal: 62,
    borderRadius: 5,
    marginBottom:20
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignSelf: 'center',
  
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignSelf: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop:50,
  },
  input: {
    marginTop:25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:20
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 8,
  },
  genderText: {
    fontSize: 16,
    marginLeft: 5,
  },
  error: {
    fontSize: 14,
    color: 'red',
   
  },
  buttonBack: {
    backgroundColor: 'red',  // Button color (adjust as needed)
    paddingVertical: 10,  // Vertical padding for button height
    paddingHorizontal: 30,  // Horizontal padding for width
    borderRadius: 5,  // Rounded corners
  },
  buttonRegister: {
    backgroundColor: 'black',  // Button color (adjust as needed)
    paddingVertical: 10,  // Vertical padding for button height
    paddingHorizontal: 40,  // Horizontal padding for width
    borderRadius: 5,  // Rounded corners
  },
  buttonText: {
    color: '#FFFFFF',  // Text color
    fontSize: 13,  // Font size
      // Bold text
    textAlign: 'center',  // Center text within the button
  },
  Line: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
    marginVertical: 3,
    marginBottom: 30,
  },
});

export default AddCustomer;
