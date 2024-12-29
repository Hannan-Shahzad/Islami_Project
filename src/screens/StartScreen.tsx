import { View, Text, Image, StyleSheet, Dimensions, LayoutAnimation } from 'react-native';
import React, { useEffect } from 'react';
import colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

export default function StartScreen({ navigation }: any) {

  useEffect(() => {
    const timer = setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      navigation.replace('Onboarding'); // Navigate to Onboarding after 1 second
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Background with Rays */}
      <Image
        source={require('../../assets/Backgrounds/background.png')}
        style={styles.backgroundImage}
        resizeMode="stretch"
      />
      
      {/* Mosque Outline */}
      <Image
        source={require('../../assets/icons/mosque.png')}
        style={styles.mosqueOutline}
        resizeMode="contain"
      />
      
      {/* Decorative Patterns - Top Left */}
      <Image
        source={require('../../assets/icons/Shape-07.png')}
        style={styles.topLeftPattern}
        resizeMode="contain"
      />
      
      {/* Decorative Patterns - Bottom Right */}
      <Image
        source={require('../../assets/icons/Shape-04.png')}
        style={styles.bottomRightPattern}
        resizeMode="contain"
      />
      
      {/* Hanging Lantern */}
      <Image
        source={require('../../assets/icons/Glow.png')}
        style={styles.lantern}
        resizeMode="contain"
      />
      
      {/* Main Logo */}
      <Image
        source={require('../../assets/icons/OBJECTS.png')}
        style={styles.mainLogo}
        resizeMode="contain"
      />
      
      {/* Islami Image */}
      <Image
        source={require('../../assets/icons/Islami.png')}
        style={styles.islamiImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  mosqueOutline: {
    position: 'absolute',
    top: height * 0.05,
    alignSelf: 'center',
    tintColor: colors.gold,
    opacity: 1
  },
  topLeftPattern: {
    position: 'absolute',
    top: height * 0.15,
    width: width * 0.25,
    tintColor: colors.gold,
    opacity: 8.5,
  },
  bottomRightPattern: {
    position: 'absolute',
    bottom: height * 0.05,
    right: width * 0.0,
    tintColor: colors.gold,
    opacity: 8.5,
  },
  lantern: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0,
    width: width * 0.20,
    height: height * 0.25,
  },
  mainLogo: {
    position: 'absolute',
    top: height * 0.35,
    alignSelf: 'center',
    width: width * 0.45,
    height: width * 0.5,
    tintColor: colors.gold,
  },
  islamiImage: {
    position: 'absolute',
    top: height * 0.54,
    alignSelf: 'center',
    width: width * 0.5,
    height: height * 0.15,
    tintColor: colors.gold,
  }
});