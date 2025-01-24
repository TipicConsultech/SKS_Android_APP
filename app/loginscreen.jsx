import React, { useState } from 'react';
import { StyleSheet, Alert, View, Text,TouchableOpacity, ImageBackground ,Vibration} from 'react-native';
import {TextInput, IconButton } from '@react-native-material/core';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login, post}from './util/api'; // Ensure you have this API util
import { router, useRouter, userouter } from 'expo-router';



// Import token storage functions
import { getToken, storeToken, storeUserData } from './util/asyncStorage'; // Adjust to actual file path
import { Redirect } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showEmailSuggestion, setShowEmailSuggestion] = useState(true);
  const [setModalVisible] = useState(false);
  const backgroundImage = require('../assets/images/main.jpg'); // Replace with your image path
 
  //const ss = getToken();
   //console.log(ss);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleRegister = () => {
    
    router.push('/register');
  };
  const validate = () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (text.includes('@')) {
      setShowEmailSuggestion(false);
    } else {
      setShowEmailSuggestion(true);
    }
  };

  const handleLogin = async () => {
   // Vibration.vibrate(10);
    if (validate()) {
      try {
        // Replace 'login' API with your actual login logic
        const response = await post('/api/login',{ email, password });
        // const response = await login({ email, password });
        // Alert.alert('responce is :',JSON.stringify(response));
        if (response.token) {
          await storeToken(response.token); 
          console.log("respone from Server " + response.token);
          const tokenfromget = await getToken();
          console.log("respone from Storage " + tokenfromget);
          
         await storeUserData(response);  // show user Information
           // Store token in AsyncStorage
         // alert("Login Successful");
          router.push('/(tabs)/profile');
          // Proceed to navigate to the home screen or wherever needed
        }else {
          Alert.alert("Login Failed");
          Vibration.vibrate(100);
          Vibration.vibrate(100);
        }
      } catch (error) {
        console.error(error);
        // Alert.alert("Login Failed", "Invalid email or password.");
        Alert.alert(error.toString());

      }
    }
  };


  // const handleForgotPassword = () => {
  //   console.log('Forgot password email submitted:', ForgotPassword);
  //   setModalVisible;
  //   router.push('./');
  // };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={styles.container}>
      <Text style={styles.header} variant="h4">Login</Text>
      <View style={styles.Line}></View>

      <TextInput
        onChangeText={handleEmailChange}
        value={email}
         variant="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        label="E-mail"
        leading={(props) => <Icon name="account" {...props} />}
        style={styles.input}
      />
      {showEmailSuggestion && (
        <Text style={styles.suggestion}>Enter valid e-mail id</Text>
      )}
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      <TextInput
        label="Password"
         variant="outlined"
        onChangeText={(text) => setPassword(text)}
        value={password}
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

      <TouchableOpacity
  style={{
    padding: 10,
    backgroundColor: 'black',
    marginTop: 20,
    borderRadius: 8,
    alignSelf: 'center',
    width: '50%',
    paddingVertical: 12,
  }}
  onPress={handleLogin}
>
  <Text style={{ color:'white',
   alignSelf:'center',
   }}>Login</Text>
</TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
   // marginTop:80,
    width: '84%',
   // maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
   // paddingVertical:10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    height: 450,
    justifyContent:'center',
    
   
    
  },
  header: {
    alignSelf: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
  },
  input: {
    marginBottom: 18,
  },
  suggestion: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
    textAlign: 'left',
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
    textAlign: 'left',
  },
  button: {
    marginTop: 20,
    borderRadius: 30,
    alignSelf: 'center',
    width: '50%',
    paddingVertical: 12,
  },
  Line: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
    marginVertical: 3,
    marginBottom: 30,
  },
  forgotPasswordText: {
    marginTop: 15,
    color: '#007BFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
