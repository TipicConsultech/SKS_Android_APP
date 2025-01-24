import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { PortalProvider, TextInput } from "@react-native-material/core";
import NewCustomer from '../../components/NewCustomer'; 




const CustomerInfo = () => {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [otherCall, setOtherCall] = useState('');
  const [modelNo, setModelNo] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModelQuery, setSearchModelQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [filteredModelData, setFilteredModelData] = useState([]);
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  
  
  const router = useRouter();

  const data = [
    'Hayat Hotel',
    'Tipic',
    'Swad',
    'Swayananad',
    'Anant Hotel',
    'PureVeg Hotel',
    'NonVeg Hotel',
  ];

  const modelData = [
    'Model1234',
    'Model5678',
    'Model91011',
    'Model1213',
    'Model1415',
    'Model1617',
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const results = data.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  };

  const handleModelSearch = (text) => {
    setSearchModelQuery(text);
    if (text) {
      const results = modelData.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredModelData(results);
    } else {
      setFilteredModelData([]);
    }
  };

  const handleSelectItem = (item) => {
    setSearchQuery(item);
    setFilteredData([]);
    setIsCustomerSelected(true); // Show the model search box when a customer is selected
  };

  const handleSelectModelItem = (item) => {
    setSearchModelQuery(item);
    setFilteredModelData([]);
  };

  const handleSubmit = () => {
    if (customerName.trim() === '') {
      setError('All fields are required!');
    } else {
      setError('');
      router.push('/service_info');
      setCustomerName('');
      setAddress('');
      setContactPerson('');
      setEmail('');
      setSelectedOption('');
      setSelectedOption2('');
      setOtherCall('');
      setModelNo('');
      setSerialNo('');
      setEquipmentName('');
      setSearchQuery('');
      setSearchModelQuery('');
      setFilteredData([]);
      setFilteredModelData([]);
      setIsCustomerSelected(false); // Hide the model search box after submission
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.image}
      />
      <Text style={styles.logoHeading}>SMART KITCHEN SOLUTION</Text>
      <View style={styles.Line1} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <TextInput
          variant="outlined"
          label="Search Customer..."
          style={{ margin: 15 }}
          value={searchQuery}
          onChangeText={handleSearch}
        />
       

        {filteredData.length > 0 && (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectItem(item)}>
                <Text style={styles.suggestionItem}>{item}</Text>
              </TouchableOpacity >
            )}
          />
        )}

        {/* Conditionally render the model search box */}
        {isCustomerSelected && (
          <>
            <TextInput
              variant="outlined"
              label="Search Model..."
              style={{ margin: 15 }}
              value={searchModelQuery}
              onChangeText={handleModelSearch}
            />
            {filteredModelData.length > 0 && (
              <FlatList
                data={filteredModelData}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectModelItem(item)}>
                    <Text style={styles.suggestionItem}>{item}</Text>
                  </TouchableOpacity>
                  
                )}
              />
            )}
          </>
        )}
        <View style={{ flex: 1, height:700,backgroundColor: 'transparent' }}>
      <PortalProvider>
      <NewCustomer/>
      </PortalProvider>
    </View>
        
        
           

        <TouchableOpacity style={styles.customButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 5,
    // paddingTop: 30,
    // backgroundColor: '#f5f5f5',
    
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
  },
  image: {
    width: '40%',
    height: 40,
    marginBottom: 15,
    marginTop: 20,
    alignSelf: 'center',
  },
  customButton: {
    marginTop:10,
    backgroundColor: '#4A4A4A',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 50,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  Line1: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  logoHeading: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default CustomerInfo;










// import React, { useState } from 'react';
// import { View, Text,  Button, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useRouter } from 'expo-router';
// import { TextInput } from "@react-native-material/core";

// const CustomerInfo = () => {
//   const [customerName, setCustomerName] = useState('');
//   const [address, setAddress] = useState('');
//   const [contactPerson, setContactPerson] = useState('');
//   const [email, setEmail] = useState('');
//   const [selectedOption, setSelectedOption] = useState('');
//   const [selectedOption2, setSelectedOption2] = useState('');
//   const [otherCall, setOtherCall] = useState('');
//   const [modelNo, setModelNo] = useState('');
//   const [serialNo, setSerialNo] = useState('');
//   const [equipmentName, setEquipmentName] = useState('');
//   const [error, setError] = useState('');

//   const router = useRouter();

//   const handleSubmit = () => {
//     if (customerName.trim() === '' 
//     // ||
//         // address.trim() === '' ||
//         // contactPerson.trim() === '' ||
//         // email.trim() === '' ||
//         // selectedOption.trim() === '' ||
//         // selectedOption2.trim() === '' ||
//         // modelNo.trim() === '' ||
//         // serialNo.trim() === '' ||
//         // equipmentName.trim() === ''
//       ) {
         
//       setError('All fields are required!');
//     } else {
//       setError('');
//       router.push('/service_info');
//       setCustomerName('');
//       setAddress('');
//       setContactPerson('');
//       setEmail('');
//       setSelectedOption('');
//       setSelectedOption2('');
//       setOtherCall('');
//       setModelNo('');
//       setSerialNo('');
//       setEquipmentName('');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image 
//         source={require('../../assets/images/logo.png')}
//         style={styles.image}
//       />
//       <Text style={styles.logoHeading}>SMART KITCHEN SOLUTION</Text>
//       <View style={styles.Line1} />
//       {error ? <Text style={styles.errorText}>{error}</Text> : null}
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
        

//        <TextInput variant="outlined" label="Customer name" style={{ margin: 15}}
//        value={customerName}
//        onChangeText={setCustomerName} />

//        <TextInput variant="outlined" label="Address" style={{ margin: 15}} 
//         value={address}
//         onChangeText={setAddress} 
//  />

//        <TextInput variant="outlined" label="Contact person" style={{ margin: 15 }}
//         value={contactPerson}
//         onChangeText={setContactPerson}  />

//        <TextInput variant="outlined" label="Email" style={{ margin:15 }} 
//        value={email}
//        onChangeText={setEmail} 

//        />

//         <View style={styles.pickerContainer}>
//           {/* <Text style={styles.label}>Select Type Of Call:</Text> */}
//           <Picker
//             selectedValue={selectedOption}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedOption(itemValue)}
//           >
//             <Picker.Item label="Select Type of Call" value="option1" />
//             <Picker.Item label="Breakdown" value="option2" />
//             <Picker.Item label="PPM" value="option3" />
//             <Picker.Item label="Installation" value="option4" />
//             <Picker.Item label="Inspection" value="option5" />
//             <Picker.Item label="Other" value="option6" />
//           </Picker>

//           {selectedOption === 'option6' && (
//             <TextInput
//               style={styles.input}
//               placeholder="Enter Type of call"
//               value={otherCall}
//               onChangeText={setOtherCall}
//             />
//           )}

//           {/* <Text style={styles.label}>Select Location:</Text> */}
//           <Picker
//             selectedValue={selectedOption2}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedOption2(itemValue)}
//           >
//             <Picker.Item label="Select Location" value="optiona1" />
//             <Picker.Item label="Smart Kitchen" value="optiona2" />
//             <Picker.Item label="Pantry" value="optiona3" />
//             <Picker.Item label="Gym" value="optiona4" />
//             <Picker.Item label="Other" value="optiona5" />
//           </Picker>
//         </View>

//         <TextInput variant="outlined" label="Model no:" style={{ margin: 15 }}
//          value={modelNo}
//          onChangeText={setModelNo}
//        />


//         <TextInput variant="outlined" label="Serial no" style={{ margin: 15 }} 
//         value={serialNo}
//         onChangeText={setSerialNo}
//       />

// <TextInput variant="outlined" label="Equipment name" style={{ margin: 15 }} 
// value={equipmentName}
// onChangeText={setEquipmentName}
// />

//         <TouchableOpacity style={styles.customButton} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Save And Next</Text>
//           <Icon name="arrow-forward" size={30} color="#fff" style={styles.icon} />
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 5,
//     paddingTop: 30,
//     backgroundColor: '#f5f5f5',
//   },
 
  
 
//   pickerContainer: {
//     marginVertical: 5,
//     marginBottom: 16,
//     flex: 1,
//     justifyContent: 'center',
    
//   },
//   picker: {
//     borderColor: '#ccc',
//     borderWidth: 2,
//     borderRadius: 50,  // Rounded corners
//     backgroundColor: '#fff',
//     paddingHorizontal: 10,
//     height: 48,
//     justifyContent: 'center',
//     elevation: 3,
//     margin: 9,
//     marginBottom: 15,
//     marginHorizontal: 15,
//   },
//   image: {
//     width: '40%',
//     height: 40,
//     marginBottom: 15,
//     marginTop: 20,
//     alignSelf: 'center',
//   },
//   customButton: {
//   backgroundColor: '#4A4A4A', // Sleek, neutral gray background
//   paddingVertical: 10,        // Increased padding for comfort
//   paddingHorizontal: 25,      // Balanced padding for touch target
//   borderRadius: 12,           // Softer, more modern rounded corners
//   borderWidth: 1,             // Thin border for a clean look
//   borderColor: '#2E2E2E',     // Slightly lighter black for subtle contrast
//   alignItems: 'center',
//   marginBottom: 15,           // Reduced margin for tighter layout
//   marginHorizontal: 50,       // Optimized for various screen sizes
  
//   // Strong shadow effect
//   shadowColor: '#000000',     // Pure black for a deep shadow
//   shadowOffset: { width: 0, height: 10 }, // Larger vertical offset for dramatic depth
//   shadowOpacity: 0.,         // High opacity for a bold shadow
//   shadowRadius: 15,           // Larger blur radius for a wide, soft shadow
//   elevation: 5,              // High elevation for a strong shadow on Android
// },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   Line1: {
//     width: '100%',
//     height: 2,
//     backgroundColor: 'black',
//     marginVertical: 10,
//   },
//   logoHeading: {
//     fontSize: 18,
//     marginBottom: 8,
//     fontWeight: 'bold',
//     alignSelf: 'center',
// },
//     errorText: {
//         color: 'red',
//         marginBottom: 10,
//       },
  
  
// });

// export default CustomerInfo;




??

//make button witout animated
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
//import { PortalProvider, TextInput } from "@react-native-material/core";

import {
  Provider,
  Stack,
  Button,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  //Text,
  TextInput,
} from "@react-native-material/core";



const CustomerInfo = () => {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [otherCall, setOtherCall] = useState('');
  const [modelNo, setModelNo] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModelQuery, setSearchModelQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [filteredModelData, setFilteredModelData] = useState([]);
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState(false);
  
  const router = useRouter();

  const data = [
    'Hayat Hotel',
    'Tipic',
    'Swad',
    'Swayananad',
    'Anant Hotel',
    'PureVeg Hotel',
    'NonVeg Hotel',
  ];

  const modelData = [
    'Model1234',
    'Model5678',
    'Model91011',
    'Model1213',
    'Model1415',
    'Model1617',
  ];

  const handleSubmitd= () => {
    if (customerName.trim() === '' ||
     
        address.trim() === '' ||
         contactPerson.trim() === '' ||
         email.trim() === '' 
       
      ) {
         
      setError('All fields are required!');
    } else {
      setError('');
      router.push('/service_info');
      setCustomerName('');
      setAddress('');
      setContactPerson('');
      setEmail('');
    
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const results = data.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  };

  const handleModelSearch = (text) => {
    setSearchModelQuery(text);
    if (text) {
      const results = modelData.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredModelData(results);
    } else {
      setFilteredModelData([]);
    }
  };

  const handleSelectItem = (item) => {
    setSearchQuery(item);
    setFilteredData([]);
    setIsCustomerSelected(true); // Show the model search box when a customer is selected
  };

  const handleSelectModelItem = (item) => {
    setSearchModelQuery(item);
    setFilteredModelData([]);
  };

  const handleSubmit = () => {
    if (customerName.trim() === '') {
      setError('All fields are required!');
    } else {
      setError('');
      router.push('/service_info');
      setCustomerName('');
      setAddress('');
      setContactPerson('');
      setEmail('');
      setSelectedOption('');
      setSelectedOption2('');
      setOtherCall('');
      setModelNo('');
      setSerialNo('');
      setEquipmentName('');
      setSearchQuery('');
      setSearchModelQuery('');
      setFilteredData([]);
      setFilteredModelData([]);
      setIsCustomerSelected(false); // Hide the model search box after submission
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.image}
      />
      <Text style={styles.logoHeading}>SMART KITCHEN SOLUTION</Text>
      <View style={styles.Line1} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <TextInput
          variant="outlined"
          label="Search Customer..."
          style={{ marginHorizontal: 10,marginTop:30,
            
           }}
          value={searchQuery}
          onChangeText={handleSearch}
        />
       

        {filteredData.length > 0 && (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectItem(item)}>
                <Text style={styles.suggestionItem}>{item}</Text>
              </TouchableOpacity >
            )}
          />
        )}

<>

{filteredData.length === 0 && searchQuery.length > 0  &&  (
          <Button 
            style={styles.dailogBtn}
            title="Add"
            onPress={() => setVisible(true)}
          />
        )}
      
      <Dialog style={{borderRadius: 20}} visible={visible} onDismiss={() => setVisible(false)}>
      <ScrollView>
        <DialogHeader title="         New Customer"style={{alignSelf:'center'}} />
        {error ? <Text style={{alignSelf:'center',color: 'red',}} >{error}</Text> : null}
        <DialogContent>
          <Stack spacing={2}>
           
            <TextInput variant="outlined" label="Customer name" style={{ margin: 15}}
      value={customerName}
       onChangeText={setCustomerName} />
        <TextInput variant="outlined" label="Address" style={{ margin: 15}} 
         value={address}
         onChangeText={setAddress} 
  />

        <TextInput variant="outlined" label="Contact person" style={{ margin: 15 }}
         value={contactPerson}
       onChangeText={setContactPerson}  />

        <TextInput variant="outlined" label="Email" style={{ margin:15 }} 
        value={email}
       onChangeText={setEmail} 
       
       />
       <Button
       title="Save"
       compact
       variant="text"
       onPress={handleSubmitd} />
        
     
      
             
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            title="Cancel"
            compact
            variant="text"
            onPress={() => setVisible(false)}
          />
          <Button
            title="Ok"
            compact
            variant="text"
            onPress={() => setVisible(false)}
          />
        </DialogActions>
       </ScrollView>
      </Dialog>
    </>
{/* =======================================dailog================================================================ */}
        {/* Conditionally render the model search box */}
        {isCustomerSelected && (
          <>
            <TextInput
              variant="outlined"
              label="Search Model..."
              style={{ marginHorizontal: 10,marginTop:30 }}
              value={searchModelQuery}
              onChangeText={handleModelSearch}
            />
            {filteredModelData.length > 0 && (
              <FlatList
                data={filteredModelData}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectModelItem(item)}>
                    <Text style={styles.suggestionItem}>{item}</Text>
                  </TouchableOpacity>
                  
                )}
              />
            )}
          </>
        )}
       
     


        
        
           

        <TouchableOpacity style={styles.customButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
     padding: 5,
     paddingTop: 30,
     backgroundColor: '#f5f5f5',
    
  },
  dailogBtn:{
    marginStart:255,
    alignSelf:'flex-end',
    marginEnd:10,
   
//marginHorizontal:,
  },

  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
  },
  image: {
    width: '40%',
    height: 40,
    marginBottom: 15,
    marginTop: 20,
    alignSelf: 'center',
  },
  customButton: {
    marginTop:20,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 120,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  Line1: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  logoHeading: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
const AppProvider  = () => (
  <Provider>
    <CustomerInfo />
  </Provider>
);
export default AppProvider;








>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<,,,,,,,......>>>>>>>>><<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>



import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Animated, Easing, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Provider, Stack, Button, DialogHeader, DialogContent, DialogActions, TextInput } from "@react-native-material/core";

const AnimatedDialog = ({ visible, onClose, onSubmit, customerName, setCustomerName, address, setAddress, contactPerson, setContactPerson, email, setEmail, error }) => {
  const [show, setShow] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const translateYValue = useRef(new Animated.Value(50)).current;
  const [errord, setErrord] = useState('');
  const router = useRouter();
  const handleSubmitd = () => {
    // value={searchModelQuery}
    // value={searchModelQuery}
if (customerName.trim() === '' || address.trim() === '' || contactPerson.trim() === '' || email.trim() === '') {  
setErrord('All fields are required!');

} else {
setErrord('');
router.push('/service_info');
setCustomerName('');
setAddress('');
setContactPerson('');
setEmail('');
//setSearchQuery('');
//setSearchModelQuery('');
//setFilteredData([]);
//setFilteredModelData([]);
//setIsCustomerSelected(false);
}
};

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(),
      ]);
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(),
        Animated.timing(translateYValue, {
          toValue: 50,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => setShow(false)),
      ]);
    }
  }, [visible]);

  return (
    <Modal transparent visible={show} animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.dialogContainer,
            {
              transform: [
                { scale: scaleValue },
                { translateY: translateYValue },
              ],
              opacity: opacityValue,
            },
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <DialogHeader title="         New Customer" style={styles.dialogHeader} />
            <View style={styles.Line1} />
            {errord ? <Text style={styles.errorTextd}>{errord}</Text> : null}
            <DialogContent>
              <Stack spacing={2}>
                <TextInput
                  variant="outlined"
                  label="Customer name"
                  style={styles.input}
                  value={customerName}
                  onChangeText={setCustomerName}
                />
                <TextInput
                  variant="outlined"
                  label="Address"
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                />
                <TextInput
                  variant="outlined"
                  label="Contact person"
                  style={styles.input}
                  value={contactPerson}
                  onChangeText={setContactPerson}
                />
                <TextInput
                  variant="outlined"
                  label="Email"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
                <Button
                  title="Save"
                  compact
                  style={{marginTop:10, borderBottomWidth:2}}
                  variant="text"
                  onPress={handleSubmitd}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              {/* <Button
                title="Cancel"
                compact
                variant="text"
                onPress={onClose}
              /> */}
              <Button
                title="Ok"
                compact
                variant="text"
                onPress={onClose}
              />
            </DialogActions>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const CustomerInfo = () => {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [errord, setErrord] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModelQuery, setSearchModelQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [filteredModelData, setFilteredModelData] = useState([]);
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  const [visible, setVisible] = useState(false);
  const [serialNo, setserialNo] = useState();
  const [equipmentName, setequipmentName] = useState();

  const router = useRouter();

  const data = [
    'Hayat Hotel',
    'Tipic',
    'Swad',
    'Swayananad',
    'Anant Hotel',
    'PureVeg Hotel',
    'NonVeg Hotel',
  ];

  const modelData = [
    'Model1234',
    'Model5678',
    'Model91011',
    'Model1213',
    'Model1415',
    'Model1617',
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const results = data.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  };

  const handleModelSearch = (text) => {
    setSearchModelQuery(text);
    if (text) {
      const results = modelData.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredModelData(results);
    } else {
      setFilteredModelData([]);
    }
  };

  const handleSelectItem = (item) => {
    setSearchQuery(item);
    setFilteredData([]);
    setIsCustomerSelected(true);
  };

  const handleSelectModelItem = (item) => {
    setSearchModelQuery(item);
    setFilteredModelData([]);
  };

  const handleSubmit = () => {
              value={searchModelQuery}
              value={searchModelQuery}
    if ( searchQuery.trim() === ''||  searchModelQuery.trim() === ''||serialNo.trim() === ''||equipmentName.trim() === '') {  
      setError('All fields are required!');
    } else {
      setError('');
      router.push('/service_info');
      // setCustomerName('');
      // setAddress('');
      // setContactPerson('');
      // setEmail('');
      setSearchQuery('');
      setSearchModelQuery('');
      setFilteredData([]);
      setFilteredModelData([]);
      setserialNo('');
      setequipmentName('')
      setIsCustomerSelected(false);
    }
  };
  const handleSubmitd = () => {
    // value={searchModelQuery}
    // value={searchModelQuery}
if (customerName.trim() === '' || address.trim() === '' || contactPerson.trim() === '' || email.trim() === '') {  
//setError('All fields are required!');
router.push('/service_info');
} else {
setErrord('');
router.push('/service_info');
setCustomerName('');
setAddress('');
setContactPerson('');
setEmail('');
//setSearchQuery('');
//setSearchModelQuery('');
//setFilteredData([]);
//setFilteredModelData([]);
//setIsCustomerSelected(false);
}
};

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.image}
      />
      <Text style={styles.logoHeading}>SMART KITCHEN SOLUTION</Text>
      <View style={styles.Line1} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <TextInput
          variant="outlined"
          label="Search Customer..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {filteredData.length > 0 && (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectItem(item)}>
                <Text style={styles.suggestionItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {filteredData.length === 0 && searchQuery.length > 0 && (
          <Button
            style={styles.dailogBtn}
            title="Add"
            onPress={() => setVisible(true)}
          />
        )}

        <AnimatedDialog
          visible={visible}
          onClose={() => setVisible(false)}
          onSubmit={handleSubmit}
          customerName={customerName}
          setCustomerName={setCustomerName}
          address={address}
          setAddress={setAddress}
          contactPerson={contactPerson}
          setContactPerson={setContactPerson}
          email={email}
          setEmail={setEmail}
          error={error}
        />

        {/* Conditionally render the model search box */}
        {isCustomerSelected && (
          <>
            <TextInput
              variant="outlined"
              label="Search Model..."
              style={styles.searchInput}
              value={searchModelQuery}
              onChangeText={handleModelSearch}
            />
            {filteredModelData.length > 0 && (
              <FlatList
                data={filteredModelData}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectModelItem(item)}>
                    <Text style={styles.suggestionItem}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
<TextInput
          variant="outlined"
          label="Serial No:"
          style={styles.searchInput}
         // value={searchQuery}
          value ={serialNo}
          onChangeText={setserialNo}
        />

<TextInput
          variant="outlined"
          label="Equipment Name:"
          style={styles.searchInput}
         // value={searchQuery}
          value ={equipmentName}
          onChangeText={setequipmentName}
        />
          </>
        )}



        

        <TouchableOpacity style={styles.customButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 30,
    backgroundColor: '#f5f5f5',
  },
  dailogBtn: {
    marginStart: 255,
    alignSelf: 'flex-end',
    marginEnd: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
  },
  image: {
    width: '40%',
    height: 50,
    marginBottom: 15,
    marginTop: 20,
    alignSelf: 'center',
  },
  customButton: {
    marginTop: 20,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 120,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  Line1: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
    marginVertical: 10,
    marginBottom: 20,
  },
  logoHeading: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    
  },
  errorTextd: {
    color: 'red',
    marginBottom: 10,
    alignSelf:'center'
  },
  searchInput: {
    marginHorizontal: 10,
    marginTop: 30,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dialogContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  dialogHeader: {
    marginBottom: 15,
  },
  input:{
marginTop: 3,


  },
});

const AppProvider = () => (
  <Provider>
    <CustomerInfo />
  </Provider>
);

export default AppProvider;
{isCustomerSelected && (
  <>
    <TextInput
      variant="outlined"
      label="Search Model..."
      style={styles.searchInput}
      value={searchModelQuery}
      onChangeText={handleModelSearch}
    />
    {filteredModelData.length > 0 && (
      <FlatList
        data={filteredModelData}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectModelItem(item)}>
            <Text style={styles.suggestionItem}>{item}</Text>
          </TouchableOpacity>
        )}
      />

    )}







{Profil}


/
/ // import React, { useState } from 'react';
// // import { View, Text,  Button, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
// // import { Picker } from '@react-native-picker/picker';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { useRouter } from 'expo-router';
// // import { TextInput } from "@react-native-material/core";

// // const profile = () => {
// //   const [customerName, setCustomerName] = useState('');
// //   const [address, setAddress] = useState('');
// //   const [contactPerson, setContactPerson] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [selectedOption, setSelectedOption] = useState('');
// //   const [selectedOption2, setSelectedOption2] = useState('');
// //   const [otherCall, setOtherCall] = useState('');
// //   const [modelNo, setModelNo] = useState('');
// //   const [serialNo, setSerialNo] = useState('');
// //   const [equipmentName, setEquipmentName] = useState('');
// //   const [error, setError] = useState('');

// //   const router = useRouter();

// //   const handleSubmit = () => {
// //     if (customerName.trim() === '' 
// //     // ||
// //         // address.trim() === '' ||
// //         // contactPerson.trim() === '' ||
// //         // email.trim() === '' ||
// //         // selectedOption.trim() === '' ||
// //         // selectedOption2.trim() === '' ||
// //         // modelNo.trim() === '' ||
// //         // serialNo.trim() === '' ||
// //         // equipmentName.trim() === ''
// //       ) {
         
// //       setError('All fields are required!');
// //     } else {
// //       setError('');
// //       router.push('/service_info');
// //       setCustomerName('');
// //       setAddress('');
// //       setContactPerson('');
// //       setEmail('');
// //       setSelectedOption('');
// //       setSelectedOption2('');
// //       setOtherCall('');
// //       setModelNo('');
// //       setSerialNo('');
// //       setEquipmentName('');
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Image 
// //         source={require('../../assets/images/logo.png')}
// //         style={styles.image}
// //       />
// //       <Text style={styles.logoHeading}>SMART KITCHEN SOLUTION</Text>
// //       <View style={styles.Line1} />
// //       {error ? <Text style={styles.errorText}>{error}</Text> : null}
// //       <ScrollView contentContainerStyle={styles.scrollContainer}>
        

// //        <TextInput variant="outlined" label="Customer name" style={{ margin: 15}}
// //        value={customerName}
// //        onChangeText={setCustomerName} />

// //        <TextInput variant="outlined" label="Address" style={{ margin: 15}} 
// //         value={address}
// //         onChangeText={setAddress} 
// //  />

// //        <TextInput variant="outlined" label="Contact person" style={{ margin: 15 }}
// //         value={contactPerson}
// //         onChangeText={setContactPerson}  />

// //        <TextInput variant="outlined" label="Email" style={{ margin:15 }} 
// //        value={email}
// //        onChangeText={setEmail} 

// //        />

// //         <View style={styles.pickerContainer}>
// //           {/* <Text style={styles.label}>Select Type Of Call:</Text> */}
// //           <Picker
// //             selectedValue={selectedOption}
// //             style={styles.picker}
// //             onValueChange={(itemValue) => setSelectedOption(itemValue)}
// //           >
// //             <Picker.Item label="Select Type of Call" value="option1" />
// //             <Picker.Item label="Breakdown" value="option2" />
// //             <Picker.Item label="PPM" value="option3" />
// //             <Picker.Item label="Installation" value="option4" />
// //             <Picker.Item label="Inspection" value="option5" />
// //             <Picker.Item label="Other" value="option6" />
// //           </Picker>

// //           {selectedOption === 'option6' && (
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Enter Type of call"
// //               value={otherCall}
// //               onChangeText={setOtherCall}
// //             />
// //           )}

// //           {/* <Text style={styles.label}>Select Location:</Text> */}
// //           <Picker
// //             selectedValue={selectedOption2}
// //             style={styles.picker}
// //             onValueChange={(itemValue) => setSelectedOption2(itemValue)}
// //           >
// //             <Picker.Item label="Select Location" value="optiona1" />
// //             <Picker.Item label="Smart Kitchen" value="optiona2" />
// //             <Picker.Item label="Pantry" value="optiona3" />
// //             <Picker.Item label="Gym" value="optiona4" />
// //             <Picker.Item label="Other" value="optiona5" />
// //           </Picker>
// //         </View>

// //         <TextInput variant="outlined" label="Model no:" style={{ margin: 15 }}
// //          value={modelNo}
// //          onChangeText={setModelNo}
// //        />


// //         <TextInput variant="outlined" label="Serial no" style={{ margin: 15 }} 
// //         value={serialNo}
// //         onChangeText={setSerialNo}
// //       />

// // <TextInput variant="outlined" label="Equipment name" style={{ margin: 15 }} 
// // value={equipmentName}
// // onChangeText={setEquipmentName}
// // />

// //         <TouchableOpacity style={styles.customButton} onPress={handleSubmit}>
// //           <Text style={styles.buttonText}>Save And Next</Text>
// //           <Icon name="arrow-forward" size={30} color="#fff" style={styles.icon} />
// //         </TouchableOpacity>
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 5,
// //     paddingTop: 30,
// //     backgroundColor: '#f5f5f5',
// //   },
 
  
 
// //   pickerContainer: {
// //     marginVertical: 5,
// //     marginBottom: 16,
// //     flex: 1,
// //     justifyContent: 'center',
    
// //   },
// //   picker: {
// //     borderColor: '#ccc',
// //     borderWidth: 2,
// //     borderRadius: 50,  // Rounded corners
// //     backgroundColor: '#fff',
// //     paddingHorizontal: 10,
// //     height: 48,
// //     justifyContent: 'center',
// //     elevation: 3,
// //     margin: 9,
// //     marginBottom: 15,
// //     marginHorizontal: 15,
// //   },
// //   image: {
// //     width: '40%',
// //     height: 40,
// //     marginBottom: 15,
// //     marginTop: 20,
// //     alignSelf: 'center',
// //   },
// //   customButton: {
// //     backgroundColor: 'gray',
// //     paddingVertical: 5,
// //     paddingHorizontal: 20,
// //     borderRadius: 8,
// //     borderWidth: 2,
// //     borderColor: 'black',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     marginHorizontal: 70,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   Line1: {
// //     width: '100%',
// //     height: 2,
// //     backgroundColor: 'black',
// //     marginVertical: 10,
// //   },
// //   logoHeading: {
// //     fontSize: 18,
// //     marginBottom: 8,
// //     fontWeight: 'bold',
// //     alignSelf: 'center',
// // },
// //     errorText: {
// //         color: 'red',
// //         marginBottom: 10,
// //       },
  
  
// // });

// // export default profile;


// // import React, { useState } from 'react';
// // import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
// // import { Button } from '@react-native-material/core';

// // export default function CustomPicker() {
// //   const [selectedOption, setSelectedOption] = useState("Select Remark");
// //   const [modalVisible, setModalVisible] = useState(false);

// //   const options = [
// //     { label: 'Select Remark', value: 'option1' },
// //     { label: 'Working Fully', value: 'option2' },
// //     { label: 'Working Moderately', value: 'option3' },
// //     { label: 'Working', value: 'option4' },
// //   ];

// //   const handleSelect = (itemValue) => {
// //     setSelectedOption(itemValue);
// //     setModalVisible(false);
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.pickerButton}>
// //         <Text style={styles.pickerText}>{selectedOption}</Text>
// //       </TouchableOpacity>

// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={modalVisible}
// //         onRequestClose={() => setModalVisible(false)}
// //       >
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             {options.map((option, index) => (
// //               <TouchableOpacity
// //                 key={index}
// //                 onPress={() => handleSelect(option.label)}
// //                 style={styles.optionButton}
// //               >
// //                 <Text style={styles.optionText}>{option.label}</Text>
// //               </TouchableOpacity>
// //             ))}
// //             <Button
// //               title="Close"
// //               onPress={() => setModalVisible(false)}
// //               style={styles.closeButton}
// //             />
// //           </View>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 16,
// //   },
// //   pickerButton: {
// //     backgroundColor: '#f0f0f0',
// //     padding: 15,
// //     borderRadius: 8,
// //     elevation: 2,
// //   },
// //   pickerText: {
// //     fontSize: 16,
// //     color: '#333',
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //   },
// //   modalContent: {
// //     margin: 20,
// //     backgroundColor: 'white',
// //     borderRadius: 8,
// //     padding: 20,
// //     elevation: 5,
// //   },
// //   optionButton: {
// //     paddingVertical: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ccc',
// //   },
// //   optionText: {
// //     fontSize: 16,
// //     color: '#333',
// //   },
// //   closeButton: {
// //     marginTop: 20,
// //   },
// // });

// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Button, Dialog, DialogHeader, DialogContent, DialogActions, TextInput, PortalProvider } from '@react-native-material/core';

// const App = () => {
//   const [visible, setVisible] = useState(false);

//   const handleOpenDialog = () => {
//     setVisible(true);
//   };

//   const handleCloseDialog = () => {
//     setVisible(false);
//   };

//   return (
//     <PortalProvider>
//       <View style={styles.container}>
//         <Button title="Open Dialog" onPress={handleOpenDialog} />

//         <Dialog visible={visible} onDismiss={handleCloseDialog}>
//           <DialogHeader title="Customer Information" />
//           <DialogContent>
//             <TextInput label="Name" variant="outlined" style={[styles.input]} />
//             <TextInput label="Address" variant="outlined" style={[styles.input]} />
//             <TextInput label="Phone Number" variant="outlined" style={[styles.input]} />
//           </DialogContent>
//           <DialogActions>
//             <Button title="Cancel" compact onPress={handleCloseDialog} />
//             <Button title="Submit" compact onPress={handleCloseDialog} />
//           </DialogActions>
//         </Dialog>
//       </View>
//     </PortalProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   input: {
//     marginBottom: 16,
//   },
// });

// export default App;




import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TextInput as RNMaterialTextInput, Button } from "@react-native-material/core";
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';

const AdvancedTable = () => {
  const [filterText, setFilterText] = useState('');
  const [items, setItems] = useState([
    { id: '1', name: 'Item 1', quantity: 10, price: 100 },
    { id: '2', name: 'Item 2', quantity: 20, price: 200 },
  ]);

  const [newItem, setNewItem] = useState({ name: '', quantity: '', price: '' });

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity && newItem.price) {
      const id = (items.length + 1).toString();
      setItems([...items, { id, ...newItem }]);
      setNewItem({ name: '', quantity: '', price: '' });
    }
  };

  const filteredItems = items ? items.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  ) : [];

  const renderItem = ({ item }) => (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout.springify()}
      style={styles.row}
    >
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.quantity}</Text>
      <Text style={styles.cell}>{item.price}</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <RNMaterialTextInput
        label="Filter by name"
        value={filterText}
        onChangeText={setFilterText}
        style={styles.filterInput}
      />
      <View style={styles.table}>
        <Animated.FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>Name</Text>
              <Text style={styles.headerText}>Quantity</Text>
              <Text style={styles.headerText}>Price</Text>
            </View>
          }
        />
      </View>
      <View style={styles.form}>
        <RNMaterialTextInput
          label="Name"
          value={newItem.name}
          onChangeText={text => setNewItem({ ...newItem, name: text })}
          style={styles.input}
        />
        <RNMaterialTextInput
          label="Quantity"
          value={newItem.quantity}
          onChangeText={text => setNewItem({ ...newItem, quantity: text })}
          keyboardType="numeric"
          style={styles.input}
        />
        <RNMaterialTextInput
          label="Price"
          value={newItem.price}
          onChangeText={text => setNewItem({ ...newItem, price: text })}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button
          title="Add Item"
          onPress={handleAddItem}
          style={styles.addButton}
          contentContainerStyle={styles.addButtonContent}
        />
      </View>
    </View>
  );
};




import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';

const Profile = () => {
  const [modalVisible, setModalVisible] = useState({ total: false, complete: false, pending: false, options: false });
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity for animation
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 }); // State to hold the modal position

  // Create refs for each card using createRef
  const totalCardRef = useRef(null);
  const completeCardRef = useRef(null);
  const pendingCardRef = useRef(null);

  const openModal = (type) => {
    let ref;

    // Set ref according to the card type
    if (type === 'total') ref = totalCardRef;
    if (type === 'complete') ref = completeCardRef;
    if (type === 'pending') ref = pendingCardRef;

    ref.current.measure((fx, fy, width, height, px, py) => {
      setModalPosition({ x: px, y: py - height }); // Position above the card
      setModalVisible((prev) => ({ ...prev, [type]: true }));
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const closeModal = (type) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible((prev) => ({ ...prev, [type]: false }));
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../../assets/images/Person.png')} // Replace with your image path
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
      </View>

      <View style={styles.cardContainer}>
        {/* Card for Total */}
        <TouchableOpacity
          ref={totalCardRef}
          style={styles.card}
          onPress={() => openModal('total')}
        >
          <Text style={styles.cardTitle}>Total</Text>
          <Text style={styles.cardContent}>5</Text>
        </TouchableOpacity>

        {/* Card for Complete */}
        <TouchableOpacity
          ref={completeCardRef}
          style={styles.card}
          onPress={() => openModal('complete')}
        >
          <Text style={styles.cardTitle}>Complete</Text>
          <Text style={styles.cardContent}>3</Text>
        </TouchableOpacity>

        {/* Card for Pending */}
        <TouchableOpacity
          ref={pendingCardRef}
          style={styles.card}
          onPress={() => openModal('pending')}
        >
          <Text style={styles.cardTitle}>Pending</Text>
          <Text style={styles.cardContent}>2</Text>
        </TouchableOpacity>
      </View>

      {/* Trigger Button for Options Modal */}
      <TouchableOpacity style={styles.optionButton} onPress={() => openModal('options')}>
        <Text style={styles.optionButtonText}>Options</Text>
      </TouchableOpacity>

      {/* Modal for Total */}
      <Modal
        transparent={true}
        visible={modalVisible.total}
        onRequestClose={() => closeModal('total')}
        animationType="none"
      >
        <View style={[styles.modalBackground, { top: modalPosition.y, left: modalPosition.x }]}>
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>Total Details</Text>
            <Text style={styles.modalContent}>You have 5 total tasks.</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => closeModal('total')}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal for Complete */}
      <Modal
        transparent={true}
        visible={modalVisible.complete}
        onRequestClose={() => closeModal('complete')}
        animationType="none"
      >
        <View style={[styles.modalBackground, { top: modalPosition.y, left: modalPosition.x }]}>
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>Complete Details</Text>
            <Text style={styles.modalContent}>You have completed 3 tasks.</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => closeModal('complete')}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal for Pending */}
      <Modal
        transparent={true}
        visible={modalVisible.pending}
        onRequestClose={() => closeModal('pending')}
        animationType="none"
      >
        <View style={[styles.modalBackground, { top: modalPosition.y, left: modalPosition.x }]}>
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>Pending Details</Text>
            <Text style={styles.modalContent}>You have 2 pending tasks.</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => closeModal('pending')}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flex: 1,
    maxWidth: 300,
    height: 150,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 50,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  optionButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalBackground: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 15,
  },
  closeButtonText: {
    color: '#FF0000',
    fontSize: 16,
  },
});

export default Profile;

