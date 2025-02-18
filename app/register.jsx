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

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [serverError, setServerError] = useState([]);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [imageError, setImageError] = useState('');
 const[confirmPassword, setConfirmPassword] = useState('');
 const[confirmPasswordError, setConfirmPasswordError] = useState('');

 const [imgButtonName, setImgButtonName] = useState('Select Image');
 const [selectedImage, setSelectedImage] = useState(null);
  const [profilepic, setBase64String] = useState('');

  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [imageName, setImageName] = useState('');
  const backgroundImage = require('../assets/images/white_Phone.png'); // Replace with your image path

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
  
}

useEffect(() => {
  // Update button name based on selectedImage
  if (selectedImage === null) {
    setImgButtonName('Select Image');
  } else {
    setImgButtonName('Cancel');
  }
}, [selectedImage]);

const pickImage = async () => {
  try {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need media library permissions to make this work!');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true, // Request Base64 string
      allowsEditing: true, // Allow editing
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setBase64String(result.assets[0].base64);

      // Extract image name from the URI
      const uriParts = result.assets[0].uri.split('/');
      const name = uriParts[uriParts.length - 1];
      setImageName(name);
    } else {
      // If the user cancels the image selection
      setSelectedImage(null);
    }
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'An error occurred while picking the image. Please try again.');
  }
};

const cancleImage = async () => {
  setSelectedImage(null);
  setBase64String('');
  setImageName('');
}

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validate = () => {
    let valid = true;

   
    // // if (!selectedImage && !profilepic) {
    // //   setImageError('image is require');
    // //   valid = false;
    // // } else {
    // //   setImageError('');
    // // }

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (/[A-Z]/.test(email)) {
      setEmailError('Email must be in lowercase');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }
    
    

    if (!mobile) {
      setMobileError('Mobile number is required');
      valid = false;
    } else if (!/^[0-9]{10}$/.test(mobile)) {
      setMobileError('Enter a valid 10-digit mobile number');
      valid = false;
    } else {
      setMobileError('');
    }
    // if (!address) {
    //   setAddressError('Password is required');
    //   valid = false;
    // } else {
    //   setAddressError('');
    // }

    // const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)[a-zA-Z\d!@#$%^&*]{6,}$/;
    
    // if (!password) {
    //   setPasswordError('Password is required');
    //   valid = false;
    // } else if (!passwordRegex.test(password)) {
    //   setPasswordError('Password must be at least 6 characters long, include one number and one special character');
    //   valid = false;
    // } else {
    //   setPasswordError('');
    // }
  
  
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    

    return valid;
  };
 const type=1;
 const blocked = 0;
 const handleRegister = async () => {
  setServerError([]);
    if (validate()) {
      const data = {
        name,
        email,
        type,
        mobile,
        password,
        gender,
        address,
        blocked,
      };
      if (profilepic !== "") {
        data.profilepic = profilepic;
      }
      try {
        const response = await post('/api/register', data);
   
        
        if (response && !response.errors) {
          setServerError([]);
          // Show a success message after successful registration
          Alert.alert(
            "Success", 
            "User created successfully", 
            [
              {
                text: "OK", 
                onPress: () => {
                  router.push('/'); // Navigate to the login screen
                }
              }
            ]
          );
        } 
        else if(response.errors) {
         
         
           if (response.errors.name) {
      setNameError(response.errors.name);
      valid = false;
    } else {
      setNameError('');
    }

    // // if (!selectedImage && !profilepic) {
    // //   setImageError('image is require');
    // //   valid = false;
    // // } else {
    // //   setImageError('');
    // // }

    if (response.errors.email) {
      setEmailError(response.errors.email);
      valid = false;
    }  else {
      setEmailError('');
    }
    if (response.errors.mobile) {
      setMobileError(response.errors.mobile);
      valid = false;
    }  else {
      setMobileError('');
    }
    if (response.errors.address) {
      setAddressError(response.errors.address);
      valid = false;
    } else {
      setAddressError('');
    }
    if (response.errors.password) {
      setPasswordError(response.errors.password);
      valid = false;
    } else {
      setPasswordError('');
    }
    if (response.errors.gender) {
      setGenderError(response.errors.gender);
      valid = false;
    } else {
      setGenderError('');
    }
          
        
        }
        else{
          Alert.alert("Please try again.");
        };
      } catch (error) {
        console.error(error);
        Alert.alert("Registration Failed", "An error occurred. Please try again.");
      }
    }
  };

  const handleGenderSelection = (selectedGender) => {
    setGender(selectedGender);
    setGenderError('');
  };
  const routeToDashBoard =()=>{
    router.push('/home')
   };
  return (
    <View  style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Register</Text>
        <View style={styles.Line}></View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}
         showsVerticalScrollIndicator={false} // Hide vertical scrollbar
         showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
        >
        <TextInput
          label="Name"
          variant="outlined"
          value={name}
          onChangeText={setName}
          leading={(props) => <Icon name="account" {...props} />}
          style={styles.input}
        />
        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}


        <View style={styles.genderContainer}>
      <Text style={styles.label}>Gender :</Text>
        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => handleGenderSelection('Male')}
        >
          <Icon
            name={gender === 'Male' ? 'radiobox-marked' : 'radiobox-blank'}
            size={24}
            color={gender === 'Male' ? '#007AFF' : '#999'}
          />
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => handleGenderSelection('Female')}
        >
          <Icon
            name={gender === 'Female' ? 'radiobox-marked' : 'radiobox-blank'}
            size={24}
            color={gender === 'Female' ? '#007AFF' : '#999'}
          />
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>
        {genderError ? <Text style={styles.error}>{genderError}</Text> : null}



        <TextInput
          label="E-mail"
          variant="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leading={(props) => <Icon name="email" {...props} />}
          style={styles.input}
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        <TextInput
          label="Mobile"
          variant="outlined"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          leading={(props) => <Icon name="phone" {...props} />}
          style={styles.input}
        />
        {mobileError ? <Text style={styles.error}>{mobileError}</Text> : null}
        <TextInput
          label="Address"
          variant="outlined"
          value={address}
          onChangeText={setAddress}
          leading={(props) => <Icon name="map-marker" size={24} {...props} />}
          style={styles.input}
        />
        {addressError ? <Text style={styles.error}>{addressError}</Text> : null}


        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ width: 200, height: 200, marginTop: 10,marginBottom: 10 }}
        />
      )}

      <View style={styles.row}>
        <TouchableOpacity style={styles.button}  onPress={selectedImage ? cancleImage : pickImage}>
          <Text style={styles.buttonText}>{imgButtonName}</Text>
        </TouchableOpacity>
      </View>
     
    </View>
    {imageError ? <Text style={styles.error}>{imageError}</Text> : null}




        <TextInput
          label="Password"
          variant="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          trailing={(props) => (
            <IconButton
              icon={(iconProps) => (
                <Icon name={isPasswordVisible ? "eye-off" : "eye"} {...iconProps} />
              )}
              onPress={togglePasswordVisibility}
              {...props}
            />
          )}
          style={styles.input}
        />
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
        <TextInput
          label="Confirm Password"
          variant="outlined"
          value={confirmPassword}
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />
        {confirmPasswordError ? <Text style={styles.error}>{confirmPasswordError}</Text> : null}

    
  

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
    marginBottom: 18,
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
    marginBottom: 10,
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

export default RegisterScreen;
