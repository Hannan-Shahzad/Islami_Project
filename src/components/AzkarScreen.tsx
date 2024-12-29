import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import colors from "../constants/colors";

// Define types for Azkar object and component props
interface Azkar {
  zekr: string;
  repeat: string;
  bless?: string;
}

interface AzkarScreenProps {
  apiUrl: string;
  title: string;
  backgroundColor: string;
}

const AzkarScreen: React.FC<AzkarScreenProps> = ({ apiUrl, title, backgroundColor }) => {
  const [azkars, setAzkars] = useState<Azkar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [fontsLoaded] = useFonts({
    Janna: require("../../assets/fonts/Janna.ttf"),
  });

  useEffect(() => {
    fetchAzkars();
  }, []);

  const fetchAzkars = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
    //   console.log('Fetched Azkars:', data); // Log the fetched data
  
      // Ensure data.content is an array before setting state
      if (Array.isArray(data.content)) {
        setAzkars(data.content); // Access the 'content' property for the Azkars array
      } else {
        console.error("Expected an array of Azkars under 'content', but got:", data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Azkars:", error);
      setLoading(false);
    }
  };
  

  if (!fontsLoaded || loading) {
    return (
      <View style={{ ...styles.loadingContainer, backgroundColor }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container]}>
      <Text style={styles.title}>{title}</Text>
      {azkars && Array.isArray(azkars) && azkars.length > 0 ? (
        azkars.map((azkar, index) => (
          <View key={index} style={styles.azkarCard}>
            <Text style={styles.azkarText}>{azkar.zekr}</Text>
            <Text style={styles.repeatText}>Repeat: {azkar.repeat}</Text>
            {azkar.bless && <Text style={styles.blessText}>{azkar.bless}</Text>}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No Azkars available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Janna",
    fontSize: 24,
    color: colors.gold,
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  azkarCard: {
    backgroundColor: colors.gold,
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  azkarText: {
    fontFamily: "Janna",
    fontSize: 18,
    color: colors.black,
    lineHeight: 24,
  },
  repeatText: {
    fontFamily: "Janna",
    fontSize: 16,
    color: "#000000FF",
    marginTop: 10,
  },
  blessText: {
    fontFamily: "Janna",
    fontSize: 16,
    color: "#000000FF",
    marginTop: 10,
  },
  noDataText: {
    fontFamily: "Janna",
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AzkarScreen;
