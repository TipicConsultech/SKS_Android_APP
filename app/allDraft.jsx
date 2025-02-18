import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, StyleSheet, TouchableOpacity, BackHandler, Modal } from 'react-native';
import { getAPICall, post } from './util/api';
import { router, useRouter } from 'expo-router';
import { deletePayload, fetchPayloads, updatePayload } from './util/drafts';
import DraftSignaturePad from '../components/signaturePadDraft';
import { useNavigation } from '@react-navigation/native';

// Card component with dynamic border styling
const Card = ({ reportNumber, serviceEngg, remark,signatureExsist,payload,assignedBy,type})=>{

  const [isSigned, setIsSigned] = useState(false);
  const [signPadVisible, setSignPadVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');

  

const router = useRouter();
  let cardColour = type === 0 ? '#86f5fc' : '#e6ffe6';


  

  
  const borderColor = (remark) => {
    switch (remark) {
      case 0: return '#ff6347'; // Orange
      case 1: return '#ffff00'; // Yellow
      case 2: return '#008000'; // Green
      case 3: return '#000000'; // Black
      default: return '#000'; // Default color
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete',
      `Do you want to Delete Drafted Report ${reportNumber}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            deletePayload(reportNumber);
            router.push('./profile');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const remarkString = (remark) => {
    switch (remark) {
      case 0: return 'Not Working';
      case 1: return 'Working Moderately';
      case 2: return 'Working Fully';
      case 3: return 'Faulty/unserviceable';
      default: return 'Unknown'; // Default case
    }
  };

 

  const handleOnSign = (sign) => {
   const data={
    "signature":sign,
    "signature_by":customerName
   };
   try{
    updatePayload(reportNumber,data);
    setCustomerName('');
   }
   catch(e){
    consol.alert(e);
   }
    setIsSigned(true);
    setSignPadVisible(false);
    router.push('./profile');
  };

  const handleCloseSign = () => {
    setSignPadVisible(false);
  };

  const lineColor = borderColor(remark);

  return (
    <View>
<TouchableOpacity
        style={[styles.card, { borderTopColor: lineColor, backgroundColor: cardColour }]}
        onPress={() => {

          router.push(`/finalReportHistory?reportNumber=${reportNumber}`);
        
      }
        }
        onLongPress={handleDelete}
      >
        <View style={styles.cardContent}>
          <Text style={styles.title}>Temp Token (Drafted): {reportNumber}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>S.Engineer Name:</Text>
            <Text style={styles.value}>{serviceEngg}</Text>
          </View>
          {/* <View style={styles.infoRow}>
            <Text style={styles.label}>S.Engineer Id:</Text>
            <Text style={styles.value}>{serviceEngg}</Text>
          </View> */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Assigned By:</Text>
            <Text style={styles.value}>{assignedBy}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal visible={signPadVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainerSign}>
            <DraftSignaturePad onOK={handleOnSign} onClose={handleCloseSign} customerName={customerName} setCustomerName={setCustomerName} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Main component rendering FlatList of cards
const AdminCard = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
 const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, [refreshKey]);

  const fetchUserData = async () => {
    try {
      // const Draft = await fetchPayloads();
      const Draft = await getAPICall('/api/allDraft');
      setData(Draft);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };      

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  useEffect(() => {
    const backAction = () => {
       navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAPICall(`/api/users`);
      console.log(response);
      
      setUsers(response);
    } catch (error) {
      console.error('Failed to fetch Users:', error);
      setUsers([]);
    }
  };

  if (data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No record found</Text>
      </View>
    );
  }

  const findNameById = (id) => {
    const record = users.find(item => item.id === id);
    return record ? record.name : "Name not found";
  };
  const findAssignedByType = (type) => {
    let assigned_by=null;
    switch (type) {
      case 0:
        assigned_by = "Admin";
        break;
      case 1:
        assigned_by = "Service Engineer";
        break;
      default:
        assigned_by = "Not Found";
        break;
    }
    return assigned_by;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Drafted Reports</Text>
      <View style={styles.Line}></View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.report_id.toString() || index.toString()}
        extraData={refreshKey}
        renderItem={({ item }) => (
          <Card
            reportNumber={item.report_id}
            serviceEngg={findNameById(item.created_by)}
            assignedBy={findAssignedByType(item.assigned_by)}
            remark={item.remark}
            users={users}
            fetchUserData={fetchUserData}
            signatureExsist={item?.signature ?? ''}
            setRefreshKey={setRefreshKey}
            payload={item}
            type={item.assigned_by}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
    inputsignbtn: {
        marginTop: 0,
      },
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
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
      },
      containerAdmin:{
        flex: 1,
        backgroundColor: '#44e012',
      },
      header: {
        alignSelf: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 50,
      },
      Line: {
        width: '100%',
        height: 2,
        backgroundColor: 'black',
        marginVertical: 3,
        marginBottom: 30,
      },
      listContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
      },
      noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      noDataText: {
        fontSize: 18,
        color: '#555',
      },
      card: {
     
        borderRadius: 12,
        marginBottom: 15,
        marginTop: 5,
        marginHorizontal: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        overflow: 'hidden',
        borderTopWidth: 8, // Top border width to apply dynamic color
      },
      cardContent: {
        padding: 15,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
      },
      infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
      },
      label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
      },
      value: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
      },
});

export default AdminCard;


