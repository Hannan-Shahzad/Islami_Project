// src/screens/CategoryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import { fetchCategories } from '../services/ApiService';
import { Category } from '../services/ApiService';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Types';
import { Ionicons } from '@expo/vector-icons';  // Icon library

const CategoryScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return (
    <ImageBackground source={require('../../assets/Backgrounds/gradientbg.png')} style={styles.container}>
      {/* Overlay for dark tint */}
      <View style={styles.overlay} />
      
      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('Hadeeths', { categoryId: item.id })}
            >
              <Ionicons name="book" size={28} color="#FFD700" style={styles.icon} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',  // Dark tint overlay
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',  // Semi-transparent black background for each item
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',  // Shadow for the item to make it stand out
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  icon: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    color: '#FFD700',  // Gold color for title text
    fontWeight: 'bold',
  },
});

export default CategoryScreen;
