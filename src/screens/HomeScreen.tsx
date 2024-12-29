// import React from 'react'
// import Header from '../components/Header'
// import Background from '../components/Background'
// import Footer from '../components/Footer'
// import Recents from '../components/Recents'
// import SurahList from '../components/SurahList'

// import { NavigationProp } from '@react-navigation/native';

// interface HomeScreenProps {
//   navigation: NavigationProp<any>;
// }

// export default function HomeScreen({ navigation }: HomeScreenProps) {
//   return (
//     <>
//       <Background />
//       <Header />
//       <Recents />
//       <SurahList navigation={navigation} />
//       <Footer />
//     </>
//   )
// }



import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import SurahList from '../components/SurahList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Types';
import Recents from '../components/Recents';
import Footer from '../components/Footer';
import Background from '../components/Background';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <Background />
      <Header title="Search Surah" onSearch={handleSearch} />
      <Recents />
      <SurahList navigation={navigation} searchQuery={searchQuery} />
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default HomeScreen;

