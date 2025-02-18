import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Function to store the user token
const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    // console.error('Error storing the token:', error);
    Alert.alert('Error storing the token:', error.toString());

  }
};

// Function to get the user token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      // Token retrieved successfully
      return token;
    }
    // Alert.alert('Token is empty:');

    return null; // Token not found
  } catch (error) {
    Alert.alert('Error retriving the token:', error);

  }
};
// const getUser = async () => {
//   try {
//     // Retrieve the user data from AsyncStorage
//     const userString = await AsyncStorage.getItem('user');
    
//     if (userString) {
//       try {
//         // Parse the JSON string back into an object
//         const user = JSON.parse(userString);
//         return user;
//       } catch (parseError) {
//         console.error('Error parsing user data:', parseError);
//         return null; // Invalid JSON
//       }
//     }

//     console.warn('No user data found'); // Optional logging
//     return null; // User data not found
//   } catch (error) {
//     console.error('Error retrieving user data:', error);
//     return null; // Handle AsyncStorage retrieval errors
//   }
// };
// const storeUserData = async (response) => {
//   try {
//     const user = response.user;
//     if (!user) {
//       console.warn('No user data found in response.');
//       return;
//     }

//     const userString = JSON.stringify(user);
//     await AsyncStorage.setItem('user', userString);
//   } catch (error) {
//     console.error('Error storing user data:', error);
//   }
// };
const getUser = async () => {
  try {
    // Retrieve the user data from AsyncStorage
    const userString = await AsyncStorage.getItem('user');
    
    if (userString !== null) {
      // Parse the JSON string back into an object
      const user = JSON.parse(userString);
      
      // User data retrieved successfully
      return user;
    }
    
    return null; // User data not found
  } catch (error) {
    console.error('Error retrieving user data:', error);
  }
};


const storeUserData = async (response) => {
  try {
    // Parse the user data from the response
    const user = response.user;
    
    // Convert user data to a string for storage
    const userString = JSON.stringify(user);
    
    // Store user data
    await AsyncStorage.setItem('user', userString);

    // Extract user type and store it separately (if needed)
    // const userType = user.type.toString(); // Ensure it's stored as a string
    // await AsyncStorage.setItem('userType', userType);

  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

const deleteUser = async () => {
  try {
    // Remove the user data from AsyncStorage
    await AsyncStorage.removeItem('user');
    
  } catch (error) {
    console.error('Error deleting user data:', error);
  }
};

// Function to update the user token
const updateToken = async (newToken) => {
  try {
    await AsyncStorage.setItem('userToken', newToken);
  } catch (error) {
    console.error('Error updating the token:', error);
  }
};

// Function to delete the user token
const deleteToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.error('Error deleting the token:', error);
  }
};

// const storeUser = async (user) =>


export { storeToken, getToken, updateToken, deleteToken , storeUserData, getUser,deleteUser};
