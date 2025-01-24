import { View, Text, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getUser } from '../util/asyncStorage';

const TabIcon = ({ name, color, isFocused }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current; // Scale animation value

  


  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: isFocused ? 1.2 : 1, // Scale up when focused
      duration: 200, // Duration of the animation
      useNativeDriver: true, // Use native driver for performance
    }).start();
  }, [isFocused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Ionicons name={name} size={24} color={color} />
    </Animated.View>
  );
};

export default function Tablayout() {
 const [userType, setUser] = useState(null); // Initialize as null to indicate "not loaded"
  
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUser();
      if (user) {
        setUser(user.type);
      }
    };



    fetchUserData();  // Fetch user data on component mount
  }, []);


 const admin= {
    name: 'home',
    options: {
      href:userType===0 ||userType===1 ? '/home':null,
      tabBarLabel: 'Home',
      tabBarIcon: ({ color, focused }) => (
        <TabIcon name="person-circle-sharp" color={color} isFocused={focused} />
      ),
    },
  };

  // const serviceEngg= {
  //   name: 'customer_info',
  //   options: {
  //     href:userType===1 ? '/customer_info':null,
  //     tabBarLabel: 'Home',
  //     tabBarIcon: ({ color, focused }) => (
  //       <TabIcon name="person-circle-sharp" color={color} isFocused={focused} />
  //     ),
  //   },
  // };


  const profile = {
    name: 'profile',
    options: {
      
      tabBarLabel: 'Dashboard',
      tabBarIcon: ({ color, focused }) => (
        <TabIcon name="grid-outline" color={color} isFocused={focused} />
      ),
    },
  };

  // Show a loading placeholder until userType is determined
  if (userType === null) {
    return <Text>Loading...</Text>;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#AA0A02', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
      }}
    >
      
        <Tabs.Screen
          name={admin.name}
          options={admin.options}
        />
{/* 
        <Tabs.Screen
          name={serviceEngg.name}
          options={serviceEngg.options}
        /> */}
      

      <Tabs.Screen
        name={profile.name}
        options={profile.options}
      />
    </Tabs>
  );
}





