import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import colors from '../constants/colors';

const BookmarksScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bookmarks, removeBookmark } = useBookmarks();

  const handleRemoveBookmark = (surahNumber: number) => {
    Alert.alert(
      "Remove Bookmark",
      "Are you sure you want to remove this bookmark?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => removeBookmark(surahNumber) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft stroke={colors.gold} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Bookmarks</Text>
      </View>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookmarkItem}>
            <Text style={styles.bookmarkText}>Surah {item}</Text>
            <TouchableOpacity onPress={() => handleRemoveBookmark(item)}>
              <Trash2 stroke={colors.gold} size={24} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No bookmarks available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 20,
  },
  bookmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold + '40',
  },
  bookmarkText: {
    color: colors.gold,
    fontSize: 18,
  },
  emptyText: {
    color: '#BBB',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BookmarksScreen;