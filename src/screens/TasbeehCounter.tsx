import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Dimensions,
  Switch,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { TashbeehBead } from '../components/TasbeehBeads';

const { width, height } = Dimensions.get('window');
const STORAGE_KEY = '@tashbeeh_settings';
const MAX_VISIBLE_BEADS = 11;

export default function TashbeehCounter() {
  const [count, setCount] = useState(0);
  const [settings, setSettings] = useState({
    vibrationEnabled: true,
    soundEnabled: true,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeBeadIndex, setActiveBeadIndex] = useState(-1);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: typeof settings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handlePress = useCallback(() => {
    setCount(prev => prev + 1);
    setActiveBeadIndex((count + 1) % MAX_VISIBLE_BEADS);

    if (settings.vibrationEnabled) {
      Vibration.vibrate(50);
    }
  }, [settings.vibrationEnabled, count]);

  const handleReset = useCallback(() => {
    setCount(0);
    setActiveBeadIndex(-1);
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const renderBeads = () => {
    const radius = 120; // radius for the circle of beads
    return Array.from({ length: count }).map((_, index) => {
      const angle = (index * 360) / count; // Determine the angle for each bead
      const translateX = radius * Math.cos((angle * Math.PI) / 180);
      const translateY = radius * Math.sin((angle * Math.PI) / 180);

      return (
        <TashbeehBead
          key={index}
          index={index}
          isActive={index === activeBeadIndex}
          translateX={translateX}
          translateY={translateY}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Background image and black tint */}
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../../assets/Backgrounds/tasbeehBG.png')}  // Add your background image here
          style={styles.backgroundImage}
        />
        <View style={styles.tint}></View>
      </View>
  
      {/* Logo at the top */}
      <Image
        source={require('../../assets/icons/HomeLogo.png')}
        style={styles.logo}
      />
  
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={toggleSettings}
      >
        <Settings color="#fff" size={24} />
      </TouchableOpacity>
  
      {showSettings ? (
        <BlurView intensity={20} style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Vibration</Text>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) =>
                saveSettings({ ...settings, vibrationEnabled: value })
              }
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.vibrationEnabled ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Sound</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) =>
                saveSettings({ ...settings, soundEnabled: value })
              }
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.soundEnabled ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </BlurView>
      ) : (
        <TouchableOpacity
          style={styles.counterContainer}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View style={styles.beadsContainer}>
            {renderBeads()}
          </View>
  
          <Text style={styles.counterText}>{count}</Text>
  
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: -1, // Make sure the background is behind other elements
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    tint: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    logo: {
      position: 'absolute',
      top: 50,
      alignContent: 'center',
      left: (width - 200) / 2,
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
    counterContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    beadsContainer: {
      position: 'absolute',
      top: '42%', // Center vertically around the counter
      left: '50%', // Center horizontally around the counter
      width: width * 0.7, // Adjust the width of the beads container
      height: width * 0.7, // Adjust the height of the beads container to make it circular
      borderRadius: width * 0.35, // Make the container circular
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -50, // Adjust if necessary to fine-tune the position
      marginLeft: -width * 0.35, // Adjust horizontal position
    },
    counterText: {
      fontSize: 120,
      fontWeight: 'bold',
      color: '#fff',
      textShadowColor: 'rgba(255,255,255,0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    resetButton: {
      position: 'absolute',
      bottom: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    resetText: {
      color: '#fff',
      fontSize: 16,
    },
    settingsButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 1,
      padding: 10,
    },
    settingsContainer: {
      flex: 1,
      padding: 20,
      paddingTop: 100,
    },
    settingsTitle: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    settingText: {
      color: '#fff',
      fontSize: 18,
    },
  });
  