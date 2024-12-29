import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface BeadProps {
  index: number;
  isActive: boolean;
  translateX: number;
  translateY: number;
}

export const TashbeehBead = ({ index, isActive, translateX, translateY }: BeadProps) => {
  // Use `useSharedValue` to create shared values
  const translateYAnim = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      // Animate translateY and scale values when isActive changes
      translateYAnim.value = withSequence(
        withSpring(-20, { damping: 10 }),
        withDelay(100, withSpring(0, { damping: 8 }))
      );
      scale.value = withSequence(
        withSpring(1.2, { damping: 5 }),
        withDelay(100, withSpring(1, { damping: 5 }))
      );
    }
  }, [isActive]);

  // Define animated style using `useAnimatedStyle`
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateYAnim.value },
      { scale: scale.value },
      { translateX: translateX },
      { translateY: translateY },
    ],
  }));

  return (
    <Animated.View style={[styles.beadContainer, animatedStyle]}>
      <LinearGradient
        colors={['#FFD700', '#FFA500', '#FF8C00']}
        style={styles.bead}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {isActive && <Animated.View style={styles.glow} />}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  beadContainer: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bead: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  glow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
});
