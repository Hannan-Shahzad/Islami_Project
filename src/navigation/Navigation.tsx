import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './Types';

// Import screens
import StartScreen from '../screens/StartScreen';
import { OnboardingCarousel } from '../screens/OnBoardingCarousel';
import SurahDetail from '../screens/SurahDetail';
import TasbeehCounter from '../screens/TasbeehCounter';
import NearbyMosquesScreen from '../screens/Mosques';
import PrayTimesScreen from '../screens/PrayerTimesScreen';
import AzkarAlSabah from '../screens/AzkarAlSabah';
import AzkarAlMasah from '../screens/AzkarAlMasah';
import PostPrayerAzkarScreen from '../screens/PostPrayerAzkar';
import CategoryScreen from '../screens/CategoryScreen';
import HadeethScreen from '../screens/HadeethScreen';
import HadeethDetail from '../screens/HadeethDetailScreen';
import HomeScreen from '../screens/HomeScreen';
import FirstScreen from '../screens/FirstScreen';
import QiblaScreen from '../screens/QiblaScreen';
import ContactScreen from '../screens/ContactScreen';
import SunnahScreen from '../screens/SunnahScreen';
import AuthScreen from '../screens/AuthScreen';
import BookmarksScreen from '../screens/BookmarkScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="Onboarding">
          {({ navigation }) => (
            <OnboardingCarousel
              slides={slides}
              onComplete={() => {
                // Navigate to the next screen (HomeScreen)
                navigation.navigate('FirstScreen'); // Ensure HomeScreen is registered
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SurahDetail" component={SurahDetail} />
        <Stack.Screen name="TasbeehCounter" component={TasbeehCounter} />
        <Stack.Screen name="Mosques" component={NearbyMosquesScreen} />
        <Stack.Screen name="PrayerTimesScreen" component={PrayTimesScreen} />
        <Stack.Screen name="AzkarAlSabah" component={AzkarAlSabah} />
        <Stack.Screen name="AzkarAlMasah" component={AzkarAlMasah} />
        <Stack.Screen name="PostPrayerAzkar" component={PostPrayerAzkarScreen} />
        <Stack.Screen name="Categories" component={CategoryScreen} />
        <Stack.Screen name="Hadeeths" component={HadeethScreen} />
        <Stack.Screen name="HadeethDetail">
          {({ route }) => <HadeethDetail id={route.params.id.toString()} />}
        </Stack.Screen>
        <Stack.Screen 
        name="FirstScreen" 
        component={FirstScreen}
        options={{ headerShown: false }} // Since we have our own header
      />
      <Stack.Screen name="QiblaScreen" component={QiblaScreen} />
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
      <Stack.Screen name="SunnahScreen" component={SunnahScreen} />
      <Stack.Screen name="BookmarkScreen" component={BookmarksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
