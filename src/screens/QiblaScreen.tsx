import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';

// Define types for location and error state
type LocationData = {
  latitude: number;
  longitude: number;
};

const QiblaScreen: React.FC = () => {
  const [heading, setHeading] = useState<number | null>(null); // Device orientation heading
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null); // Qibla direction
  const [error, setError] = useState<string | null>(null); // Error message state
  const [location, setLocation] = useState<LocationData | null>(null); // User location

  // Calculate Qibla direction based on latitude and longitude
  const calculateQibla = (lat: number, lng: number): number => {
    const kaabaLat = 21.4225; // Latitude of the Kaaba
    const kaabaLng = 39.8262; // Longitude of the Kaaba

    const phi1 = (lat * Math.PI) / 180;
    const phi2 = (kaabaLat * Math.PI) / 180;
    const deltaLambda = ((kaabaLng - lng) * Math.PI) / 180;

    const y = Math.sin(deltaLambda);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
    let qibla = Math.atan2(y, x);
    qibla = (qibla * 180) / Math.PI;
    return (qibla + 360) % 360;
  };

  // Get user's location and calculate Qibla direction
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Please enable location services to find Qibla direction.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      setLocation({ latitude, longitude });
      const qibla = calculateQibla(latitude, longitude);
      setQiblaDirection(qibla);
    };

    getLocation();
  }, []);

  // Handle device orientation for compass
  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      let { x, y } = data;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      setHeading((angle + 360) % 360);
    });

    return () => subscription.remove();
  }, []);

  // Calculate the rotation for the compass arrow
  const getCompassRotation = (): number => {
    if (heading === null || qiblaDirection === null) return 0;
    return qiblaDirection - heading; // Adjusting based on device's heading
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.content}>
          {/* Qibla icon at the top */}
          <FontAwesome name="compass" size={50} color="#FFD700" style={styles.qiblaIcon} />
          <Text style={styles.heading}>Qibla Finder</Text>

          {/* Compass SVG */}
          <Svg width={300} height={300} style={styles.compass}>
            <Circle cx="150" cy="150" r="140" stroke="#FFD700" strokeWidth="4" fill="none" />
            <Circle cx="150" cy="150" r="5" fill="#FFD700" />
            {[...Array(36)].map((_, i) => (
              <Line
                key={i}
                x1="150"
                y1="20"
                x2="150"
                y2={i % 3 === 0 ? "30" : "25"}
                stroke="#FFD700"
                strokeWidth={i % 3 === 0 ? "2" : "1"}
                transform={`rotate(${i * 10}, 150, 150)`} // Draw the direction lines
              />
            ))}

            {/* Qibla direction arrow */}
            <Path
              d="M150 60 L140 100 L160 100 Z"
              fill="green"
              transform={`rotate(${getCompassRotation()}, 150, 150)`} // Dynamic rotation of the arrow
            />

            {/* NSEW labels */}
            <SvgText x="150" y="40" fill="#FFD700" fontSize="16" fontWeight="bold" textAnchor="middle">N</SvgText>
            <SvgText x="150" y="270" fill="#FFD700" fontSize="16" fontWeight="bold" textAnchor="middle">S</SvgText>
            <SvgText x="260" y="155" fill="#FFD700" fontSize="16" fontWeight="bold" textAnchor="middle">E</SvgText>
            <SvgText x="40" y="155" fill="#FFD700" fontSize="16" fontWeight="bold" textAnchor="middle">W</SvgText>
          </Svg>

          <View style={styles.info}>
            {location && (
              <Text style={styles.infoText}>
                Location: {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
              </Text>
            )}
            {qiblaDirection !== null && (
              <Text style={styles.infoText}>
                Qibla: {qiblaDirection.toFixed(1)}°
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  content: {
    alignItems: "center",
  },
  qiblaIcon: {
    marginBottom: 20,
  },
  heading: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  compass: {
    marginBottom: 20,
  },
  info: {
    marginTop: 20,
    alignItems: "center",
  },
  infoText: {
    color: "#FFD700",
    fontSize: 16,
    marginVertical: 5,
  },
});

export default QiblaScreen;
