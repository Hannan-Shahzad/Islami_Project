import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface OnboardingSlide {
  image: any;
  text: string;
}

interface OnboardingCarouselProps {
  slides: OnboardingSlide[];
  onComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

export const OnboardingCarousel = ({ slides, onComplete }: OnboardingCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnimation = useSharedValue(0);

  useEffect(() => {
    slideAnimation.value = withSpring(currentSlide);
  }, [currentSlide, slideAnimation]);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      onComplete?.();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const renderSlide = (index: number) => {
    const inputRange = [index - 1, index, index + 1];

    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        slideAnimation.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        slideAnimation.value,
        inputRange,
        [0, 1, 0],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View key={index} style={[styles.slideContainer, animatedStyle]}>
        <Image
          source={slides[index].image}
          style={styles.slideImage}
          resizeMode="contain"
        />
        <Text style={styles.slideText}>{slides[index].text}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/icons/mosque.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/icons/Islami.png')}
            style={styles.logoText}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        {slides.map((_, index) => renderSlide(index))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        <View style={styles.navigationContainer}>
          {/* Back Button */}
          <TouchableOpacity onPress={handleBack} style={styles.navigationButton}>
            {currentSlide > 0 && <Text style={styles.navigationText}>Back</Text>}
          </TouchableOpacity>

          {/* Dots */}
          <View style={styles.dotsContainer}>
            {slides.map((_, index) => {
              const dotAnimation = useAnimatedStyle(() => {
                const width = interpolate(
                  slideAnimation.value,
                  [index - 1, index, index + 1],
                  [8, 24, 8],
                  Extrapolate.CLAMP
                );

                const opacity = interpolate(
                  slideAnimation.value,
                  [index - 1, index, index + 1],
                  [0.3, 1, 0.3],
                  Extrapolate.CLAMP
                );

                return {
                  width,
                  opacity,
                };
              });

              return (
                <Animated.View key={index} style={[styles.dot, dotAnimation]} />
              );
            })}
          </View>

          {/* Next Button */}
          <TouchableOpacity onPress={handleNext} style={styles.navigationButton}>
            <Text style={styles.navigationText}>
              {currentSlide === slides.length - 1 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 24,
  },
  logoContainer: {
    paddingTop: height * 0.06,
    paddingBottom: height * 0.04,
    alignItems: 'center',
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: width * 0.9,
    height: height * 0.17,
  },
  logoText: {
    position: 'absolute',
    bottom: -3,
    width: width * 0.8,
    height: height * 0.07,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: width * 0.8,
    height: width * 0.8,
  },
  slideText: {
    color: '#D4AF37',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 24,
  },
  bottomContainer: {
    paddingBottom: height * 0.05,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#D4AF37',
  },
  navigationText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '500',
  },
  navigationButton: {
    width: 70,
    alignItems: 'center',
  },
});
