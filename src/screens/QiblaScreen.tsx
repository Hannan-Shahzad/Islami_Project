import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { FontAwesome } from '@expo/vector-icons';

type LocationData = {
  latitude: number;
  longitude: number;
};

const DirectionMarker: React.FC<{ direction: string; rotation: string }> = ({ direction, rotation }) => (
  <View style={[styles.directionMarker, { transform: [{ rotate: rotation }] }]}>
    <Text style={styles.directionText}>{direction}</Text>
  </View>
);

const QiblaScreen: React.FC = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const arrowRotation = useRef(new Animated.Value(0)).current;

  const calculateQibla = (lat: number, lng: number): number => {
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (kaabaLat * Math.PI) / 180;
    const kaabaLngRad = (kaabaLng * Math.PI) / 180;
    
    const y = Math.sin(kaabaLngRad - lngRad) * Math.cos(kaabaLatRad);
    const x = Math.cos(latRad) * Math.sin(kaabaLatRad) -
              Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(kaabaLngRad - lngRad);
    
    let qibla = Math.atan2(y, x);
    qibla = (qibla * 180) / Math.PI;
    return (qibla + 360) % 360;
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    const setupLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission is required for Qibla direction');
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1
          },
          (location) => {
            const { latitude, longitude, accuracy } = location.coords;
            setLocation({ latitude, longitude });
            setAccuracy(accuracy || 0);
            const qibla = calculateQibla(latitude, longitude);
            setQiblaDirection(qibla);
          }
        );
      } catch (err) {
        setError('Error getting location: ' + (err as Error).message);
      }
    };

    setupLocation();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    let subscription: any;

    const setupMagnetometer = async () => {
      try {
        await Magnetometer.setUpdateInterval(100);
        subscription = Magnetometer.addListener((data) => {
          let angle = Math.atan2(data.y, data.x);
          let degree = (angle * 180) / Math.PI;
          if (Platform.OS === 'ios') {
            degree = (degree + 90 + 360) % 360;
          } else {
            degree = (degree - 90 + 360) % 360;
          }
          setHeading(degree);
        });
      } catch (err) {
        setError('Error accessing compass: ' + (err as Error).message);
      }
    };

    setupMagnetometer();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (heading !== null && qiblaDirection !== null) {
      let rotation = qiblaDirection - heading;
      if (rotation > 180) rotation -= 360;
      if (rotation < -180) rotation += 360;
      
      Animated.spring(arrowRotation, {
        toValue: rotation,
        useNativeDriver: true,
        friction: 7,
        tension: 40
      }).start();
    }
  }, [heading, qiblaDirection]);

  const getCompassRotation = () => {
    return arrowRotation.interpolate({
      inputRange: [-180, 180],
      outputRange: ['-180deg', '180deg'],
    });
  };

  const calculateDistance = () => {
    if (!location) return null;
    const R = 6371;
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    
    const dLat = ((kaabaLat - location.latitude) * Math.PI) / 180;
    const dLon = ((kaabaLng - location.longitude) * Math.PI) / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos((location.latitude * Math.PI) / 180) * 
             Math.cos((kaabaLat * Math.PI) / 180) * 
             Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={40} color="#FFD700" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.header}>
            <FontAwesome name="compass" size={40} color="#FFD700" />
            <Text style={styles.heading}>Qibla Finder</Text>
          </View>

          <View style={styles.compass}>
            <View style={styles.compassRing}>
              {[...Array(72)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.tick,
                    {
                      transform: [
                        { rotate: `${i * 5}deg` },
                        { translateY: -135 },
                      ],
                      height: i % 6 === 0 ? 15 : 8,
                      backgroundColor: i % 6 === 0 ? '#FFD700' : '#AA8C3F',
                    },
                  ]}
                />
              ))}
              <Animated.View
                style={[
                  styles.arrow,
                  {
                    transform: [{ rotate: getCompassRotation() }],
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            {location && (
              <>
                <View style={styles.infoRow}>
                  <FontAwesome name="location-arrow" size={20} color="#FFD700" />
                  <Text style={styles.infoText}>
                    {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome name="arrow-circle-right" size={20} color="#FFD700" />
                  <Text style={styles.infoText}>
                    Qibla: {qiblaDirection?.toFixed(1)}°
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome name="road" size={20} color="#FFD700" />
                  <Text style={styles.infoText}>
                    Distance to Kaaba: {calculateDistance()} km
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome name="bullseye" size={20} color="#FFD700" />
                  <Text style={styles.infoText}>
                    Accuracy: ±{Math.round(accuracy)}m
                  </Text>
                </View>
              </>
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
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FFD700',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  heading: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  compass: {
    width: Math.min(Dimensions.get('window').width - 40, 300),
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassRing: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  directionMarker: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  directionText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tick: {
    position: 'absolute',
    width: 2,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 180,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFD700',
  },
  infoContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    marginTop: 30,
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    color: '#FFD700',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default QiblaScreen;