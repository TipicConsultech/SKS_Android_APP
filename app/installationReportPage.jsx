import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View,  Image, TouchableOpacity, Modal, Alert, StyleSheet, FlatList } from 'react-native';
import SignaturePad from './../components/SignaturePad '; // Assuming you are using a SignaturePad library
import { useLocalSearchParams, useRouter } from 'expo-router';
import { post, postFormData } from './util/api';
import { host } from './util/constants';
import { TextInput } from '@react-native-material/core';
import Sign from './../assets/images/Sign.jpg'
import { getUser } from './util/asyncStorage';




const ReportPage = ({ navigation }) => {
  const { equipmentData, customreData, reportData, itemData, } = useLocalSearchParams();
  // const [reportNumber, setReportNumber] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [signature, setSignature] = useState(null); // base64 string for signature
  const [signVisible, setSignVisible] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  // const [signatureFilePath, setSignatureFilePath] = useState(''); // File path for signature image
  const router = useRouter();
  const [user,setUser] = useState({ name: ''})
  const data = JSON.parse(equipmentData || '{}');
  const data2 = JSON.parse(customreData || '{}');
  const data3 = JSON.parse(reportData || '{}');
//   const data4 = JSON.parse(itemData || '{}');
  // console.log("Data4 isS",data4);
  const [reportId, setReportId] = useState(0);

  // const data5 = JSON.parse(item || '{}');
// console.log(data);

  const handleSubmitsign = () => {
    setSignVisible(true);
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUser = await getUser();
        if (fetchedUser) {
          setUser({ id: fetchedUser.id });
        } else {
          Alert.alert('Error', 'User not found or not logged in.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };
  
    fetchUserData();
  }, []);  // Ensure dependency array is provided
  

  const handleSubmit = async () => {
    
    const formData = {
      customer_id: data2.id,
      customer_name: data2.customer_name,
      address: data2.address,
      contact_person: data2.contact_person,
      email: data2.email,
      mobile: data2.mobile,
      equipment_name: data.equipment_name,
      brand_name: data.brand_name,
      model: data.model,
      location: data.location,
      serial_no:data.serial_no,
      signature_by: customerName,
      call_type: 0,
      remark: data3.remark,
      nature_complaint: data3.nature_of_complaint,
      actual_fault: data3.actual_fault,
      action_taken: data3.action_taken,
      customer_suggestion: data3.customer_suggestion,
      signature: 'testing',//signature,  // Ensure `signature` is a URL or Base64 string for JSON
      
      assigned_to:user.id,//2,
      updated_by:null,
  };
  


   

 
try {
    const response = await post('/api/genarateAllReportWithEquipment', formData);
    // setReportId(response);
    
    
 
    Alert.alert(
      'Success',
      `Report Number ${response.id} Generated Successfully!`,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );

    
  } catch (error) {
    console.error('Error submitting report:', error);
    Alert.alert('Error', 'Failed to submit the report.');
  }
 

    // router.push({
    //   pathname: 'finalReport',
    //   params: { id:reportId}, // Pass data as string
    // });
  };

 

  const handleOnSign = async (sign) => {
    setSignature(sign);
    // const filePath = await saveSignatureToFile(sign); // Save signature as a file and get the path
    // if (filePath) {
    //   setSignatureFilePath(filePath); // Store the file path to be used in formData
      setIsSigned(true);
    
    setSignVisible(false);
  };

  // console.log(reportId);

  const handleCloseSign = () => {
    setSignVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Report</Text>

      {/* Customer Info */}
      <View style={styles.table}>
        <Text style={styles.sectionHeader}>Customer Info</Text>
        <Text style={styles.tableRow}>Customer Name: {data2.customer_name}</Text>
        <Text style={styles.tableRow}>Address: {data2.address}</Text>
        <Text style={styles.tableRow}>Contact Person: {data2.contact_person}</Text>
        <Text style={styles.tableRow}>Mobile No: {data2.mobile}</Text>
      </View>

      {/* Equipment Info */}
      <View style={styles.table}>
        <Text style={styles.sectionHeader}>Equipment</Text>
        <Text style={styles.tableRow}>Equipment Name: {data.equipment_name}</Text>
        <Text style={styles.tableRow}>Brand: {data.brand_name}</Text>
        <Text style={styles.tableRow}>Model No: {data.model}</Text>
        <Text style={styles.tableRow}>Serial No: {data.serial_no}</Text>
        <Text style={styles.tableRow}>Location: {data.location}</Text>
      </View>

      {/* Report Data */}
      <View style={styles.table}>
        <Text style={styles.sectionHeader}>Report Data</Text>
        <Text style={styles.tableRow}>Type Of Call: Installation </Text>
        <Text style={styles.tableRow}>Selected Remark: {data3.status}</Text>
        <Text style={styles.tableRow}>Nature of Complaint/Visit: {data3.nature_of_complaint}</Text>
        <Text style={styles.tableRow}>Actual Fault: {data3.actual_fault}</Text>
        <Text style={styles.tableRow}>Action Taken/To be Taken: {data3.action_taken}</Text>
        <Text style={styles.tableRow}>Finally Status: {data.customer_suggestion}</Text>
      </View>

      {/* <View style={styles.containert}>
      <Text style={styles.sectionHeadero}>Spare Part Table</Text>
      <View style={styles.headero}>
        <Text style={styles.headerCelloi}>ID</Text>
        <Text style={styles.headerCello}>       Description</Text>
        <Text style={styles.headerCello}>     Quantity</Text>
        <Text style={styles.headerCello}>     Remark</Text>
      </View> */}

      {/* Table Rows */}
      {/* <FlatList
        data={data4}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.description}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>{item.remark}</Text>
          </View>
        )}
      />
    </View> */}





      {!isSigned && (
         <TextInput
         variant="outlined"
         label="Signed By"
         style={styles.inputsignbtn}
         value={customerName}
         onChangeText={setCustomerName}
       />
          )}

     

      {/* Display signature if signed */}
      {isSigned && (
        <View style={styles.table}>
          <Text style={styles.sectionHeader}>Customer Name & Signature</Text>
          {customerName && <Text style={styles.tableRow}>Signature By: {customerName}</Text>}
          {signature && (
            <Image
              resizeMode="cover"
              style={{ width: 300, height: 180 }}
              source={{ uri: signature }} // Show the saved signature image
            />
          )}
        </View>
      )}
       

      {/* Signature Input and Button */}
      <View style={styles.signContainer}>

      {!isSigned && (
        <TouchableOpacity style={styles.customButtonsign} onPress={handleSubmitsign}>
          <Text style={styles.buttonText}>Sign</Text>
        </TouchableOpacity>
          )}
       
         
        {/* <TouchableOpacity style={styles.customButtonsign} onPress={handleSubmitsign}>
          <Text style={styles.buttonText}>Sign</Text>
        </TouchableOpacity> */}

        <Modal visible={signVisible} transparent={true} animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainerSign}>
              <SignaturePad isVisible={signVisible} onOK={handleOnSign} onClose={handleCloseSign} />
              <TouchableOpacity style={styles.closeButton1} onPress={handleCloseSign}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.customButtonsub} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f4f7' },
    header: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginVertical: 15, color: '#2c3e50' },
    table: { 
      backgroundColor: '#ffffff', 
      borderRadius: 8, 
      marginVertical: 12, 
      padding: 20, 
      elevation: 4, 
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.15, 
      shadowRadius: 8,
    },
    input: {
      marginTop: 5,
    },
    inputsignbtn: {
      marginTop: 0,
    },
    inputsign: {
    marginTop:30,
      borderColor: 'gray',
     // borderWidth: 1,
     
      marginBottom:5,
    },
    // image: {
    //   width: "40%",
    //   height: 50,
    //   marginBottom: 15,
    //   marginTop: 20,
    //   alignSelf: "center",
    // },
    modalContainerSign:{
      width: '100%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',},

    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Makes modal background translucent
    },
    modalContainer:{
      width: '100%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,},
    customButtonsign: {
      backgroundColor: "#27ae60",
      paddingVertical: 14,
      paddingHorizontal: 160,
      borderRadius: 8,
      marginTop: 1,
      marginBottom:1,
      
      alignItems: "center",
      elevation: 4,
    },
    closeButton1: {
    marginTop: 20, // Adds space above the button
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ff0000', // Close button background color
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff', // Close button text color
    fontSize: 16,
    fontWeight: 'bold',
  
  },

    signContainer:{flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  height:100,  
    },
    sectionHeader: { fontSize: 22, fontWeight: '600', marginBottom: 10, color: '#2980b9' },
    tableRow: { fontSize: 16, marginVertical: 6, color: '#2c3e50', fontWeight: '500' },
    customButton: {
      backgroundColor: "#27ae60",
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 8,
      
      alignItems: "center",
      elevation: 4,
    },
    customButtonsub: {
        backgroundColor: "#27ae60",
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 8,
        marginTop: 5,
        marginBottom:25,
        
        alignItems: "center",
        elevation: 4,
      },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    containert: {
        backgroundColor: '#ffffff', 
        borderRadius: 8, 
        marginVertical: 12, 
        padding: 20, 
        elevation: 4, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.15, 
        shadowRadius: 8,
      },
      titlet: {
        fontSize: 22, fontWeight: '600', marginBottom: 10, color: '#2980b9' 
        
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        
      },
      cell: {
        fontSize: 10,
      },




      containero: {
        flex: 1,
        padding: 16,
      },
      sectionHeadero: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2980b9',
      },
      headero: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 5,
      },
      headerCello: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      headerCelloi: {
       // flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      rowo: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      cello: {
        flex: 1,
        textAlign: 'center',
      },
});

export default ReportPage;
