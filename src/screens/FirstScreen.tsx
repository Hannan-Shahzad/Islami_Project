import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { LogIn, LogOut, Book, Sun, Compass, Mail } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#000000',    // Black
  secondary: '#FFD700',  // Gold
  text: '#FFFFFF',       // White
  textSecondary: '#FFD700', // Gold for secondary text
  background: '#000000', // Black background for header
  bodyBackground: '#D4AF37', // Gold background for body
};

const { height, width } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;
const BOX_SIZE = (width - 60) / 2; // Account for padding and gap
import { RootStackParamList } from '../navigation/Types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FirstScreenProps {
  isLoggedIn?: boolean;
  name?: string;
  onLoginPress?: () => void;
  onLogoutPress?: () => void;
}

const FirstScreen: React.FC<FirstScreenProps> = ({
  isLoggedIn = false,
  name = '',
  onLoginPress,
  onLogoutPress,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [userName, setUserName] = useState(name || '');

  console.log('FirstScreen props:', { isLoggedIn, name });

  const navigationItems = [
    { id: 'quran', title: 'Quran', icon: Book, onPress: () => navigation.navigate('HomeScreen') },
    { id: 'sunnah', title: 'Sunnah', icon: Sun, onPress: () => navigation.navigate('SunnahScreen') },
    { id: 'qibla', title: 'Qibla Finder', icon: Compass, onPress: () => navigation.navigate('QiblaScreen') },
    { id: 'contact', title: 'Contact Us', icon: Mail, onPress: () => navigation.navigate('ContactScreen') },
  ];

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedLoggedIn = await AsyncStorage.getItem('loggedIn');
      
      console.log('Stored username:', storedUsername);
      console.log('Stored loggedIn:', storedLoggedIn);

      if (storedLoggedIn === 'true') {
        setLoggedIn(true);
        setUserName(storedUsername || 'User');
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (name && name !== userName) {
      console.log('Updating userName from prop:', name);
      setUserName(name);
    }
  }, [name]);

  useEffect(() => {
    setLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  // Handle login and logout functionality
  const handleLoginPress = async () => {
    if (onLoginPress) {
      onLoginPress();
    }
    navigation.navigate('AuthScreen');
  };

  const handleLogoutPress = async () => {
    if (onLogoutPress) {
      onLogoutPress();
    }
    setLoggedIn(false);
    setUserName('');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.setItem('loggedIn', 'false');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Black Background */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Login/Logout button */}
          {!loggedIn ? (
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleLoginPress}
            >
              <LogIn size={24} color={COLORS.secondary} />
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleLogoutPress}
            >
              <LogOut size={24} color={COLORS.secondary} />
              <Text style={styles.authButtonText}>Logout</Text>
            </TouchableOpacity>
          )}

          {/* Welcome section in the middle, aligned to the left */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.userText}>{loggedIn ? userName : 'User'}</Text>
          </View>
        </View>
      </View>

      {/* Body with Yellow Background */}
      <View style={styles.body}>
        {/* Navigation Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {navigationItems.slice(0, 2).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={item.onPress}
              >
                <View style={styles.iconContainer}>
                  <item.icon size={28} color={COLORS.primary} />
                </View>
                <Text style={styles.gridItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.gridRow}>
            {navigationItems.slice(2, 4).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={item.onPress}
              >
                <View style={styles.iconContainer}>
                  <item.icon size={28} color={COLORS.primary} />
                </View>
                <Text style={styles.gridItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bodyBackground,  // Black background for container
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: COLORS.background,  // Black background for header
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  welcomeContainer: {
    flexDirection: 'column',  // Changed to column for vertical alignment
    alignItems: 'flex-start', // Aligned to left
    gap: 8,
  },
  welcomeText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '700',
    textAlign: 'left',
  },
  userText: {
    fontSize: 32, // Large size for User's name
    color: COLORS.text,
    fontWeight: '700',
    textAlign: 'left',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
    gap: 8,
    alignSelf: 'flex-start', // Align login button to the top-left
  },
  authButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.bodyBackground,  // Yellow background for body
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  gridContainer: {
    flex: 1,
    gap: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridItemText: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FirstScreen;