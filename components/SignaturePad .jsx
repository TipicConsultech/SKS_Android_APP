 // SignaturePad.js
import React, { useRef } from 'react';
import { View, StyleSheet, Text,Alert ,TouchableOpacity} from 'react-native';
import Signature from 'react-native-signature-canvas';


const SignaturePad = ({ onOK,onClose }) => {
  const ref = useRef();
  console.log(ref);
console.log("signature pad open");
  const handleClear = () => {
    ref?.current?.clearSignature();
    onClose();
  };
 
  const handleConfirm = () => {

    Alert.alert(
      "Confirmation", // Title of the alert
      `Do you want to Save Signature`, // Message
      [
        {
          text: "Cancel", // Button text
          style: "cancel", // Button style (optional)
        },
        {
          text: "Yes", // Button text
          onPress: () => ref?.current?.readSignature() // Call your function here
        },
      ],
      { cancelable: true } // Allow dismissing the alert by tapping outside
    );
    
   
  };

  const handleLongPressConfirm = () => {

    ref?.current?.readSignature(); // Call your function here
      
  };
 
  return (
    <View  style={{height:350,width:'100%'}}>
        {/* <Text>{"signaure test"}</Text> */}
      <Signature
        ref={ref}
        onOK={onOK}
        onClear={handleClear}
        descriptionText="Sign"
        clearText="Clear"
        confirmText="Save"
        Style={`.m-signature-pad--footer {display: none; margin: 0px;}`}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.customButtonClear} onPress={handleClear}>
                  <Text style={styles.buttonClearText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.customButtonSave} onPress={handleConfirm} onLongPress={handleLongPressConfirm}>
                          <Text style={styles.buttonSaveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    height:'auto',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  customButtonSave: {
    backgroundColor: "black",
      paddingVertical: 13,
      paddingHorizontal: 28,
      borderRadius: 8,
      marginTop: 5,
      marginBottom:25,
      
      alignItems: "center",
      elevation: 4,
    },
  buttonSaveText: {
    color: "#fff",
    fontSize: 13,
   
  },
  customButtonClear: {
    backgroundColor: "red",
      paddingVertical: 13,
      paddingHorizontal: 28,
      borderRadius: 8,
      marginTop: 5,
      marginBottom:25,
      
      alignItems: "center",
      elevation: 4,
    },
  buttonClearText: {
    color: "#fff",
    fontSize: 13,
   
  },
});
 
export default SignaturePad;
 
 
 