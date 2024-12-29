import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";
import { createClient } from "@supabase/supabase-js";

// Supabase Setup
const SUPABASE_URL = "https://your-supabase-url.supabase.co";
const SUPABASE_KEY = "your-supabase-key";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PrayTimesScreen = () => {
  const [loading, setLoading] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [location, setLocation] = useState<{ city: string; country: string }>();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const fetchPrayerTimes = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const city = address.city || "lahore";
      const country = address.country || "pakistan";

      setLocation({ city, country });

      const today = new Date().toISOString().split("T")[0];
      const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${today}?city=${city}&country=${country}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setPrayerTimes(data.data);
      setLoading(false);

      scheduleNotifications(data.data.timings);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };

  const scheduleNotifications = async (timings: any) => {
    for (const [prayerName, time] of Object.entries(timings)) {
      const [hour, minute] = time.split(":").map(Number);
      const now = new Date();
      const prayerTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);

      if (prayerTime > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `It's time for ${prayerName}`,
            body: `Click to open the app and listen to Adhan.`,
            sound: true,
            data: { prayerName }, // Pass the prayer name for Adhan logic
          },
          trigger: prayerTime,
        });
      }
    }
  };

  const playAdhan = async (prayerName: string) => {
    try {
      const audioFile =
        prayerName.toLowerCase() === "fajr"
          ? require("./assets/adhanFajr.mp3")
          : require("./assets/adhan.mp3");

      const { sound } = await Audio.Sound.createAsync(audioFile);
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing Adhan:", error);
    }
  };

  useEffect(() => {
    Notifications.addNotificationResponseReceivedListener((response) => {
      const prayerName = response.notification.request.content.data.prayerName;
      playAdhan(prayerName);
    });

    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Islami</Text>
      </View>

      <View style={styles.prayerTimesContainer}>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        <Text style={styles.day}>Tuesday</Text>

        {prayerTimes && (
          <View style={styles.prayerTimeBox}>
            {Object.entries(prayerTimes.timings).map(([key, time]) => (
              <View key={key} style={styles.timeContainer}>
                <Text style={styles.timeName}>{key}</Text>
                <Text style={styles.timeValue}>{time}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.nextPrayerText}>
          Next Prayer in: 02:32
        </Text>
      </View>

      <View style={styles.azkarContainer}>
        <TouchableOpacity style={styles.azkarCard}>
          <Image
            source={require("./assets/evening_azkar.png")}
            style={styles.azkarImage}
          />
          <Text style={styles.azkarText}>Evening Azkar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.azkarCard}>
          <Image
            source={require("./assets/morning_azkar.png")}
            style={styles.azkarImage}
          />
          <Text style={styles.azkarText}>Morning Azkar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#121212",
      paddingHorizontal: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#121212",
    },
    header: {
      alignItems: "center",
      marginVertical: 20,
    },
    appTitle: {
      fontSize: 36,
      color: "#FFD700",
      fontWeight: "bold",
      fontFamily: "Cursive",
    },
    prayerTimesContainer: {
      backgroundColor: "#1E1E1E",
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
    },
    date: {
      fontSize: 16,
      color: "#AAA",
      textAlign: "center",
    },
    day: {
      fontSize: 20,
      color: "#FFF",
      textAlign: "center",
      marginBottom: 10,
    },
    prayerTimeBox: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    timeContainer: {
      alignItems: "center",
      width: "30%",
      marginVertical: 10,
    },
    timeName: {
      fontSize: 14,
      color: "#FFD700",
    },
    timeValue: {
      fontSize: 16,
      color: "#FFF",
    },
    nextPrayerText: {
      fontSize: 16,
      color: "#FFD700",
      textAlign: "center",
    },
    azkarContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    azkarCard: {
      backgroundColor: "#1E1E1E",
      borderRadius: 10,
      alignItems: "center",
      padding: 15,
      width: "48%",
    },
    azkarImage: {
      width: 60,
      height: 60,
      marginBottom: 10,
    },
    azkarText: {
      fontSize: 16,
      color: "#FFF",
      textAlign: "center",
    },
  });
  
  export default PrayTimesScreen;