import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View,  Image, TouchableOpacity, Modal, Alert, StyleSheet, FlatList, BackHandler } from 'react-native';
import SignaturePad from './../components/SignaturePad '; // Assuming you are using a SignaturePad library
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAPICall, post, postFormData } from './util/api';
import { host } from './util/constants';
import { TextInput } from '@react-native-material/core';
// import Sign from './../assets/images/Sign.jpg'
import { getUser } from './util/asyncStorage';
import { useNavigation, useRoute } from '@react-navigation/native';
import DraftSignaturePad from '../components/signaturePadDraft';


const ReportPageAssign = ({ navigation }) => {
  const { reportDetailsData, itemData,report_id } = useLocalSearchParams();
  const [customerName, setCustomerName] = useState('');
  const [signature, setSignature] = useState(null); // base64 string for signature
  const [signVisible, setSignVisible] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [report, setReport] = useState({});
  const [reportDetailsId, setReportDetailsId] = useState(0);
  
const text ='this is demo sign origina may be diffrent';
  const router = useRouter();
  const [user,setUser] = useState({ name: ''})
  const data3 = JSON.parse(reportDetailsData || '{}');
  const data4 = JSON.parse(itemData || '{}');
  const nav = useNavigation();

  useEffect(() => {
    const getReport=async()=>{
        const responce=await getAPICall(`/api/getReportById/${report_id}`);
        setReport(responce);
  
      }
    getReport();
  },[])

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
                { text: "Ok", onPress: () =>nav.goBack() }
            ]
        );
        return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
    );

    return () => backHandler.remove(); //Cleanup
}, []);
 
const saveDraft=()=>{

}

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
   

    const payload = {
      demo_report_id: report_id,
      signature_by: customerName,
      remark: data3.remark,
      nature_complaint: data3.nature_complaint,
      actual_fault: data3.actual_fault,
      action_taken: data3.action_taken,
      customer_suggestion: data3.customer_suggestion,
      signature:signature,
      created_by: user.id,
      spare_parts: data4
        ? data4.map((item) => ({
            description: item.description,
            qty:parseInt(item.quantity, 10),
            remark: item.remark,
          }))
        : [],
    };

      try {
        const response = await post(`/api/FinalReport`, payload);
        setReportDetailsId(response.id);
        const id=response.id;
        Alert.alert(
          'Success',
          `Report Number ${id} Generated Successfully!`,
          [{ text: 'OK', 
           
            onPress: () => {
              const id = response.id; // Define `id` here from `response`
              router.push({
                pathname: '/finalReport',
                params: { id },
              });
            },
          
          }]
        );
   
       
      } catch (error) {
        console.error('Error submitting report:', error);
        Alert.alert('Error', 'Failed to submit the report.');
      }
  

  };
 

 

  const handleOnSign = async (sign) => {
    setSignature(sign);
    // const filePath = await saveSignatureToFile(sign); // Save signature as a file and get the path
    // if (filePath) {
    //   setSignatureFilePath(filePath); // Store the file path to be used in formData
      setIsSigned(true);
    
    setSignVisible(false);
  };
  const handleCloseSign = () => {
    setSignVisible(false);
  };

  const truncateString = (text, maxLength) => {
    if (!text || typeof text !== 'string') return ''; // Handle invalid input
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Report</Text>

      {/* Customer Info */}
      {report &&
      <>
        <View style={styles.table}>
          <Text style={styles.sectionHeader}>Customer Info</Text>
          <Text style={styles.tableRow}>Name: {truncateString(report.customer_name,25)}</Text>
          <Text style={styles.tableRow}>Address: {truncateString(report.address,25)}</Text>
          <Text style={styles.tableRow}>C.Person: {truncateString(report.contact_person,25)}</Text>
          <Text style={styles.tableRow}>Mobile No: {report.mobile}</Text>
        </View>

        {/* Equipment Info */}
        <View style={styles.table}>
          <Text style={styles.sectionHeader}>Equipment</Text>
          <Text style={styles.tableRow}>Equipment: {truncateString(report.equipment_name,25)}</Text>
          <Text style={styles.tableRow}>Brand: {report.brand_name}</Text>
          <Text style={styles.tableRow}>Model No: {report.model}</Text>
          <Text style={styles.tableRow}>Serial No: {report.serial_no}</Text>
          <Text style={styles.tableRow}>Location: {truncateString(report.location,25)}</Text>
        </View>
      </>
      }
           <View style={styles.table}>
        <Text style={styles.sectionHeader}>Report Data</Text>
        {/* Uncomment and use the following line if `call_type` is needed */}
        {/* <Text style={styles.tableRow}>Type Of Call: {data3.call_type}</Text> */}
        <Text style={styles.tableRow}>Selected Remark: {truncateString(data3.remark,20)}</Text>
        <Text style={styles.tableRow}>Nature of Complaint: {truncateString(data3.nature_complaint,10)}</Text>
        <Text style={styles.tableRow}>Actual Fault: {truncateString(data3.actual_fault,20)}</Text>
        <Text style={styles.tableRow}>Action Taken/To be Taken: {truncateString(data3.action_taken,16)}</Text>
        <Text style={styles.tableRow}>F. Status: {truncateString(data3.customer_suggestion,16)}</Text>
      </View>
      {/* Report Data */}
      {  data4 && Object.keys(data4).length > 0&& (
      <>

      <View style={styles.containert}>
        <Text style={styles.sectionHeadero}>Spare Part Table</Text>
        <View style={styles.headero}>
        <Text style={styles.headerCelloi}>ID</Text>
        <Text style={styles.headerCello}>     Description</Text>
        <Text style={styles.headerCello}>     Quantity</Text>
        <Text style={styles.headerCello}>     Remark</Text>
        </View>
     

         {/* Table Rows */}
         <FlatList
        data={data4}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{truncateString(item.description,9)}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>{item.remark}</Text>
          </View>
        )}
      />
    </View>

    </>
  )
}
      

  
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

      {!isSigned && customerName!==''&& (
        <TouchableOpacity style={styles.customButtonsub} onPress={handleSubmitsign}>
          <Text style={styles.buttonText}>Sign</Text>
        </TouchableOpacity>
          )}
       
         
        {/* <TouchableOpacity style={styles.customButtonsign} onPress={handleSubmitsign}>
          <Text style={styles.buttonText}>Sign</Text>
        </TouchableOpacity> */}

        <Modal visible={signVisible} transparent={true} animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainerSign}>
              <DraftSignaturePad  onOK={handleOnSign} onClose={handleCloseSign} />
              {/* <TouchableOpacity style={styles.closeButton1} onPress={handleCloseSign}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
      </View>

      {/* Submit Button */}
      {isSigned && (
  <TouchableOpacity style={styles.customButtonsub} onPress={handleSubmit}>
    <Text style={styles.buttonText}>Submit</Text>
  </TouchableOpacity>
)}

     
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
      backgroundColor: "black",
        paddingVertical: 13,
        paddingHorizontal: 28,
        borderRadius: 8,
        marginTop: 5,
        marginBottom:25,
        
        alignItems: "center",
        elevation: 4,
      },
    buttonText: {
      color: "#fff",
      fontSize: 13,
     
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

export default ReportPageAssign;
