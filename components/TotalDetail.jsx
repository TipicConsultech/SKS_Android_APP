// TotalDetails.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TotalDetails = ({ closeDetails }) => {
  return (
    <View style={styles.detailsContainer}>
      <Text>Total details content goes here.</Text>
      <TouchableOpacity onPress={closeDetails}>
        <Text style={styles.closeDetailsText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeDetailsText: {
    color: '#007BFF',
    marginTop: 10,
  },
});

export default TotalDetails;
