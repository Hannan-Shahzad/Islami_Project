
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BookmarksContextType {
  bookmarks: number[];
  recents: number[];
  addBookmark: (surahNumber: number) => void;
  removeBookmark: (surahNumber: number) => void;
  addToRecent: (surahNumber: number) => void;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

interface BookmarksProviderProps {
  children: ReactNode;
}

export const BookmarksProvider: React.FC<BookmarksProviderProps> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [recents, setRecents] = useState<number[]>([]);

  useEffect(() => {
    loadBookmarks();
    loadRecents();
  }, []);

  const loadBookmarks = async () => {
    const storedBookmarks = await AsyncStorage.getItem('bookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  };

  const loadRecents = async () => {
    const storedRecents = await AsyncStorage.getItem('recents');
    if (storedRecents) {
      setRecents(JSON.parse(storedRecents));
    }
  };

  const addBookmark = async (surahNumber: number) => {
    const updatedBookmarks = [...bookmarks, surahNumber];
    setBookmarks(updatedBookmarks);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const removeBookmark = async (surahNumber: number) => {
    const updatedBookmarks = bookmarks.filter(b => b !== surahNumber);
    setBookmarks(updatedBookmarks);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const addToRecent = async (surahNumber: number) => {
    let updatedRecents = [surahNumber, ...recents.filter(r => r !== surahNumber)];
    if (updatedRecents.length > 10) {
      updatedRecents = updatedRecents.slice(0, 10);
    }
    setRecents(updatedRecents);
    await AsyncStorage.setItem('recents', JSON.stringify(updatedRecents));
  };

  return (
    <BookmarksContext.Provider value={{ bookmarks, recents, addBookmark, removeBookmark, addToRecent }}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = (): BookmarksContextType => {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};
