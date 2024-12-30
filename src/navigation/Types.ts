export type RootStackParamList = {
  StartScreen: undefined;
  Onboarding: undefined;
  HomeScreen: undefined;
  SurahDetail: {
    surahNumber: number;
  };
  TasbeehCounter: undefined;
  Mosques: undefined;
  PrayerTimesScreen: undefined;
  AzkarAlSabah: undefined;
  AzkarAlMasah: undefined;
  PostPrayerAzkar: undefined;
  Categories: undefined;
  Hadeeths: { categoryId: number };
  HadeethDetail: { id: number };
  // FirstScreen: { isLoggedIn: boolean; name: string };
  FirstScreen: undefined;
  SunnahScreen: undefined;
  QiblaScreen: undefined;
  ContactScreen: undefined;
  AuthScreen: undefined;
  BookmarkScreen: undefined;
};