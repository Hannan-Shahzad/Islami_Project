import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for the moon and location icons

// Import color constants (create a separate constants/colors.ts file if not already)
import colors from '../constants/colors';

const Mosques = () => {
  const [mosques, setMosques] = useState([]);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData.coords);
      fetchNearbyMosques(locationData.coords.latitude, locationData.coords.longitude);
    })();
  }, []);

  const fetchNearbyMosques = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://api.foursquare.com/v3/places/nearby?ll=${latitude},${longitude}&radius=5000&query=mosque`,
        {
          headers: {
            Authorization: 'fsq3b5wbvwcW/0gEyS96L/b3iiiz8b78tuYT5hQ+HDlAW8s=', // Replace with your Foursquare API Key
          },
        }
      );
      const mosqueResults = response.data.results.filter((place: any) =>
        place.name.toLowerCase().includes('mosque')
      );
      setMosques(mosqueResults);
    } catch (error) {
      console.error('Error fetching mosques:', error);
    }
  };

  const openInGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) => console.error('Failed to open Google Maps', err));
  };

  const renderMosqueItem = ({ item }: { item: { name: string; location: { formatted_address: string }; fsq_id: string, geocodes: { main: { latitude: number, longitude: number } } } }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.gold }]}>
      <View style={styles.row}>
        <Ionicons name="moon" size={20} color="black" style={styles.icon} />
        <Text style={styles.mosqueName}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => openInGoogleMaps(item.geocodes.main.latitude, item.geocodes.main.longitude)} // Open in Google Maps
        >
          <Ionicons name="location-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.mosqueAddress}>{item.location?.formatted_address || 'Address not available'}</Text>
    </TouchableOpacity>
  );

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  return (
    <ImageBackground source={require('../../assets/Backgrounds/mosquesnearby.png')} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Nearby Mosques</Text>
      </View>
      {location && (
        <FlatList
          data={mosques}
          keyExtractor={(item) => item.fsq_id}
          renderItem={renderMosqueItem}
          contentContainerStyle={styles.list}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black tint
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 10,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    marginLeft: 10,
  },
  mosqueAddress: {
    fontSize: 14,
    marginLeft: 10,
    color: 'black',
  },
  icon: {
    marginRight: 10,
    tintColor: 'black',
  },
});

export default Mosques;
