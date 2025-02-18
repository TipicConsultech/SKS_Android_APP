import AsyncStorage from '@react-native-async-storage/async-storage';

export const savePayloadToAsyncStorage = async (payload) => {
  try {
    // Define the key for AsyncStorage
    const storageKey = 'payloadArray';

    // Retrieve existing data from AsyncStorage
    const existingData = await AsyncStorage.getItem(storageKey);

    // Parse the existing data or initialize an empty array
    const payloadArray = existingData ? JSON.parse(existingData) : [];

    // Add the new payload to the array
    payloadArray.push(payload);

    // Save the updated array back to AsyncStorage
    await AsyncStorage.setItem(storageKey, JSON.stringify(payloadArray));
    return true;
  } catch (error) {
    return false;
  }
};


export const fetchPayloads = async () => {
    try {
      const data = await AsyncStorage.getItem('payloadArray');
      const payloadArray = data ? JSON.parse(data) : [];
    return payloadArray;
    } catch (error) {
      console.error('Error fetching payloads:', error);

    }
  };
export const deletePayload = async (reportId) => {
    try {
      const data = await AsyncStorage.getItem('payloadArray');
      const payloadArray = data ? JSON.parse(data) : [];
  
      // Filter out the payload with the specific report ID
      const updatedArray = payloadArray.filter((payload) => payload.report_id !== reportId);
  
      // Save the updated array back to AsyncStorage
      await AsyncStorage.setItem('payloadArray', JSON.stringify(updatedArray));
  
    } catch (error) {
      console.error('Error deleting payload:', error);
    }
  };

  export const updatePayload = async (reportId, extraFields) => {
    try {
      const data = await AsyncStorage.getItem('payloadArray');
      const payloadArray = data ? JSON.parse(data) : [];
  
      // Update the payload with the matching report_id
      const updatedArray = payloadArray.map((payload) => {
        if (payload.report_id === reportId) {
          return { ...payload, ...extraFields }; // Add extra fields to the matched payload
        }
       
        return payload; // Keep others unchanged
      });
      // Save the updated array back to AsyncStorage
      await AsyncStorage.setItem('payloadArray', JSON.stringify(updatedArray));
  
    } catch (error) {
      console.error('Error updating payload:', error);
      return false;
    }
  };

