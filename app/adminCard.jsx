import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { getAPICall } from './util/api';
import { router, useLocalSearchParams } from 'expo-router';

// Card component with dynamic border styling
const Card = ({ reportNumber, detailsId, serviceEngg, remark,users,date}) => {
  // Determine the top border color based on the remark
  const borderColor = (remark) => {
    switch (remark) {
      case 0: return '#ff6347'; // Orange
      case 1: return '#ffff00'; // Yellow
      case 2: return '#008000'; // Green
      case 3: return '#000000'; // Black
      default: return '#000'; // Default color
    }
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
  
  const findNameById = (id) => {
    const record = users.find(item => item.id === id);
    return record ? record.name : "Name not found";
  };
  
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
    
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  const lineColor = borderColor(remark);

  return (
    <TouchableOpacity
      style={[styles.card, { borderTopColor: lineColor }]}
      onPress={() => {
        let id = detailsId;
        router.push({
          pathname: '/finalReport',
          params: { id },
        });
      }}
    >
      <View style={styles.cardContent}>
        <Text style={styles.title}>Report: {reportNumber}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Report History Id:</Text>
          <Text style={styles.value1}>{detailsId}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>S.Engineer Name:</Text>
          <Text style={styles.value}>{findNameById(serviceEngg)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>S.Engineer Id:</Text>
          <Text style={styles.value}>{serviceEngg}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Report Date:</Text>
          <Text style={styles.value}>{formatDateToDDMMYYYY(date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Main component rendering FlatList of cards
const AdminCard = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const { r_id } = useLocalSearchParams();
  let id = r_id;

  useEffect(() => {
    fetchData();
    
  }, [r_id]);

  useEffect(() => {
    fetchUsers();
  },[]);


  useEffect(() => {
    const backAction = () => {
      
    router.push('./profile') 
           
        return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
    );

    return () => backHandler.remove(); // Cleanup
}, []);


const fetchUsers= async() => {
  try {
    const response = await getAPICall(`/api/users`);
    setUsers(response);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch Users');
  }
};

  async function fetchData() {
    try {
      const response = await getAPICall(`/api/getReportDetailsHistory/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  if (data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No record found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Card
          reportNumber={item.report_id}
          detailsId={item.id}
          serviceEngg={item.created_by}
          remark={item.remark}
          users={users}
          date={item.created_at}
        />
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

// Styling with dynamic borders and enhanced design
const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 50,
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
    backgroundColor: '#fff',
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
  value1: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
  },
});

export default AdminCard;
