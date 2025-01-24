import React, { useState,useEffect  } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Icon support
import { useRouter } from "expo-router"; // For navigation
import { getUser } from "../util/asyncStorage";
import { getAPICall } from "../util/api";


export default function Dashboard() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(); // e.g., "10/9/2024"
  const router = useRouter();
  const [user, setUser] = useState({ 
    name: '', 
    id: 0,  // Assuming the ID starts as 0, change to null if preferred
    email: '', 
    gender: '', 
    address: '', 
    mobileNo: '',
    profilepic: '',
    type :null
  });

  
  
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser(); // Fetch the user data
      console.log(userData);
      
      if (userData) {
        // Update state with user information
        setUser({
          name: userData.name,
          id: userData.id, // Ensure this is an integer
          address: userData.address || '',
          mobileNo: userData.mobile || '',
          email: userData.email,
          gender: userData.gender || '',
          type: userData.type
        });
      }
    };

    

    fetchUserData();  // Fetch user data on component mount
   
   
  }, []);


  useEffect(() => {
    const fetchUserImage = async () => {
      const response= await getAPICall(`/api/userImage/${user.id}`);
      
      setUser((prevUserData) => ({
        ...prevUserData, // Spread the previous user data
        profilepic: response, // Add or update the profilepic property
      }));
    }

    fetchUserImage();
  },[user.id]);
  // Function to handle card press events
  const handlePress = (route) => {
    router.push(route); // Navigate to a different route if needed
   // console.log(`Navigating to ${route}`);
  };
  const truncateString = (text, maxLength) => {
    if (!text || typeof text !== 'string') return ''; // Handle invalid input
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <ScrollView contentContainerStyle={styles.containerm}>
      <View style={styles.header}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  {user.profilepic !==''&&(
      <Image
      source={{ uri: `data:image/jpeg;base64,${user.profilepic}` }}
        style={[styles.userImg, { width: 80, height: 80 }]} // Use style for dimensions
      />
    )}
    <View style={{ marginLeft: 10 }}> 
      <Text style={styles.greeting}>Hello</Text>
      <Text style={styles.greeting1}>{truncateString(user.name,16)}</Text>
    </View>
  </View>
</View>
      {/* Cards Section */}
      <View style={styles.cardsContainer}>
        <Card
          icon="calendar"
          title="Create New Report"
          // tasks="57 tasks"
          onPress={() => handlePress("/assignWork")}
        />
        {user.type=== 0 &&(
          <Card
          icon="person"
          title="Register Technician"
          // tasks="7 tasks"
          onPress={() => handlePress("/register")}
        />
        )}
         {user.type=== 0 &&(
          <Card
          icon="add-circle"
          title="Add Customer"
          onPress={() => handlePress("/addCustomer")}
        />
        )}
      </View>
    </ScrollView>
  );
}

// Card Component
const Card = ({ icon, title, tasks, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={60} color="#4CAF50" style={styles.cardIcon} />
    <View>
      <Text style={styles.cardTitle}>{title}</Text>
      {/* <Text style={styles.cardTasks}>{tasks}</Text> */}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  containerm: {
   
      flexGrow: 1,
      backgroundColor: "#f8f8f8",
      padding: 14,
    
  },
  header: {
    // flex:1,
    backgroundColor: "#6a1b9a",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginTop:45,
  },
  imageView: {
    flex:1,
    backgroundColor: "#6a1b9a",
    
  },
  greeting: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },
  greeting1: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
  },
  date: {
    fontSize: 18,
    color: "white",
    marginVertical: 5,
  },
  logoHeading: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
    alignSelf: "center",
  },Line1: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    marginVertical: 10,
    marginBottom: 20,
  },
  image: {
    width: "33%",
    height: 50,
    marginBottom: 15,
    marginTop: 20,
    alignSelf: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statText: {
    color: "white",
    fontSize: 16,
  },
  cardsContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",

  },
  card: {
    backgroundColor: "white",
    width: "100%",
    height:150,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    marginLeft: 30,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: "600",
    marginLeft:20,
  },
  cardTasks: {
    fontSize: 14,
    color: "#757575",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#f44336",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
