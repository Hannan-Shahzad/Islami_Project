import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { User, LogIn, LogOut, Book, Sun, Compass, Mail } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#000000',    // Black
  secondary: '#FFD700',  // Gold
  text: '#FFFFFF',       // White
  textSecondary: '#FFD700', // Gold for secondary text
  background: '#FFD700', // Gold background
  headerBackground: '#000000', // Pure black for header
};

const { height, width } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;
const BOX_SIZE = (width - 60) / 2; // Account for padding and gap
import { RootStackParamList } from '../navigation/Types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FirstScreenProps {
  isLoggedIn?: boolean;
  username?: string;
  onLoginPress?: () => void;
  onLogoutPress?: () => void;
}

const FirstScreen: React.FC<FirstScreenProps> = ({
  isLoggedIn = false,
  username = '',
  onLoginPress,
  onLogoutPress,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const navigationItems = [
    { id: 'quran', title: 'Quran', icon: Book, onPress: () => navigation.navigate('HomeScreen') },
    { id: 'sunnah', title: 'Sunnah', icon: Sun, onPress: () => navigation.navigate('SunnahScreen') },
    { id: 'qibla', title: 'Qibla Finder', icon: Compass, onPress: () => navigation.navigate('QiblaScreen') },
    { id: 'contact', title: 'Contact Us', icon: Mail, onPress: () => navigation.navigate('ContactScreen') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.welcomeContainer}>
            <User size={32} color={COLORS.secondary} />
            <Text style={styles.welcomeText}>
              Welcome{isLoggedIn ? `,\n${username}` : ''}
            </Text>
          </View>
          
          {isLoggedIn ? (
            <TouchableOpacity
              style={styles.authButton}
              onPress={onLogoutPress}
            >
              <LogOut size={24} color={COLORS.secondary} />
              <Text style={styles.authButtonText}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.authButtonsContainer}>
              <TouchableOpacity
                style={styles.authButton}
                onPress={onLoginPress}
              >
                <LogIn size={24} color={COLORS.secondary} />
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authButton, styles.signupButton]}
                onPress={onLoginPress}
              >
                <User size={24} color={COLORS.primary} />
                <Text style={[styles.authButtonText, styles.signupButtonText]}>Signup</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: COLORS.headerBackground,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    fontSize: 28,
    color: COLORS.text,
    fontWeight: '700',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  },
  signupButton: {
    backgroundColor: COLORS.secondary,
  },
  authButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  signupButtonText: {
    color: COLORS.primary,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
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