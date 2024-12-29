import React from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { useFonts } from 'expo-font';
import colors from '../constants/colors';

interface HeaderProps {
  title?: string;
}

const Header = ({ title = 'Sura Name' }: HeaderProps) => {
  const [fontsLoaded] = useFonts({
    Kamali: require('../../assets/fonts/Kamali-Personal-Use-BF65d1e1d684dd3.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Mosque Outline */}
      <Image
        source={require('../../assets/icons/HomeLogo.png')}
        style={styles.HomeLogoImage}
        resizeMode="contain"
      />
      {/* Search Container */}
      <View style={styles.searchContainer}>
        <Image
          source={require('../../assets/icons/moon.png')}
          style={styles.moonIcon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder={title}
          placeholderTextColor={colors.gold}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  HomeLogoImage: {
    width: '80%',
    height: '80%',
    marginTop: 20,
    // tintColor: colors.gold,
    opacity: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#1A1A1A',
    borderRadius: 10,
    width: '90%',
    // marginTop: -65,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  moonIcon: {
    width: 20,
    height: 20,
    tintColor: colors.gold,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    color: colors.gold,
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Header;