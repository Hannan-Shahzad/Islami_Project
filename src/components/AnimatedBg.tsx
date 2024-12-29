import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  useSharedValue,
  withDelay,
  withSequence
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import colors  from '../constants/colors';
const { width, height } = Dimensions.get('window');

export const AnimatedBackground = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000 }), 
      -1, 
      false
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 10000 }),
        withTiming(1, { duration: 10000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
  }));

  return (
    <>
      <Animated.View style={[styles.backgroundLayer, animatedStyle]}>
        <LinearGradient
          colors={[colors.gold, colors.black]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <Animated.View style={[styles.overlay]} />
      {/* If you want to add the beading effect, you can insert your Bead component here */}
    </>
  );
};

const styles = StyleSheet.create({
  backgroundLayer: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    top: -height / 2,
    left: -width / 2,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
