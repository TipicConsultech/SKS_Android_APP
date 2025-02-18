import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList, Image, Button, Alert, BackHandler, KeyboardAvoidingView ,Modal} from 'react-native';
// import * as Print from 'expo-print';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
import yourImage from '../assets/images/logo.png'; 
import { useLocalSearchParams,useRouter} from 'expo-router';
import { getAPICall, post } from './util/api';
import skslogo from './util/logo';
import { getUser } from './util/asyncStorage';
import { cinzelFont } from './util/font';
import { router } from "expo-router";

import DraftSignaturePad from '../components/signaturePadDraft';
import { useNavigation } from '@react-navigation/native';


const FinalReport = () => {

  const currentDate = new Date();

  // Format the date as needed
  const formattedDate = currentDate.toLocaleDateString(); // e.g., "10/9/2024"
  const [reportData1, setReportData] = useState(null);
  const [reportDetailsData, setReportDetailsData] = useState(null);
  const [sparePartsData1, setSparePartsData] = useState(null);
  const [sparePartsDataLenght, setSparePartsDataLength] = useState(0);
  const [serviceEngineer,setServiceEngg]=useState(null);
  const [remark, setRemark] = useState('loading..');
  /////
  const [isSigned, setIsSigned] = useState(false);
  const [signPadVisible, setSignPadVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');
  //////
  const {reportNumber} = useLocalSearchParams();
  /////
  const navigation = useNavigation();
  
 useEffect(() => {
    const backAction = () => {
      navigation.goBack();
        return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
    );

    return () => backHandler.remove(); // Cleanup
}, []);

const remarkString = (remark) => {
  switch (remark) {
    case 0: return 'Not Working';
    case 1: return 'Working Moderately';
    case 2: return 'Working Fully';
    case 3: return 'Faulty/unserviceable';
  }
};

const callTypeString = (callType) => {
  switch (callType) {
    case 0: return 'Installation';
    case 1: return 'Inspection';
    case 2: return 'Breakdown';
    case 3: return 'PPM';
    case 5: return 'Other';
  }
};

const [user, setUser] = useState();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUser = await getUser();
        if (fetchedUser) {
          setUser({ name: fetchedUser.name });
        } else {
          Alert.alert('Error', 'User not found or not logged in.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };
    fetchUserData();
  }, []);  // Ensure dependency array is provided
  
  useEffect(() => {
    if (reportNumber) {
      fetchAllData();
    }
  }, [reportNumber]);
 
  // Fetch all data sequentially to handle any dependencies between them
  const fetchAllData = async () => {
    try {
      const details = await fetchReportDetails();
      if (details?.report_id) {
        await fetchReportData(details.report_id);
      }
      if(details?.created_by){
      fetchServiceEngineer(details.created_by);}
      await fetchSparePartData(details.id);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch data');
    }
  };
 
  // Fetches report details
  const fetchReportDetails = async () => {
    try {
      const response = await getAPICall(`/api/getReportDetailsByReportId/${reportNumber}`);
      setReportDetailsData(response);
      
      setRemark(remarkString(response.remark));
      return response; // Return data for further use
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch report details');
    }
  };
 

  const fetchServiceEngineer= async(created_by) => {
    try {
      const response = await getAPICall(`/api/user/${created_by}`);
      setServiceEngg(response);
       // Return data for further use
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch ServiceEngineer');
    }
  };
  // Fetches report data by report ID
  const fetchReportData = async (reportId) => {
    try {
      const response = await getAPICall(`/api/getReportById/${reportId}`);
      setReportData(response);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch report data');
    }
  };
 
  // Fetches spare part data by the report ID
  const fetchSparePartData = async (id) => {
    try {
      const response = await getAPICall(`/api/getSparePartByReportId/${id}`);
      setSparePartsData(response.sparepartData);
      setSparePartsDataLength(response.length);
     
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch spare part data');
    }
  };
  // Dummy data for spare parts
  const sparePartsData = [
    { id: '1', description: 'Part A', quantity: '2', remark: 'New' },
    { id: '2', description: 'Part B', quantity: '1', remark: 'Replaced' },
    { id: '3', description: 'Part C', quantity: '5', remark: 'Not Required' },
  ];
  
  const truncateString = (text, maxLength) => {
    if (!text || typeof text !== 'string') return ''; // Handle invalid input
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

     async function handleOnSign(sign){
     const data={
      "signature":sign,
      "signature_by":customerName,
      "demo_report_id":reportData1?.id,
      "demo_report_details_id":reportDetailsData?.id,
     };
     
      try{
        const response =await post('/api/FinalReportByDraft',data)
       setCustomerName('');
    
       }
        catch(e){
       }
      // setIsSigned(true);
      setSignPadVisible(false);
      router.push('./profile');
    };
  
    const handleCloseSign = () => {
      
      setSignPadVisible(false);
    };
 
    function signButton(){
      setSignPadVisible(true);
    }
  return (
    <View style={styles.border}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Image and Title */}
      <View style={styles.header}>
      <Image
          source={yourImage} // Use the imported image
          style={styles.headerImage}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>SMART KITCHEN SOLUTION'S </Text>
          <Text style={styles.subTitle}>Office No 23,Floor,Konark Business Center,Mundhwa pune -411036</Text>
          <Text style={styles.titlemo}>Contact No:8600516230/8076614258</Text>
        </View>
      </View>

      <Text style={styles.surTitle}>Service Report</Text> 
      

      {/* Report Number and id in a Horizontal Layout */}
      <View style={styles.horizontalContainer}>
      
        <View style={styles.horizontalItemtop}>
          <Text style={styles.labeltop}>Temp Token (Draft):</Text>
          {reportData1!==null ? <Text style={styles.valuetop}>{reportData1.id}</Text> : <Text style={styles.valuetop}>Loading...</Text>}
          {/* <Text style={styles.valuetop}>{reportData1.id}</Text> */}
          
        </View>
        <View style={styles.horizontalItemtop}>
          <Text style={styles.labeltop}>Assigned On:</Text>
          {/* <Text style={styles.valuetop}>{reportData.id}</Text> */}
          {reportData1!==null ? <Text style={styles.valuetop}> { formattedDate} </Text> : <Text style={styles.valuetop}>Loading...</Text>}
          {/* <Text style={styles.labeltop}> Time:</Text>
          {reportData1!==null ? <Text style={styles.valuetop}>{ formattedTime}</Text> : <Text style={styles.valuetop}>Loading...</Text>} */}


        </View>
      </View>

      {/* Customer Name and address in a Horizontal Layout */}
      <View style={styles.horizontalContainer}>
        <View style={styles.horizontalItem}>
          <Text style={styles.label}>Customer Name:</Text>
          {/* <Text style={styles.value}>{reportData.customer_name}</Text> */}
          {reportData1!==null ? <Text style={styles.value}>{reportData1.customer_name}</Text> : <Text style={styles.value}>Loading...</Text>}

        </View>
        <View style={styles.horizontalItem}>
          <Text style={styles.label}>address:</Text>
          {/* <Text style={styles.value}>{reportData.address}</Text> */}
          {reportData1!==null ? <Text style={styles.value}>{reportData1.address}</Text> : <Text style={styles.value}>Loading...</Text>} 
          <Text style={styles.label}>Contact Number:</Text>
          {reportData1!==null ? <Text style={styles.value}>{reportData1.mobile}</Text> : <Text style={styles.value}>Loading...</Text>} 
        </View>
        <View >
          {/* <Text style={styles.value}>{reportData.address}</Text> */}
        </View>
      </View>

      {/* Equipment Details */}
      <View style={styles.section}>
        <View style={styles.borderContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Type of Call:</Text>
            {/* <Text style={styles.value}>{reportData.call_type}</Text> */}
          {reportData1!==null ? <Text style={styles.value}>{callTypeString(reportData1.call_type)}</Text> : <Text style={styles.value}>Loading...</Text>}

          
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>model / PNC:</Text>
            {/* <Text style={styles.value}>{reportData.model}</Text> */}
          {reportData1!==null ? <Text style={styles.value}>{reportData1.model}</Text> : <Text style={styles.value}>Loading...</Text>}

          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Serial No.:</Text>
            {/* <Text style={styles.value}>{reportData.serial_no}</Text> */}
          {reportData1!==null ? <Text style={styles.value}>{reportData1.serial_no}</Text> : <Text style={styles.value}>Loading...</Text>}

          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Equipment Name:</Text>
            {/* <Text style={styles.value}>{reportData.equipment_name}</Text> */}
          {reportData1!==null ? <Text style={styles.value}>{reportData1.equipment_name}</Text> : <Text style={styles.value}>Loading...</Text>}

          </View>
          <View style={styles.row}>
            <Text style={styles.label}>location:</Text>
            {/* <Text style={styles.value}>{reportData.location}</Text> */}
          {reportData1!==null ? <Text style={styles.value}>{reportData1.location}</Text> : <Text style={styles.value}>Loading...</Text>}

          </View>
        </View>
      </View>

      {/* Nature of Complaint */}
      <View style={styles.section}>
        <View style={styles.borderContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Nature of Complaint/visit:</Text>
            {/* <Text style={styles.value}>{reportData.nature_complaint}</Text> */}
          {reportDetailsData!==null ? <Text style={styles.value}>{reportDetailsData.nature_complaint}</Text> : <Text style={styles.value}>Loading...</Text>}

          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.borderContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Actual fault:</Text>
            {/* <Text style={styles.value}>{reportData.status}</Text> */}
          {reportDetailsData!==null ? <Text style={styles.value}>{reportDetailsData.actual_fault}</Text> : <Text style={styles.value}>Loading...</Text>}

          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.borderContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Action Taken/To be Taken:</Text>
            {/* <Text style={styles.value}>{reportData.action_taken}</Text> */}
          {reportDetailsData!==null ? <Text style={styles.value}>{reportDetailsData.action_taken}</Text> : <Text style={styles.value}>Loading...</Text>}

          </View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.borderContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Final Status:</Text>
            {/* <Text style={styles.value}>{reportData.status}</Text> */}
          {reportDetailsData!==null ? <Text style={styles.value}>{remarkString(reportDetailsData.remark)}</Text> : <Text style={styles.value}>Loading...</Text>}

          </View>
        </View>
      </View>

      {/* Remarks */}
     
      
      <View style={styles.section}>
        <View style={styles.borderContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Customer Suggestions:</Text>
            {/* <Text style={styles.value}>{reportData.customer_suggestion}</Text> */}
          {reportDetailsData!==null ? <Text style={styles.value}>{reportDetailsData.customer_suggestion}</Text> : <Text style={styles.value}>Loading...</Text>}

          </View>
        </View>
      </View>

      {/* Spare Parts Table */}
      <View style={styles.containert}>
  <Text style={styles.sectionHeadero}>Required or Replaced Spare Parts</Text>

  <View style={styles.headero}>
    <Text style={styles.headerCelloi}>ID</Text>
    <Text style={styles.headerCello}>Description</Text>
    <Text style={styles.headerCello}>Quantity</Text>
    <Text style={styles.headerCello}>Remark</Text>
  </View>

  <FlatList
    data={sparePartsData1}
    keyExtractor={(item, index) => index.toString()} // Use index as key if `id` is missing
    renderItem={({ item, index }) => (
      <View style={styles.rowo}>
        {/* ID (Incremented String) */}
        <Text style={styles.cello}>{(index + 1).toString()}</Text>

        {/* Description */}
        {item.description !== null ? (
          <Text style={styles.cello}>{item.description}</Text>
        ) : (
          <Text style={styles.cello}>Loading...</Text>
        )}

        {/* Quantity */}
        {item.qty !== null ? (
          <Text style={styles.cello}>{item.qty}</Text>
        ) : (
          <Text style={styles.cello}>Loading...</Text>
        )}

        {/* Remark */}
        {item.remark !== null ? (
          <Text style={styles.cello}>{item.remark}</Text>
        ) : (
          <Text style={styles.cello}>Loading...</Text>
        )}
      </View>
    )}
  />
</View>

      {/* signature_by Section with Empty Boxes */}
      <View style={styles.signature_byContainer}>
      <View style={styles.signbox}>
      {/* <Text style={styles.label}>Signed By:</Text>  
      {/* <Text style={styles.value}>{reportData.customer_name}</Text> */}
      {/* {reportDetailsData!==null ? <Text style={styles.value}>{reportDetailsData.signature_by}</Text> : <Text style={styles.value}>Loading...</Text>}        */}
      
      {/* <Text style={styles.value}>{reportData.contact_person}</Text> */}
      {serviceEngineer!==null ? <Text style={styles.serviceEngg}>Service Engineer Id: &nbsp; &nbsp; {serviceEngineer?.id}</Text> : <Text style={styles.serviceEngg}>Service Engg: &nbsp; &nbsp;Loading...</Text>}

        </View>
        <View style={styles.signature_byBox}>
        
          {/* Placeholder for signature_by images */}
          {/* <View style={styles.signature_byPlaceholder}>
          <Image 
            source={{ uri: reportDetailsData?.signature }}
           style={{ width: 180, height: 100 }}
            />
          </View> */}
          <View style={styles.signature_byPlaceholder}>
      {serviceEngineer!==null ? <Text style={styles.signature_byText}>Service Engg Name:&nbsp; &nbsp;{serviceEngineer.name}</Text> : <Text style={styles.signature_byText}>signature_by ...... </Text>}
            

            {/* <Image 
            source={{ uri: reportDetailsData?.signature }}
           style={{ width: 180, height: 100 }}
            /> */}
          </View>
        </View>
      </View>
    

    </ScrollView>
    <Button 
  title="Click Here For Sign" 
  // onPress={sparePartsDataLenght > 7 ? createAPdfTwoPages : createAndSharePDF} 
  onPress={signButton} 
/>
<Modal transparent={true}  visible={signPadVisible} animationType="slide" presentationStyle="overFullScreen">
  <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
    <View style={styles.modalBackground}>
      <View style={styles.modalContainerSign}>
        <DraftSignaturePad onOK={handleOnSign} onClose={handleCloseSign} customerName={customerName} setCustomerName={setCustomerName} />
      </View>
    </View>
  </KeyboardAvoidingView>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
    zIndex: -10,
  },

  modalContainerSign:{
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Makes modal background translucent
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
   // marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 4,
    borderBottomColor: '#000',
    marginTop:20,
    
  },
  headerImage: {
    width: '25%', // 30% of the header width
    height: 80, // Adjust the height as needed
    marginRight: 2, // Space between image and title
    resizeMode: 'contain',
  },
  headerTextContainer: {
    width: '70%', // Remaining space for the title
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginStart:3,
   // justifyContent:'center',
    textAlign:'center',
  },
  titlemo: {
    fontSize: 12,
    fontWeight: 'bold',
   justifyContent:'center',
    textAlign:'center',
    marginBottom:10,
  },
  subTitle: {
    fontSize: 12,
    marginVertical: 3,
    textAlign:'center',
  },
  surTitle: {
    fontSize: 12,
   // marginVertical: 3,
    textAlign:'center',
    borderWidth:1,
    marginBottom:1,
    marginHorizontal:130,
    top:-10,
    backgroundColor:'white',

  },
  section: {
    marginBottom: 5,
    paddingBottom: 5,
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  horizontalItem: {
    width: '48%', // Each item takes almost half the width
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    paddingVertical:1,
   
  },
  horizontalItemtop: {
    width: '48%', // Each item takes almost half the width
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    paddingVertical:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  verticalContainer: {
    marginBottom: 10,
  },
  verticalItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  borderContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginBottom: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    
  },
  serviceEngg: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    // marginLeft:100
    alignSelf: 'center', // Centers in the parent container
    textAlign: 'center',
    width: '100%',
  },
  value: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
  },
  labeltop: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
   
   marginVertical:5,
    
  },
  valuetop: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
    marginVertical:5,
    fontWeight: 'bold',
   
  },
  border: {
    flex: 1,
    borderWidth: 2,       // Border width
    borderColor: 'black', // Border color
    borderRadius: 5,     // Optional: To add rounded corners
   // padding: 10,          // Padding to avoid content sticking to the border
    margin: 10,  
    marginHorizontal:5,         // Optional: Adds space between the border and the edge of the screen
  },

  // Styles for the Spare Parts Table
  containert: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginVertical: 5,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  sectionHeadero: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 20,
   // color: '#2980b9',
    alignSelf: 'center',
   borderBottomWidth:1.5,
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
    flex: 1,
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
    fontSize: 10,
  },

  // Styles for the signature_by Section
  signature_byContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 10,
    marginBottom: 20,
  },
  signbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signature_byBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signature_byPlaceholder: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  signature_byText: {
    color: '#bbb',
  },
});

export default FinalReport;