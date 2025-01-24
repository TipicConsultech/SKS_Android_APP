import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from "expo-router";
import LoginScreen from "./loginscreen";
import { getToken } from "./util/asyncStorage";



function Index() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to check token from AsyncStorage
  const checkToken = async () => {
    try {
      const storedtoken = await getToken();
      if (storedtoken) {
        setToken(storedtoken); // Token found, set it in 
      } else {
        setToken(''); // No token found, stay on login
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    } finally {
      setLoading(false); // Stop loading once token check is complete
    }
  };

  useEffect(() => {
    checkToken(); // Run the token check only once when component mounts
  }, []); // Removed `token` from dependency array

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (token === '') {
    return <LoginScreen/>; // Show login screen if no token
  }

  return <Redirect href={'/(tabs)/profile'} />; // Redirect to profile if token exists
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Index;


