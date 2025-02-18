import React, {  useState ,useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Alert ,FlatList ,Vibration, BackHandler} from 'react-native';
import { deleteToken, deleteUser, getToken, getUser } from '../util/asyncStorage';
import { router, useRouter } from 'expo-router';
import { getAPICall, post } from '../util/api';
import historyLogo from '../../assets/images/historyLogo.png'
import Draft from "../../assets/images/draft.png"
import { fetchPayloads} from "../util/drafts";
const Profile = () => {
  const [modalVisible, setModalVisible] = useState({
    total: false,
    complete: false,
    pending: false,
    options: false,
    logout: false,
    changePassword: false,
    profile : false,
  });

  const [hamburgerMenuVisible, setHamburgerMenuVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [password, setOldPassword] = useState('');
  const [data, setData] = useState([]);
  
  const [activeCard, setActiveCard] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);


  const [reEnterPassword, setReEnterPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState({ name: '', email: '' , gender:'', type:0 , id:0 ,profilepic:''});
  const [detailsType, setDetailsType] = useState('complete');
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedID] = useState(null);
  const [reEnterPasswordError, setreEnterPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [users, setUsers] = useState([]);
  const [allDraft, setAllDraft] = useState(null);

  const openModal = (type) => {
    setModalVisible((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModalVisible((prev) => ({ ...prev, [type]: false }));
  };
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Wait for the data to be fetched
         const data = await fetchPayloads();
         setAllDraft(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAllDraft(null);
      }

      try {
        const fetchedUser = await getUser(); // Fetch user info from the backend
        if (fetchedUser) {
          setUser({
            name: fetchedUser.name ,
            email: fetchedUser.email ,
            gender: fetchedUser.gender,
            type: fetchedUser.type,
            id: fetchedUser.id,
            
          });
        } else {
          Alert.alert('Error', 'User not found or not logged in.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };
    fetchUserData();

  },[]);

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
    const routeToDetails = (route,r_id) => {
      router.push({
        pathname: route,
        params: {r_id}, // Pass data as string
      });
    };

    const routeToDetails1 = (path, reportNumber, remark) => {
      router.push({
        pathname: path,
        params: { reportNumber, remark },
      });
    };
  
    useEffect(() => {
      
      const backAction = () => {
          BackHandler.exitApp() 
          return true; // Prevent default behavior
      };
  
      const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
      );
  
      return () => backHandler.remove(); // Cleanup
  }, []);

 
  const handlePress = async () => {
    try {
      await deleteToken();
      await deleteUser();
      setModalVisible((prev) => ({ ...prev, logout: false }));
      router.push('/'); // Navigate to homepage
    } catch (error) {
      console.error('Error during delete token or navigation:', error);
    }
  };
  const router = useRouter();
  const openProfile = () => {
    
    router.push('./../enggprofile');
  };
 
  
  const handlePasswordSubmit = async () => {
    const { email } = user;
    function validated(){
      let valid= true;
      const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)[a-zA-Z\d!@#$%^&*]{6,}$/;
    
    if (!new_password) {
      setNewPasswordError('Password is required');
      valid = false;
    } else if (!passwordRegex.test(new_password)) {
      setNewPasswordError('Password must be at least 6 characters long, include one number and one special character');
      valid = false;
    } else {
      setNewPasswordError('');
    }
   

    if (!reEnterPassword) {
      setreEnterPasswordError('Confirm password is required');
      valid = false;
    } else if (new_password !== reEnterPassword) {
      setreEnterPasswordError('Passwords do not match');
      valid = false;
    } else {
      setreEnterPasswordError('');
    }


      return valid;
    }
    if (validated() && email ) {
      
      try {
        // Make API call to update the password
        const response = await post('/api/changePassword', {
          email,
          password,
          new_password,
        });

         deleteToken();       // Invalidate token after password change
         deleteUser();         // Delete user session
         setSuccessMessage('Password successfully updated');
      // setModalVisible((prev) => ({ ...prev, logout: false }));
      setModalVisible(false); // Close the modal if open
        router.push('/'); // Redirect to the homepage
      } catch (error) {
        
      }
    } 
  };
  const toggleHamburgerMenu = () => {
    setHamburgerMenuVisible(!hamburgerMenuVisible); // Toggle menu visibility
  };


  let tabNum=0;
  const openDetails = (type) => {
    setActiveCard(type);
    // setDetailsType(type);
    let closed = '0';
    switch(type){
       
      case 'complete':
        closed='1';
        tabNum=1;
         break;

      case 'pending':
        closed='0';
        tabNum=0;
      break;  
     
    }
     
   
    
    // Map the 'type' to the correct numeric status for the backend
    const status = type === 'pending' ? 0 : type === 'inProgress' ? 1 : type === 'completed' ? 2 : 3;
  
    fetchReports(closed);  // Pass the correct numeric status
  };
  
  const fetchReports = async (closed) => {
    setLoading(true);
    if(closed==='1'){
      try {
        // const response = await getAPICall(`/api/getWorkingUserReports/${closed}`);
        const response = await getAPICall(`/api/allFinalReport`);
        setData(transformData(response));  // Transform and set the data
        setDataLoading(false);
      
        
      } catch {
        setDataLoading(true);
      } finally {
        setLoading(false);
      }
    }
    else if(closed==='0'){
      try {
        const response = await getAPICall(`/api/getWorkingUserReports/${closed}`);
        setData(transformData(response));  // Transform and set the data
        setDataLoading(false);
      } catch {
        setDataLoading(true);

      } finally {
        setLoading(false);
      }
    }
  
  };
  
  // Map status values to text labels for display
  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return 'Not Working';
      case 1: return 'Working Moderately';
      case 2: return 'Working Fully';
      case 3: return 'Faulty/unserviceable';
      default: return 'Select Remark';
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

 
  useEffect(() => {
    fetchUsers();
  },[]);

const fetchUsers= async() => {
  try {
    const response = await getAPICall(`/api/users`);
    setUsers(response);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch Users');
  }
};



  const findNameById = (id) => {
    const record = users.find(item => item.id === id);
    return record ? record.name : "Name not found";
  };

  const truncateString = (text, maxLength) => {
    if (!text || typeof text !== 'string') return ''; // Handle invalid input
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  function draftReportExists(reportId) {
    // Check if a JSON object with the same report_id exists in the array
    return allDraft.some((item) => item.report_id === reportId);
  }

  // Set the draft flag based on the result of draftReportExists

  
  const transformData = (data) =>
    data.map(item => ({
      id: item.id,
      name: truncateString(item.customer_name,21),
      address: truncateString(item.address,30),
      callType: callTypeString(item.call_type),
      remark:item.remark,
      status: getStatusLabel(item.remark), // Use getStatusLabel to map remark values to labels
      reportNumber: item.id,
      sName:findNameById(item?.assigned_to||item?.created_by),
      date: item.created_at
        ? new Date(item.created_at).toISOString().split('T')[0]
        : 'N/A',
      equipment:truncateString(item.equipment_name,28),
      serialNo:item.serial_no,
      //Draft:draftReportExists(reportNumber)
      ReportOrToken:  item?.closed === 0 ? "Token":"Report"
    }));
  
  const Details = () => (
    <View style={styles.detailsContainer}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <Card {...item} />}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* <TouchableOpacity onPress={() => setDetailsType(null)}>
        <Text style={styles.closeDetailsText}>Close</Text>
      </TouchableOpacity> */}
    </View>
  );
  
  const Card = ({ name, address, callType, status,remark, reportNumber, date,sName ,equipment,serialNo,ReportOrToken}) => {
   let isDisabled=false;
   let draft=false;
    // if(remark === 2 || remark===3|| remark ===1||remark ===0){
    //     isDisabled = true ;
    // }
   
   let IDText= null;
   if(ReportOrToken==="Report"){
    IDText="Report No:";
   }
  else if(ReportOrToken==="Token"){
    IDText="Token No:"
   }
   console.log(IDText);
    const lineColor = (str) => {
      switch (str) {
        case 'Not Working': return '#F3732A';//red
        case 'Working Moderately': return '#f2d338';//yellow
        case 'Working Fully': return '#008000';//Green
        case 'Faulty/unserviceable': return '#000000';
        default: return '#f2153c';
      }
    }
      const borderColor = lineColor(status);
    return (
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: borderColor }]}

        onPress={() => {
          
          setSelectedID(reportNumber);
          if(remark===null){
            routeToDetails1("/details",reportNumber,remark);

          }
          if(remark!==null){
           
            // routeToDetails1("/finalReportHistory",reportNumber);
            const id=reportNumber;
            router.push({
              pathname: '/finalReport',
              params: { id },
            });
          }

         
          //   if (user.type === 0) {
          //     setSelectedID(reportNumber);
          //     routeToDetails("/adminCard",reportNumber);
          //  }
          //  else if (user.type === 1 ){
             
          //    setSelectedID(reportNumber);
          //    routeToDetails1("/details",reportNumber,remark);
            
          //  }
          }
        }
        activeOpacity={isDisabled ? 1 : 0.7}  // Disable opacity change for disabled cards
        // disabled={user.type === 1  ? isDisabled : false }
        disabled={isDisabled }

          // Disable touch for 'Working Fully' cards
      >
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
  <View>
    <Text style={styles.cardTitle}>
   {IDText} <Text style={styles.highlightreport}>{reportNumber}</Text>
    </Text>
    <Text style={styles.detailTextreport}>{name}</Text>
    <Text style={styles.cardSubtitle}>{address}</Text>
  </View>
  {/* { remark!==null &&
(<TouchableOpacity
onPress={()=>{
 routeToDetails("/adminCard",reportNumber);
}} 
>
<View  style={{ marginRight:20,
backgroundColor: '#f0f0f0', // Optional: Set a background color
borderRadius: 15, // Controls the roundness
padding: 0, // Optional: Add padding for content
shadowColor: '#000', // Optional: Add shadow for effect
shadowOffset: { width: 0, height: 2 },
elevation: 1, // For Android shadow
}}>
<Image 
 source={historyLogo} 
 style={{ width: 50, height: 50, borderRadius: 25,margin:10 }} 
/>
</View>
</TouchableOpacity>)
  } */}
</View>
 
        <View style={styles.cardDetails}>
        {/* <Text style={styles.detailText}>Service Engineer: <Text style={styles.highlight}>{date}</Text></Text> */}
        <Text style={styles.detailText}>Equipment Name: <Text style={styles.highlight}>{equipment}</Text></Text>
        <Text style={styles.detailText}>Serial No: <Text style={styles.highlight}>{serialNo}</Text></Text>
          <Text style={styles.detailText}>Date: <Text style={styles.highlight}>{date}</Text></Text>
          <Text style={styles.detailText}>Type of Call: <Text style={styles.highlight}>{callType}</Text></Text>
          {/* <Text style={styles.detailText}>Remark: <Text style={styles.highlight}>{status}</Text></Text> */}
          <Text style={styles.detailText}>S.Engineer: <Text style={styles.highlight}>{sName}</Text></Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleHamburgerMenu} style={styles.hamburgerMenu}>
        <Text style={styles.hamburgerText}>☰</Text>
      </TouchableOpacity>
      <Modal
        visible={hamburgerMenuVisible}
        transparent={true}
        // animationType="fade"
        onRequestClose={() => setHamburgerMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setHamburgerMenuVisible(false)}
        >
          <View style={styles.hamburgerMenuDropdown}>
          <View style={styles.userInfoWrapper}>

          {user.profilepic !==''||user.profilepic !==null ? (
      <Image
      source={{ uri: `data:image/jpeg;base64,${user.profilepic}` }}
        style={[styles.userImg, { width: 80, height: 80 }]} // Use style for dimensions
      />
    ):(<Image
      source={require('../../assets/images/Person.png')}
      style={[styles.userImg, { width: 80, height: 80 }]} // Use style for dimensions
    />)}
        
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{String(`${user.email}`)}</Text>
          <Text style={styles.userEmail}>{String(`Id: ${user.id}`)}</Text>
          

        </View>
      </View>
            <TouchableOpacity style={styles.menuButton} onPress={() => {
              openModal('logout');
              setHamburgerMenuVisible(false);

            }}>
              <Text style={styles.menuButtonText}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={() =>{
            openModal('changePassword');
            setHamburgerMenuVisible(false);

            } }>
              <Text style={styles.menuButtonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={() =>{
              openProfile();
              setHamburgerMenuVisible(false);

            }}>
              <Text style={styles.menuButtonText}>Profile</Text>
            </TouchableOpacity>
            {/* Add other buttons here as needed */}
          </View>
        </TouchableOpacity>
      </Modal>
      <Image source={require('../../assets/images/logo.png')} style={styles.image} />
      <Text style={styles.logoHeading}>SMART KITCHEN SOLUTION'S</Text>
      <View style={styles.Line1} />

      <View style={styles.cardContainer}>
      <TouchableOpacity
        style={[
          styles.cardm,
          activeCard === 'complete' && styles.activeCard, // Apply active style
        ]}
        onPress={() => openDetails('complete')}
      >
        <Text style={styles.cardTitlem}>Closed Calls</Text>
      </TouchableOpacity>

      {/* Button for "Not Working" */}
      <TouchableOpacity
        style={[
          styles.cardm,
          activeCard === 'pending' && styles.activeCard, // Apply active style
        ]}
        onPress={() => openDetails('pending')}
      >
        <Text style={styles.cardTitlem}>Open Calls</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[
          styles.cardm,
          activeCard === 'complete' && styles.activeCard, // Apply active style
        ]}
        onPress={() => openDetails('complete')}
      >
        <Text style={styles.cardTitlem}>Working Fully</Text>
      </TouchableOpacity> */}

    {/* Render appropriate detail component based on user selection */}
 
</View >
{/* {
  detailsType &&(<Details />)
} */}
{detailsType && !dataLoading ? (
  <Details />
) : (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {user.type===1 ? (<Text style={{ fontWeight: 'bold',
    fontSize:18
   }}>No Work Found</Text>):(
    <Text style={{ fontWeight: 'bold',
      fontSize:18
     }}>No Records Found</Text>
   )}
  
</View>

)}

      {/* Modal for Logout */}
      <Modal
        transparent={true}
        visible={modalVisible.logout}
        onRequestClose={() => closeModal('logout')}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalContent}>Are you sure you want to log out?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.closeButton} onPress={handlePress}>
                <Text style={styles.closeButtonText1}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton3} onPress={() => closeModal('logout')}>
                <Text style={styles.closeButtonTextO}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Change Password */}
      <Modal
        transparent={true}
        visible={modalVisible.changePassword}
        onRequestClose={() => closeModal('changePassword')}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Old Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.textInput}
              placeholder="New Password"
              secureTextEntry={true}
              value={new_password}
              onChangeText={setNewPassword}
            />
            {newPasswordError ? <Text style={styles.error}>{newPasswordError}</Text> : null}
            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password"
              secureTextEntry={true}
              value={reEnterPassword}
              onChangeText={setReEnterPassword}
            />
             {reEnterPasswordError ? <Text style={styles.error}>{reEnterPasswordError}</Text> : null}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.closeButton1} onPress={handlePasswordSubmit}>
                <Text style={styles.topButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton2} onPress={() => closeModal('changePassword')}>
                <Text style={styles.topButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.draftButton}
      onPress={()=>{
        routeToDetails("/allDraft");
      }}
      >
        <Text style={styles.draftButtonText}>All Drafts</Text>
         <Image
            source={Draft} // Replace with the correct path to your PNG icon
            style={{
              width: 20, // Width of the icon
              height: 20, // Height of the icon
              
            }}
          />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  draftButton: {
    position: "absolute",
    flexDirection: 'row',
    bottom: 20,
    right: 20,
    backgroundColor: "#fff", // Black background
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10, // Rounded corners
    elevation: 8, // Shadow for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    zIndex: 10,
  },
  draftButtonText: {
    color: "black", // White text color
    fontWeight: "bold",
    fontSize: 16,
    paddingRight:5
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
  },
   error: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
  },
  userInfoWrapper: {
    flexDirection: 'row', 
     alignItems: 'center',
    backgroundColor: '#f9f9f9', 
    padding: 16, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
    marginBottom: 16, },
  userImg: {
    borderRadius: 40, 
    marginRight: 16, 
    borderWidth: 2, 
    borderColor: '#ccc', 
  },
  userDetailsWrapper: {
    justifyContent: 'center'
    
  },
  activeCard: {
    // Styles for the active card
    // borderColor: 'blach',
    // borderWidth: 1,
    backgroundColor: '#E9EAEC',
  },
  userName: {
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 4, 
  },
  userEmail: {
    fontSize: 14, // Smaller text for email
    color: '#666', 
  },
  hamburgerMenu: {
    position: 'absolute',
    top: 57,
    left: 20,
  },
  hamburgerText: {
    fontSize: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  hamburgerMenuDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 80,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#E9EAEC'
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  topButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  cardm: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 0,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flex: 1,
    maxWidth: '100%',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitlem: {
    // flexDirection:'row',
    fontSize: 18,
    // fontWeight: 'bold',
  },
  cardContentm: {
    // flexDirection:'row-reverse',
    fontSize: 24,
  },
  
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    fontSize: 16,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
   topRightButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    marginTop: 5,
    marginBottom: 20,
    width: '100%', 
},
  closeButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    width: '48%',
    alignItems: 'center',
  },
  closeButton3: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    width: '48%',
    alignItems: 'center',
  },
  closeButtonTextO: {
    color: '#fff',
  },
  closeButtonText1: {
    color: '#fff',
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginVertical: 5,
  },
  Line1: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '100%',
    marginVertical: 10,
  },
  image: {
    width: 160,
    height: 65,
    marginBottom: 6,
    marginTop: 60,
    alignSelf: "center",
    padding:5
  },
  detailsContainer: {
    position: 'absolute', // Make it overlay on top of other content
    top: 300,
    left: 0,
    right: 0,
    bottom: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)' , // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5, // Make sure it is above other components
  },
  closeDetailsText: {
    color: 'red',
    marginTop: 5,
    marginBottom:5,
    fontWeight: 'bold',

  },
  Line1: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    marginVertical: 10,
    marginBottom: 20,
  },
  closeButton1:{
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    marginleft: 20,
  },
  closeButton2:{
    marginTop: 10,
  //  marginLeft:2,
    backgroundColor: '#BF0000',
    paddingVertical: 10,
    paddingHorizontal: 13,
    //marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    width:80,
  },
  logoHeading: {
    fontSize: 12,
    marginBottom: 0,
    fontWeight: "bold",
    alignSelf: "center",
  },
  // logoHeading1: {
  //   fontSize: 18,
  //   marginBottom: 12,
  //   marginTop: 25,
  //   fontWeight: "bold",
  //   alignSelf: "center",
  // },
  topButton: {
    padding: 8,
    marginLeft: 10,
    marginTop: 1, // Adjusted margin for spacing
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignSelf: 'flex-start',
    justifyContent:'flex-end'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    paddingEnd:2,
    paddingBottom:10,
    paddingStart:15,
    marginVertical: 10,
    marginHorizontal: 8,
    borderLeftWidth: 15,  // Bold left border
    borderLeftColor: 'red',  // Red color for the left bord
    width:340,

  },
  // colourbox:{
  //   borderTopLeftRadius:8,
  //   borderTopRightRadius:8,
  //   height:65,
  //   backgroundColor:'red',
  //   paddingStart:15,
  //     },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop:4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  detailText: {
    fontSize: 14,
    marginVertical: 2,
  },
  detailTextreport: {
    // marginRight:10 ,
    fontSize: 18,
    marginVertical:0,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  highlightreport: {
    // marginRight:10 ,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  
});

export default Profile;
