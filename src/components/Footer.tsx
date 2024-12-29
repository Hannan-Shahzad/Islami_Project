import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Book, BookOpen, Timer, Moon, Clock } from 'lucide-react-native';
import colors from '../constants/colors';

const { width } = Dimensions.get('window');

const Footer = () => {
  const menuItems = [
    { icon: BookOpen, label: 'Quran' },
    { icon: Book, label: 'Hadith' },
    { icon: Timer, label: 'Tasbeeh' },
    { icon: Moon, label: 'Mosques' },
    { icon: Clock, label: 'Time' },
  ];

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.menuItem}
          onPress={() => {/* Add navigation logic */}}
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
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
});

export default Footer;