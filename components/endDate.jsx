// import React, { useState } from "react";
// import { View, Button, Text, Platform } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";

// const CalendarPicker = () => {
//   const [date, setDate] = useState(new Date());
//   const [show, setShow] = useState(false);

//   const onChange = (event, selectedDate) => {
//     setShow(Platform.OS === "ios"); // Keep iOS modal open
//     if (selectedDate) {
//       setDate(selectedDate);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 18 }}>Selected Date: {date.toDateString()}</Text>
//       <Button title="Pick a Date" onPress={() => setShow(true)} />
//       {show && (
//         <DateTimePicker
//           value={date}
//           mode="date"
//           display="default"
//           onChange={onChange}
//         />
//       )}
//     </View>
//   );
// };

// export default CalendarPicker;
