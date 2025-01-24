import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList, Image, Button, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import yourImage from '../assets/images/logo.png'; 
import { useLocalSearchParams,useRouter} from 'expo-router';
import { getAPICall } from './util/api';
import skslogo from './util/logo';
import { getUser } from './util/asyncStorage';
import { cinzelFont } from './util/font';

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

const {id} = useLocalSearchParams();



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
    if (id) {
      fetchAllData();
    }
  }, [id]);
 
  // Fetch all data sequentially to handle any dependencies between them
  const fetchAllData = async () => {
    try {
      const details = await fetchReportDetails();
      if (details?.report_id) {
        await fetchReportData(details.report_id);
      }
      if(details?.created_by){
      fetchServiceEngineer(details.created_by);}
      await fetchSparePartData(id);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch data');
    }
  };
 
  // Fetches report details
  const fetchReportDetails = async () => {
    try {
      const response = await getAPICall(`/api/getReportDetailsById/${id}`);
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

  const createAndSharePDF = async () => {
    
    const customerName = truncateString(reportData1.customer_name, 40);
    const address = truncateString(reportData1.address, 40);
    const Locations = truncateString(reportData1.location, 35);
    const natureComplaint = truncateString(reportDetailsData.nature_complaint, 370);
    const actualFault = truncateString(reportDetailsData.actual_fault, 370);
    const actionTaken = truncateString(reportDetailsData.action_taken, 370);
    const customerSuggestion = truncateString(reportDetailsData.customer_suggestion,370);
      
    const htmlContent=`
    <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Report</title>
    <style>
    <style>
    @font-face {
      font-family: 'Cinzel';
      src:url("data:font/ttf;base64,${cinzelFont}") format('truetype');
    }
      body {
        font-family:'Calibri';
        margin: 10px;
        color: #333;
        padding:15px;
      }
      .border {
        border: 2px solid black;
        padding: 0px;
        margin: 5px;
           }
      .header {
    display: flex;
   height: 108px;
    justify-content: space-between;
    border-bottom: 1px solid #000;
    padding-bottom: 0px;
    margin-top: 0px;
  }
  
  .header img {
    width: 20%;
    height: 80px;
    margin-right: 10px;
    object-fit: contain;
  }
  .commonBorder {
      border: 10px solid black;
      
      margin: 10px 0;
      background-color: #f9f9f9; 
    }
  
  .headerTextContainer {
    width: 100%;
     margin-left: 30px;
     margin-top: 7px;
  }
  
  
  
  .title, .subTitle, .titlemo {
    text-align: center;
    margin-bottom: 0px; /* Removes default bottom margin */
  }
  
  .title {
    font-size: 22px;
    font-weight: bold;
    font-family: 'Cinzel';
  }
  
  .subTitle {
    font-size: 10px;
    margin-top: 5px; /* Adds a small top margin for spacing */
  }
  
  .titlemo {
    font-size: 10px;
    margin-bottom: 8px; /* Adds a small top margin for spacing */
  }
  
  .surTitle {
    font-size: 12px;
    text-align: center;
    border: 1px solid black;
    margin: -10px auto 10px auto;
    padding: 5px;
    width: 150px;
    background-color: white;
  }
     
     .horizontalContainer {
    margin-bottom: 10px;
  }

  .headerRightContainer {
    width:80%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
   
  }
     .horizontalItem {
    width: 100%; /* Full width to ensure content fits nicely */
    /* border: 1px solid black; */
   padding: 10px;
   /* border-top: none; */
    display: flex;
    flex-direction: column; /* Stack items vertically */
    gap: 10px; /* Space between labels and values */
    /* margin-left: none; */
    border-right: 1px solid black;
  
    
  }
  .horizontalItems2 {
    width: 100%; /* Full width to ensure content fits nicely */
    /* border: 1px solid black;  */
   padding: 10px;
   border-top: none;
    display: flex;
    flex-direction: column; /* Stack items vertically */
    gap: 10px; /* Space between labels and values */
    margin-right:none;
    
  }
  .horizontalItemtop {
        width: 60%;
        float:right;
        float: left;
        border-left: 1px solid black;
        padding: 2px 10px;
        display: flex;
        justify-content: space-between;
      } 
  .horizontalItemtop2 {
        width: 60%;
        float:right;
        float: left;
        border: 1px solid black;
        border-left:1px solid black;
        border-bottom: none;
        border-right: none;
        padding: 2px 10px;
        display: flex;
        justify-content: space-between;
      }
      .label{
        font-size: 10px;
        font-weight: bold;
      }
        .labeltop {
        font-size: 15px;
        font-weight: bold;
      }
      .value {
        font-size: 10px;
        font-weight: bold;
        color: #555;
          margin-left: 20px;
      }
      .valuetop {
        font-size: 15px;
        font-weight: bold;
        color: #555;
      }
   
      .surTitle {
        font-size: 12px;
        text-align: center;
        font-weight: bold;
        /* border: 1px solid black; */
        margin: -14px auto ;
        width: 150px;
        margin-bottom: 0px;
  
        background-color: white;
        position: relative; /* or 'absolute' if you want to position it more freely */
    z-index: 999;       /* Ensures the div is above other elements */
    overflow: hidden;    
      }
      /* .section {
        margin-bottom: 5px;
        padding-bottom: 5px;
      } */
     
       .borderContainera {
        /* border: 1px solid #ccc; */
       /* border-left:1px solid black; */
       border: 1px solid black;
        margin-bottom: 1px;
        margin-left: -1px;
        padding: 2px;
        margin-right:-1px;
         background-color: #d3d3d3;
      }
       .sectionContainer {
      width:50%; /* Half-width for customer and equipment sections */
    }
      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1px;
      }
      /* Spare Parts Table */
      .tableContainer {
        margin-top: 1px;
        background-color: white;
        height: 190px; /* Set the fixed height */
        overflow-y: auto;
      }
      .sectionHeader {
        font-size: 12px;
        border-top:1px solid black;
        font-weight: bold;
        text-align:start;
        padding:3px 5px;
        background-color: #d3d3d3;
        
        margin-bottom: 2px;       
        border-bottom: 1.5px solid #000;
      }
      .tableHeader, .tableRow {
      display: flex;
      
      margin: -2px;
      border: 1px solid black;
      border-top: none;
  }
  
  .tableHeader div {
  font-size: 10px;
      border-left: 1px solid black;
       font-weight: bold;
      text-align: center;
      padding: 5px; /* Optional for spacing */
  }
    .tableRow div {
  font-size: 10px;
      border-left: 1px solid black;
      text-align: center;
      padding: 5px; /* Optional for spacing */
  }
  
  .tableHeader div:nth-child(1), /* Item */
  .tableRow div:nth-child(1),
  .tableHeader div:nth-child(3), /* Qty */
  .tableRow div:nth-child(3),
  .tableHeader div:nth-child(4), /* Remarks */
  .tableRow div:nth-child(4) {
      flex: 1; /* Equal space */
  }
  
  /* Give more space to the Description column */
  .tableHeader div:nth-child(2), /* Description */
  .tableRow div:nth-child(2) {
      flex: 3; /* Double the space */
  }
      .signature_byContainer {
        margin-top: -1px;
        border-top: 1px solid black;
      }
      .signature_byBox {
        display: flex;
        /* border-left:1px solid black; */
        
        justify-content: space-between;
      }
      .signature_byPlaceholder {
        flex:1;
        border: 1px solid black;
        height: 80px;
        display: flex;
        justify-content: center;
        border-left:none;
        align-items: center;
        margin: -1px;
      }
         .signature_byname {
        flex: 1;
        border: 1px solid black;
        border-top:none;
        border-bottom:none;
  
        /* border-right:none; */
        border-left:none;
        /* border-top: 5px; */
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
         margin-left: -1px;  /* Add left margin */
              margin-right: -1px; 
         
      }
      .namePlaceholder span {
        color: #bbb;
      }
       
     
     
      .label {
    font-size: 12px;
    font-weight: bold;
    color: #333;
    margin: 0;
  }
     .label1 {
    font-size: 12px;
    font-weight: bold;
    color: #333;
    margin: 0;
    
  }
    
  .value {
    align-items:left;
    font-size: 10px;
    font-weight: bold;
    color: #555;
    /* margin-right: 100px; */
  }
  .valueb {
        font-size: 12px;
        font-weight: bold;
        color: #555;
        margin-right: 10px;
        padding-left: 10px;
        height: 40px; /* Set the fixed height */
        overflow-y: auto;
        }

        

    
     .sectionContainer {
    display: flex;
    justify-content: space-between;
    /* gap: 10px; Space between sections */
  }
  /* .applyFlex {
    
      display: flex; /* Space between the two sections */
     */
      .customerDetails{
    padding-top:11px;
    width: 50%;
    /* border-top:none; */
  }
  .equipmentDetails {
    padding-top:11px;
    width: 50%;
     
  }
  /* .equipmentDetails{
      
  } */
  
      .borderContainer {
        
        /* margin-left: -4px;
        margin-right: -4px;
        
        margin-bottom: 1px; */
        display: flex; 
      }
      .row {
        display: flex;
        margin-bottom: 1px;
       
      }
      .row1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: -10px;
  padding-left: 10px;
  margin-left: -10px;
  margin-bottom: 1px;
  padding-bottom: 1px;
  position: relative; /* Required for positioning the pseudo-element */
}

.row1::before {
  content: '';
  position: absolute;
  top: -4px; /* Adjust as needed to position above the element */
  left: 0;
  right: 0;
  height: 1px; /* Line thickness */
  background-color: black; /* Line color */
}


  .row6 {
  display: flex;
  padding-left: 10px;
  align-items: center;
  justify-content: space-between;
  margin-right: -10px;
  margin-left: -10px;
  margin-bottom: 1px;
  padding-bottom: 1px;
  position: relative; /* Required for positioning pseudo-element */
}

.row6::before {
  content: '';
  position: absolute;
  top: 0; /* Position above the element */
  left: 0;
  right: 0;
  height: 1px; /* Thickness of the line */
 
}

    .row7 {
  display: flex;
  padding-left: 10px;
  align-items: center;
  justify-content: space-between;
  margin-right: -10px;
  margin-left: -10px;
  margin-bottom: 1px;
  padding-top: 10px;
  padding-bottom: 1px;
  position: relative; /* Required for pseudo-element positioning */
}

.row7::before {
  content: '';
  position: absolute;
  top: 0; /* Adjust to move border */
  left: 0;
  right: 0;
  height: 1px; /* Border thickness */
 
}

        logo: {
      width: 10,
      height: 10,
    };



   .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #333;
      color: white;
      text-align: center;
      padding: 10px 0;
    }
    </style>
  </head>
  <body style="margin-top:20px;">
    <div class="border">
      <div class="header">
     
      <img src="data:image/png;base64, ${skslogo}" style="width: 150px; height: 120px; margin-left: 28px;" alt="skslogo" />
        
        <!-- Header Text Container -->
        <div class="headerTextContainer">
          <p class="title">SMART KITCHEN SOLUTIONS</p>
          <p class="subTitle">Office No 23, Konark Business Center, Mundhwa Pune - 411036</p>
          <p class="titlemo">Contact No: 8600516230 / 8076614258</p>
        </div>
        
        <!-- Report Number and id -->
        <div class="headerRightContainer">
          <div class="horizontalItemtop">
            <p class="labeltop">Report No:<span style="padding-left:7px; font-size:18px;">${reportData1.id}</span></p>
          </div>
          <div class="horizontalItemtop2">
            <p class="labeltop">Date:</p>
            </br>
            <p class="valuetop">${formattedDate}</p>
          </div>
        </div>
      </div>
  <div>
      <p class="surTitle">SERVICE REPORT</p>
  
      
      <!-- Customer Details -->
     <!-- Customer Details -->
     <!-- Wrapper for Customer and Equipment Details with Shared Border -->
  <div class="borderContainer">
    
      <!-- Customer Details Section -->
      <div class="customerDetails sectionContainer" >
        <div class="horizontalItem customerInfo">
          <div>
            <div class="row">
            <p class="label">Customer Name:<span style="padding-left: 8px;">${customerName}</span> </p>
        
             
            </div>
          </div>
          <div>
            <div class="row">
            <p class="label">Address:<span style="padding-left: 50px;">${address}</span> </p>
            
            </div>
          </div>
         <div class="row">
          <p class="label">Contact Number:<span style="padding-left: 7px;">${reportData1.mobile}</span></p>
         
        </div>
        <div class="row">
          <p class="label">Contact Person:<span style="padding-left: 12px;">${reportData1.contact_person}</span> </p>
      
        </div>
        </div>
      </div>
  
      <!-- Equipment Details Section -->
      <div class="customerDetails sectionContainer" style="position: relative;">
        <div class="horizontalItems2">
          <div class="row">
            <p class="label">Type of Call:<span style="padding-left: 33px;">${callTypeString(reportData1.call_type)} </span></p>
            
          </div>
          <div class="row1">
            <p class="label">Model / PNC:<span style="padding-left: 30px;">${reportData1.model}</span></p>
       
          </div>
          <div class="row1">
            <p class="label">Serial No:<span style="padding-left: 45px;">${reportData1.serial_no}</span></p>
         
          </div>
          <div class="row1">
            <p class="label">Equipment Name:<span style="padding-left: 5px;">${reportData1.equipment_name}</span></p>
            
          </div>
          <div class="row1">
            <p class="label1">Location:<span style="padding-left: 47px;"> ${Locations}</span></p>
            
          </div>
        </div>
      </div>
   
  </div>
   </div>
      <!-- Nature of Complaint and Final Status -->
      
       <div class="section">
        <div class="borderContainera">
          <div class="row">
            <p class="label">Nature of Complaint:</p>
          </div>
        </div>
      </div>
      <div class="section">
        <div class=>
          <div class="row">
          <p class="valueb">${natureComplaint}</p>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="borderContainera">
          <div class="row">
            <p class="label">Actual Fault:</p>
          </div>
        </div>
      </div>
      <div class="section">
        <div class=>
          <div class="row">
          <p class="valueb">${actualFault}</p>
          </div>
        </div>
      </div>
       <div class="section">
        <div class="borderContainera">
          <div class="row">
            <p class="label">Action Taken/To be taken:</p>
           
          </div>
        </div>
      </div>
      <div class="section">
        <div class=>
          <div class="row">
         <p class="valueb">${actionTaken}</p>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="borderContainera">
          <div class="row">
            <p class="label">Final Status:</p>
           
          </div>
        </div>
      </div>
      <div class="section">
        <div class=>
          <div class="row">
         <p class="valueb">${remarkString(reportDetailsData.remark)}</p>
          </div>
        </div>
      </div>
        
        <div class="section">
        <div class="borderContainera">
          <div class="row">
            <p class="label">Finally Status:</p>
            
          </div>
        </div>
      </div>
      <div class="section">
        <div class=>
          <div class="row">
      <p class="valueb">${customerSuggestion}</p>
          </div>
        </div>
      </div>
  
   <!-- Spare Parts Used -->
 <div class="tableContainer">
  <p class="sectionHeader">Required or Replaced Spare Parts</p>

  <div class="tableHeader">
    <div>Item</div>
    <div>Description</div>
    <div>Qty</div>
    <div>Remarks</div>
  </div>

  <!-- Dynamic Table Rows -->
  ${Array.from({ length: 8 }).map((_, index) => {
    const part = sparePartsData1[index] || {};
    return `
      <div class="tableRow">
        <div>${index + 1}</div>  
        <div>${part.description || ''}</div>
        <div>${part.qty || ''}</div>
        <div>${part.remark || ''}</div>
      </div>
    `;
  }).join('')}
</div>

  
      <!-- name Section -->
   <div class="signature_byContainer">
        <div class="signature_byBox">
          <div class="signature_byname"> <p class="label">Signature By:</p>
              <p class="value">${reportDetailsData.signature_by}</p></div>
          <div class="signature_byname"><p class="label">Service Engg Id:</p>
              <p class="value">${serviceEngineer.id}</p></div>    
        </div>
         <div class="signature_byBox">
         <div class="signature_byPlaceholder">
          <img src="${reportDetailsData.signature}" style="width: 126px; height: 70px;" alt="Signature" />
       </div>
          <div class="signature_byPlaceholder"><span>${serviceEngineer.name} </span></div>
        
        </div>
      </div>
       

    </div>
  </body>
 
  </html>
  
    `;

      try {
        // Create the PDF
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        const fileUri = FileSystem.documentDirectory + `report_${reportData1.id}_${remarkString(reportData1.remark)}.pdf`;
  
        // Move the created PDF to the document directory
        await FileSystem.moveAsync({
          from: uri,
          to: fileUri,
        });
  
        // Check if sharing is available
        if (!(await Sharing.isAvailableAsync())) {
          Alert.alert('Sharing is not available on this platform');
          return;
        }
  
        // Share the PDF
        await Sharing.shareAsync(fileUri);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to create or share PDF');
      }
    };

  // Convert image to base64 when the component is mounted
  useEffect(() => {
    const convertImageToBase64 = async () => {
      const base64 = await FileSystem.readAsStringAsync(
        FileSystem.assetUriAsync(yourImage),
        { encoding: FileSystem.EncodingType.Base64 }
      );
      setImageBase64(base64);
    };

    convertImageToBase64();
  }, []);

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
          <Text style={styles.labeltop}>Report No:</Text>
          {reportData1!==null ? <Text style={styles.valuetop}>{reportData1.id}</Text> : <Text style={styles.valuetop}>Loading...</Text>}
          {/* <Text style={styles.valuetop}>{reportData1.id}</Text> */}
          
        </View>
        <View style={styles.horizontalItemtop}>
          <Text style={styles.labeltop}>Date:</Text>
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
      <Text style={styles.label}>Signed By:</Text>  
      {/* <Text style={styles.value}>{reportData.customer_name}</Text> */}
      {reportDetailsData!==null ? <Text style={styles.value}>{reportDetailsData.signature_by}</Text> : <Text style={styles.value}>Loading...</Text>}
      
      <Text style={styles.label}>Service Engg:</Text>
      {/* <Text style={styles.value}>{reportData.contact_person}</Text> */}
      {serviceEngineer!==null ? <Text style={styles.value}>{serviceEngineer.id}</Text> : <Text style={styles.value}>Loading...</Text>}

        </View>
        <View style={styles.signature_byBox}>
        
          {/* Placeholder for signature_by images */}
          <View style={styles.signature_byPlaceholder}>
          <Image 
            source={{ uri: reportDetailsData?.signature }}
           style={{ width: 180, height: 100 }}
            />
          </View>
          <View style={styles.signature_byPlaceholder}>
      {serviceEngineer!==null ? <Text style={styles.signature_byText}>{serviceEngineer.name}</Text> : <Text style={styles.signature_byText}>signature_by ...... </Text>}
            

            {/* <Image 
            source={{ uri: reportDetailsData?.signature }}
           style={{ width: 180, height: 100 }}
            /> */}
          </View>
        </View>
      </View>
    

    </ScrollView>
    <Button 
  title="Save and Share PDF" 
  // onPress={sparePartsDataLenght > 7 ? createAPdfTwoPages : createAndSharePDF} 
  onPress={createAndSharePDF} 
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',

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
  value: {
    fontSize: 12,
    textAlign: 'right',
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
