import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Book, BookOpen, Timer, Moon, Clock, Bookmark } from 'lucide-react-native';
import colors from '../constants/colors';

const { width } = Dimensions.get('window');
interface FooterProps {
  navigation: any;
}
const Footer = ({ navigation }: FooterProps) => {
  const menuItems = [
    { icon: BookOpen, label: 'Quran', screen: 'HomeScreen' },
    { icon: Book, label: 'Hadith', screen: 'Categories' },
    { icon: Timer, label: 'Tasbeeh', screen: 'TasbeehCounter' },
    { icon: Moon, label: 'Mosques', screen: 'Mosques' },
    { icon: Clock, label: 'Time', screen: 'PrayerTimesScreen' },
    { icon: Bookmark, label: 'Bookmark', screen: 'BookmarkScreen' },
  ];

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.screen)}
        >
          <item.icon 
            size={24} 
            color="#000" 
            style={styles.icon}
          />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.gold,
    width: width,
    height: 70,
    position: 'absolute',
    bottom: 0,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
  },
});

export default Footer;