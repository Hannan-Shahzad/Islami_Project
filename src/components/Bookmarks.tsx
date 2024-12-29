import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';
import SurahList from './SurahList';

interface BookmarksProps {
  onSurahPress: (surahNumber: number) => void;
}

interface Surah {
  surahNo: number;
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
}

const Bookmarks: React.FC<BookmarksProps> = ({ onSurahPress }) => {
  const [bookmarks, setBookmarks] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    try {
      const bookmarksList = await AsyncStorage.getItem('bookmarks');
      if (bookmarksList) {
        const numbers = JSON.parse(bookmarksList);
        const surahsData = await Promise.all(
          numbers.map(async (num: number) => {
            const response = await fetch(`https://quranapi.pages.dev/api/${num}.json`);
            return response.json();
          })
        );
        setBookmarks(surahsData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    loadBookmarks();
  }, [loadBookmarks]);

  const handleSurahPress = useCallback((index: number) => {
    onSurahPress(bookmarks[index].surahNo);
  }, [bookmarks, onSurahPress]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SurahList
        surahs={bookmarks}
        onSurahPress={handleSurahPress}
        onRefresh={handleRefresh}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default Bookmarks;

