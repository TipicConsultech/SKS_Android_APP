import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SkeletonCard = () => (
  <View style={styles.card}>
    <LinearGradient
      colors={['#e0e0e0', '#f8f8f8', '#e0e0e0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.imagePlaceholder}
    />
    <View style={styles.textContainer}>
      <LinearGradient
        colors={['#e0e0e0', '#f8f8f8', '#e0e0e0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.textPlaceholder}
      />
      <LinearGradient
        colors={['#e0e0e0', '#f8f8f8', '#e0e0e0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.textPlaceholder, styles.shortText]}
      />
    </View>
  </View>
);

const CardSkeletonLoader = () => {
  const cards = Array.from({ length: 5 });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {cards.map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  textContainer: {
    flexDirection: 'column',
  },
  textPlaceholder: {
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  shortText: {
    width: '60%',
  },
});

export default CardSkeletonLoader;

