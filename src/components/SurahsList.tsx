import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Image,
} from 'react-native';
import colors from '../constants/colors';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

interface Surah {
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
}

// Separate components for better performance
const NumberDisplay = memo(({ index }: { index: number }) => {
  const formattedNumber = (index + 1).toString().padStart(2, '0');
  return (
    <View style={styles.numberContainer}>
      <Image
        source={require('../../assets/icons/surahNum.png')}
        style={styles.numberImage}
      />
      <Text style={styles.numberText}>{formattedNumber}</Text>
    </View>
  );
});

const LeftContent = memo(({ name, verses }: { name: string; verses: number }) => (
  <View style={styles.leftContent}>
    <Text style={styles.surahName}>{name}</Text>
    <Text style={styles.versesCount}>{verses} Verses</Text>
  </View>
));

const ArabicNames = memo(({ nameArabic, nameLong }: { nameArabic: string; nameLong: string }) => (
  <View style={styles.arabicContainer}>
    <Text style={styles.arabicName}>{nameArabic}</Text>
    <Text style={styles.arabicNameLong}>{nameLong}</Text>
  </View>
));

// Main item component with pure render logic
const SurahItem = memo(({ item, index }: { item: Surah; index: number }) => {
  return (
    <View style={styles.surahContainer}>
      <NumberDisplay index={index} />
      <View style={styles.detailsContainer}>
        <LeftContent name={item.surahName} verses={item.totalAyah} />
        <ArabicNames 
          nameArabic={item.surahNameArabic} 
          nameLong={item.surahNameArabicLong} 
        />
      </View>
      <View style={styles.separator} />
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.item.surahName === nextProps.item.surahName &&
         prevProps.index === nextProps.index;
});

const LoadingView = memo(() => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.gold} />
  </View>
));

const Footer = memo(({ showLoader }: { showLoader: boolean }) => (
  <>
    {showLoader && <ActivityIndicator size="large" color={colors.gold} />}
    <View style={styles.footer} />
  </>
));

const SurahList = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);

  const itemsPerPage = 5;

  const [fontsLoaded] = useFonts({
    Janna: require('../../assets/fonts/Janna.ttf'),
  });

  const fetchSurahs = useCallback(async () => {
    try {
      const response = await fetch('https://quranapi.pages.dev/api/surah.json');
      const data = await response.json();
      setSurahs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surahs:', error);
      setLoading(false);
    }
  }, []);

  const refreshSurahs = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch('https://quranapi.pages.dev/api/surah.json');
      const data = await response.json();
      setSurahs(data);
      setPage(0);
    } catch (error) {
      console.error('Error refreshing surahs:', error);
    }
    setRefreshing(false);
  }, []);

  const loadMoreSurahs = useCallback(() => {
    if ((page + 1) * itemsPerPage < surahs.length) {
      setPage(p => p + 1);
    }
  }, [page, surahs.length]);

  const renderItem = useCallback(({ item, index }: { item: Surah; index: number }) => (
    <SurahItem item={item} index={index} />
  ), []);

  const keyExtractor = useCallback((item: Surah, index: number) => `surah-${index}`, []);

  const visibleData = useMemo(() => 
    surahs.slice(0, (page + 1) * itemsPerPage),
    [surahs, page, itemsPerPage]
  );

  const showLoader = useMemo(() => 
    (page + 1) * itemsPerPage < surahs.length,
    [page, surahs.length]
  );

  useEffect(() => {
    fetchSurahs();
  }, [fetchSurahs]);

  if (!fontsLoaded || loading) {
    return <LoadingView />;
  }

  return (
    <>
    <Text style={styles.HeadingText} >Surahs List</Text>
    <FlatList
          data={visibleData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={loadMoreSurahs}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshSurahs} />}
          ListFooterComponent={<Footer showLoader={showLoader} />}
          style={styles.container}
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          updateCellsBatchingPeriod={75}
          initialNumToRender={5}
          windowSize={3}
          getItemLayout={(data, index) => ({
              length: 100, // Fixed height for each item
              offset: 100 * index,
              index,
          })} /></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  HeadingText:{
    fontSize: 17,
    // fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginTop: 10,
    marginLeft: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  surahContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: width,
    height: 100, // Fixed height for better performance
  },
  numberContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 50,
    height: 50,
  },
  numberImage: {
    width: 50,
    height: 50,
  },
  numberText: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
  },
  leftContent: {
    flex: 1,
  },
  surahName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  versesCount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  arabicContainer: {
    alignItems: 'flex-end',
    paddingRight: 20,
    // minHeight: 70,
  },
  arabicName: {
    color: '#fff',
    fontFamily: 'Janna',
    fontSize: 25,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  arabicNameLong: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Janna',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 4,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 80,
    right: 80,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  footer: {
    height: 60,
  },
});

export default memo(SurahList);