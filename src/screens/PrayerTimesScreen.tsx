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
import { supabase } from "../configs/SupabaseConfig";
import { useNavigation } from "@react-navigation/native"; // Importing useNavigation
import { RootStackParamList } from "../navigation/Types";
import type { StackNavigationProp } from "@react-navigation/stack";

interface AzkarCardProps {
  title: string;
  imageSource: any;
  navigateTo: keyof RootStackParamList; // Ensure it's a valid route name from RootStackParamList
}

const AzkarCard: React.FC<AzkarCardProps> = ({
  title,
  imageSource,
  navigateTo,
}) => {
  // Use the navigation hook, typing it with StackNavigationProp and RootStackParamList
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    // You can pass the route name (navigateTo) and optional parameters if needed
    navigation.navigate(navigateTo as never); // Use 'as never' to tell TypeScript that navigateTo is a valid route name
  };

  return (
    <TouchableOpacity style={styles.azkarCard} onPress={handlePress}>
      <Image source={imageSource} style={styles.azkarImage} />
      <Text style={styles.azkarText}>{title}</Text>
    </TouchableOpacity>
  );
};

const PrayTimesScreen = () => {
  const [loading, setLoading] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [location, setLocation] = useState<{ city: string; country: string }>();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

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

      calculateNextPrayer(data.data.timings);
      scheduleNotifications(data.data.timings);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };

  const calculateNextPrayer = (timings: any) => {
    const now = new Date();
    let closestTime = Infinity;
    let upcomingPrayer = null;

    for (const [prayerName, time] of Object.entries(timings)) {
      const [hour, minute] = (time as string).split(":").map(Number);
      const prayerTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute
      );

      if (
        prayerTime > now &&
        prayerTime.getTime() - now.getTime() < closestTime
      ) {
        closestTime = prayerTime.getTime() - now.getTime();
        upcomingPrayer = prayerName;
      }
    }
    setNextPrayer(upcomingPrayer);
  };

  const scheduleNotifications = async (timings: any) => {
    for (const [prayerName, time] of Object.entries(timings)) {
      const [hour, minute] = (time as string).split(":").map(Number);
      const now = new Date();
      const prayerTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute
      );

      if (prayerTime > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `It's time for ${prayerName}`,
            body: `Click to open the app and listen to Adhan.`,
            sound: true,
            data: { prayerName },
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
          ? require("../../assets/audio/adhanFajr.mp3")
          : require("../../assets/audio/azan1.mp3");

      const { sound } = await Audio.Sound.createAsync(audioFile);
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing Adhan:", error);
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);

  const playPauseAdhan = async () => {
    try {
      if (isPlaying) {
        // If it's currently playing, pause it
        await sound?.pauseAsync();
        setIsPlaying(false);
      } else {
        // If it's paused, play it
        const audioFile = require("../../assets/audio/azan1.mp3"); // Replace with any Azan audio file you want
        const { sound } = await Audio.Sound.createAsync(audioFile);
        setSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing/pausing Adhan:", error);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup when the component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);


  useEffect(() => {
    Notifications.addNotificationResponseReceivedListener((response) => {
      const prayerName = response.notification.request.content.data.prayerName;
      playAdhan(prayerName);
    });

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
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
        <Image
          source={require("../../assets/icons/HomeLogo.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>
          📍 {location?.city}, {location?.country}
        </Text>
      </View>

      <View style={styles.prayerTimesContainer}>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        <Text style={styles.day}>Tuesday</Text>

        {prayerTimes && (
          <View style={styles.prayerTimeBox}>
            {Object.entries(prayerTimes.timings).map(([key, time]) => (
              <View
                key={key}
                style={[
                  styles.timeContainer,
                  nextPrayer === key ? styles.highlightedPrayer : null,
                ]}
              >
                <Text style={styles.timeName}>{key}</Text>
                <Text style={styles.timeValue}>{time as string}</Text>
                {nextPrayer === key && (
                  <TouchableOpacity onPress={() => playAdhan(key)}>
                    <Text style={styles.playButton}>Play</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        <Text style={styles.nextPrayerText}>
          Next Prayer: {nextPrayer || "Calculating..."}
        </Text>
      </View>

      <View style={styles.playButtonContainer}>
        <TouchableOpacity onPress={playPauseAdhan} style={styles.playButton2}>
          <Text style={styles.playButtonText}>
            {isPlaying ? "Pause Azan" : "Play Azan"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.azkarContainer}>
        <AzkarCard
          title="Azkar_alSabah"
          imageSource={require("../../assets/icons/Illustration-7.png")}
          navigateTo="AzkarAlSabah" // Assuming you have a screen called 'MorningAzkar'
        />
        <AzkarCard
          title="Azkar_alMasaa"
          imageSource={require("../../assets/icons/Illustration-6.png")}
          navigateTo="AzkarAlMasah" // Assuming you have a screen called 'EveningAzkar'
        />
        <AzkarCard
          title="Post Prayer Azkar"
          imageSource={require("../../assets/icons/Illustration-3.png")}
          navigateTo="PostPrayerAzkar" // Assuming you have a screen called 'PostPrayerAzkar'
        />
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
  playButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  playButton2: {
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  playButtonText: {
    fontSize: 18,
    color: "#121212",
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
  logo: {
    width: "100%",
    // height: '100%',
  },
  locationContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: "#FFD700",
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
  highlightedPrayer: {
    backgroundColor: "#FFD700",
    borderRadius: 10,
    padding: 5,
  },
  playButton: {
    color: "#FFF",
    fontSize: 12,
    marginTop: 5,
    textDecorationLine: "underline",
  },
  nextPrayerText: {
    fontSize: 16,
    color: "#FFD700",
    textAlign: "center",
  },
  azkarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    margin: 10,
    gap: 10,
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
