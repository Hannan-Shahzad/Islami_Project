import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import axios from 'axios';

// Import colors from your constants
const COLORS = {
  primary: '#000000',    // Black
  secondary: '#FFD700',  // Gold
  text: '#FFFFFF',       // White
  textSecondary: '#FFD700', // Gold for secondary text
  background: '#121212', // Dark background
  card: '#1E1E1E',      // Slightly lighter black for cards
};

interface HadeethDetailProps {
  id: string;
}

interface Hadeeth {
  title: string;
  hadeeth: string;
  attribution: string;
  grade: string;
  explanation: string;
  hints: string[];
  categories: string[];
  translations: string[];
  hadeeth_intro: string;
  reference: string;
}

interface Styles {
  container: ViewStyle;
  loadingContainer: ViewStyle;
  errorContainer: ViewStyle;
  contentContainer: ViewStyle;
  languageSelector: ViewStyle;
  languageButton: ViewStyle;
  activeLanguageButton: ViewStyle;
  languageButtonText: TextStyle;
  activeLanguageButtonText: TextStyle;
  title: TextStyle;
  hadeethCard: ViewStyle;
  hadeeth: TextStyle;
  attribution: TextStyle;
  gradeContainer: ViewStyle;
  grade: TextStyle;
  sectionCard: ViewStyle;
  sectionTitle: TextStyle;
  sectionText: TextStyle;
  hintText: TextStyle;
  errorText: TextStyle;
}

const BASE_URL = 'https://hadeethenc.com/api/v1';

const fetchHadeethDetails = async (hadeethId: string, language: string = 'en'): Promise<Hadeeth> => {
  try {
    const response = await axios.get(`${BASE_URL}/hadeeths/one/?language=${language}&id=${hadeethId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Hadeeth details');
  }
};

const HadeethDetail: React.FC<HadeethDetailProps> = ({ id }) => {
  const [hadeethData, setHadeethData] = useState<Hadeeth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const getHadeethDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchHadeethDetails(id, language);
        setHadeethData(data);
      } catch (err) {
        setError((err as Error).message);
        Alert.alert('Error', 'Failed to fetch Hadeeth details');
      } finally {
        setLoading(false);
      }
    };

    getHadeethDetails();
  }, [id, language]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!hadeethData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.languageSelector}>
        {['en', 'ar', 'ur'].map((lang) => (
          <TouchableOpacity
            key={lang}
            onPress={() => setLanguage(lang)}
            style={[
              styles.languageButton,
              language === lang && styles.activeLanguageButton,
            ]}
          >
            <Text style={[
              styles.languageButtonText,
              language === lang && styles.activeLanguageButtonText
            ]}>
              {lang === 'en' ? 'English' : lang === 'ar' ? 'Arabic' : 'Urdu'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{hadeethData.title}</Text>
        
        <View style={styles.hadeethCard}>
          <Text style={styles.hadeeth}>{hadeethData.hadeeth}</Text>
          <Text style={styles.attribution}>{hadeethData.attribution}</Text>
          <View style={styles.gradeContainer}>
            <Text style={styles.grade}>Grade: {hadeethData.grade}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Explanation</Text>
          <Text style={styles.sectionText}>{hadeethData.explanation}</Text>
        </View>

        {hadeethData.hints.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Hints</Text>
            {hadeethData.hints.map((hint, index) => (
              <Text key={index} style={styles.hintText}>• {hint}</Text>
            ))}
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.sectionText}>{hadeethData.categories.join(', ')}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Reference</Text>
          <Text style={styles.sectionText}>{hadeethData.reference}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  contentContainer: {
    padding: 16,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    marginTop: 36,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  activeLanguageButton: {
    backgroundColor: COLORS.secondary,
  },
  languageButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  activeLanguageButtonText: {
    color: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginVertical: 16,
    textAlign: 'center',
  },
  hadeethCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  hadeeth: {
    fontSize: 18,
    color: COLORS.text,
    lineHeight: 28,
    marginBottom: 16,
  },
  attribution: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  gradeContainer: {
    backgroundColor: COLORS.secondary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  grade: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  hintText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default HadeethDetail;