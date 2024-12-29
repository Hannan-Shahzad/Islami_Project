import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Correct import
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import StartScreen from '../screens/StartScreen';
import { OnboardingCarousel } from '../screens/OnBoardingCarousel';
import HomeScreen from '../screens/HomeScreen';

// Create a stack navigator
const Stack = createNativeStackNavigator();

// Example slides for Onboarding Carousel
const slides = [
  {
    image: require('../../assets/icons/ayah.png'),
    text: 'Welcome to Islami',
  },
  {
    image: require('../../assets/icons/kabba.png'),
    text: 'Discover Islamic Content',
  },
  {
    image: require('../../assets/icons/quran.png'),
    text: 'Track Your Progress',
  },
  {
    image: require('../../assets/icons/hand.png'),
    text: 'Join Our Community',
  },
];

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="Onboarding">
          {({ navigation }) => (
            <OnboardingCarousel
              slides={slides}
              onComplete={() => {
                // Navigate to the next screen (HomeScreen)
                navigation.navigate('HomeScreen'); // Make sure HomeScreen is added in navigator
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
