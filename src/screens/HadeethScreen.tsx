// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
// import { fetchHadeeths, fetchHadeethDetails } from '../services/ApiService';
// import { Hadeeth } from '../services/ApiService';
// import { useRoute, RouteProp } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Icon from 'react-native-vector-icons/FontAwesome';

// type HadeethScreenRouteProp = RouteProp<{ params: { categoryId: number } }, 'params'>;

// const HadeethScreen = () => {
//   const [hadeeths, setHadeeths] = useState<Hadeeth[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [language, setLanguage] = useState<string>('ar');
//   const route = useRoute<HadeethScreenRouteProp>();
//   const { categoryId } = route.params;

//   useEffect(() => {
//     const getHadeeths = async () => {
//       try {
//         console.log(`Fetching Hadeeths for categoryId: ${categoryId}, language: ${language}`);
//         const data = await fetchHadeeths(categoryId, language);
//         console.log('Fetched Hadeeths:', data);
//         setHadeeths(data);  // Make sure this line works and the data is correct
//       } catch (error) {
//         console.error('Error fetching Hadeeths:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getHadeeths();
//   }, [categoryId, language]);

//   const handleToggleLanguage = () => {
//     setLanguage((prevLanguage) => (prevLanguage === 'ar' ? 'en' : 'ar'));
//   };

//   return (
//     <LinearGradient colors={['#000000', '#000000', '#000000']} style={styles.container}>
//       {/* Logo */}
//       <View style={styles.logoContainer}>
//         <Image source={require('../../assets/icons/HomeLogo.png')} style={styles.logo} />
//       </View>

//       {/* Overlay */}
//       <View style={styles.overlay} />

//       {/* Language Toggle Button */}
//       <TouchableOpacity style={styles.languageButton} onPress={handleToggleLanguage}>
//         <Text style={styles.languageButtonText}>
//           {language === 'ar' ? 'Show in English' : 'Show in Arabic'}
//         </Text>
//       </TouchableOpacity>

//       {/* Loading Spinner or Hadeeth List */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#FFD700" />
//       ) : (
//         <FlatList
//   data={hadeeths}
//   keyExtractor={(item) => item.id.toString()}
//   renderItem={({ item }) => (
//     <TouchableOpacity
//       style={styles.item}
//       onPress={async () => {
//         console.log(`Fetching details for Hadeeth ID: ${item.id}`);
//         const hadeeth = await fetchHadeethDetails(item.id, language);
//         alert(hadeeth.text); // or use another field like 'hadeeth.title'
//       }}
//     >
//       <Icon name="book" size={24} color="#FFD700" style={styles.icon} />
//       <Text style={styles.text}>{item.title}</Text> {/* Change item.text to item.title */}
//     </TouchableOpacity>
//   )}
// />

//       )}
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//     zIndex: 10,
//   },
//   logo: {
//     width: 120,
//     height: 120,
//     resizeMode: 'contain',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.75)',
//   },
//   languageButton: {
//     padding: 12,
//     backgroundColor: '#FFD700',
//     alignItems: 'center',
//     marginBottom: 10,
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   languageButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   item: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 18,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//     backgroundColor: '#000000',
//     marginVertical: 8,
//     borderRadius: 10,
//   },
//   text: {
//     fontSize: 18,
//     color: '#FFD700',
//     marginLeft: 12,
//     fontWeight: 'bold',
//   },
//   icon: {
//     padding: 8,
//   },
// });

// export default HadeethScreen;



import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { fetchHadeeths } from '../services/ApiService';
import { Hadeeth } from '../services/ApiService';
import { useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Types';

type HadeethScreenRouteProp = RouteProp<{ params: { categoryId: number } }, 'params'>;

const HadeethScreen = () => {
  const [hadeeths, setHadeeths] = useState<Hadeeth[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('ar');
  const route = useRoute<HadeethScreenRouteProp>();
  const { categoryId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Access navigation with types

  useEffect(() => {
    const getHadeeths = async () => {
      try {
        // console.log(`Fetching Hadeeths for categoryId: ${categoryId}, language: ${language}`);
        const data = await fetchHadeeths(categoryId, language);
        // console.log('Fetched Hadeeths:', data);
        setHadeeths(data);
      } catch (error) {
        // console.error('Error fetching Hadeeths:', error);
      } finally {
        setLoading(false);
      }
    };

    getHadeeths();
  }, [categoryId, language]);

  const handleToggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'ar' ? 'en' : 'ar'));
  };

  return (
    <LinearGradient colors={['#000000', '#000000', '#000000']} style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/icons/HomeLogo.png')} style={styles.logo} />
      </View>

      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Language Toggle Button */}
      <TouchableOpacity style={styles.languageButton} onPress={handleToggleLanguage}>
        <Text style={styles.languageButtonText}>
          {language === 'ar' ? 'Show in English' : 'Show in Arabic'}
        </Text>
      </TouchableOpacity>

      {/* Loading Spinner or Hadeeth List */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" />
      ) : (
        <FlatList
          data={hadeeths}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                // Navigate to HadeethDetail screen and pass the `id`
                navigation.navigate('HadeethDetail', { id: item.id });
              }}
            >
              <Icon name="book" size={24} color="#FFD700" style={styles.icon} />
              <Text style={styles.text}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 10,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  languageButton: {
    padding: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#000000',
    marginVertical: 8,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: '#FFD700',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  icon: {
    padding: 8,
  },
});

export default HadeethScreen;
