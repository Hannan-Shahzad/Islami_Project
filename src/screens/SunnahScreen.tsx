import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Use Expo Linear Gradient

const SunnahScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#000000', '#FFD700']} // Black and Golden Gradient
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Sunnah & Dua</Text>
        <Text style={styles.message}>
          We are still finding the Sunnah and Dua API for you...
        </Text>
        <ActivityIndicator size="large" color="#FFD700" style={styles.spinner} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: 10,
    width: '100%',
    maxWidth: 350,
  },
  title: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  message: {
    color: '#FFD700',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  spinner: {
    marginTop: 10,
  },
});

export default SunnahScreen;
