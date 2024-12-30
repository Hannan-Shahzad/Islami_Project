// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Dimensions,
//   Alert,
// } from "react-native";
// import { ArrowLeft, Play, Pause, Bookmark, Globe } from "lucide-react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Audio } from "expo-av";
// import colors from "../constants/colors";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../navigation/Types";

// const { width, height } = Dimensions.get("window");

// type SurahDetailScreenProps = NativeStackScreenProps<
//   RootStackParamList,
//   "SurahDetail"
// >;

// interface Ayah {
//   surahNo: number;
//   ayahNo: number;
//   arabic1: string;
//   arabic2: string;
//   english: string;
//   audio: {
//     [key: string]: {
//       reciter: string;
//       url: string;
//     };
//   };
// }

// const SurahDetail = ({ route, navigation }: SurahDetailScreenProps) => {
//   const [surahData, setSurahData] = useState<{
//     surahName: string;
//     surahNameArabic: string;
//     verses: Ayah[];
//   } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [showTranslation, setShowTranslation] = useState(false);
//   const [sound, setSound] = useState<Audio.Sound | null>(null);
//   const [audioLoading, setAudioLoading] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);

//   const { surahNumber } = route.params;

//   useEffect(() => {
//     checkUserSession();
//     fetchSurahData();
//     if (userId) {
//       checkBookmarkStatus();
//       addToRecent();
//     }

//     return () => {
//       if (sound) {
//         sound.unloadAsync();
//       }
//     };
//   }, [surahNumber, userId]);

//   const checkUserSession = async () => {
//     try {
//       const userSession = await AsyncStorage.getItem('userSession');
//       setUserId(userSession);
//     } catch (error) {
//       console.error("Error checking user session:", error);
//     }
//   };

//   const fetchSurahData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`https://quranapi.pages.dev/api/${surahNumber}.json`);
      
//       if (!response.ok) {
//         throw new Error(`API error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       setSurahData({
//         surahName: data.surahName,
//         surahNameArabic: data.surahNameArabic,
//         verses: data.arabic1.map((ayah: string, index: number) => ({
//           surahNo: data.surahNo,
//           ayahNo: index + 1,
//           arabic1: ayah,
//           arabic2: data.arabic2[index],
//           english: data.english[index] || '',
//           audio: data.audio?.[index + 1] || {},
//         })),
//       });
//     } catch (error) {
//       console.error("Error fetching surah data:", error);
//       Alert.alert(
//         "Error",
//         "Failed to load surah data. Please check your internet connection and try again.",
//         [{ text: "OK", onPress: () => navigation.goBack() }]
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleAudio = async () => {
//     try {
//       if (audioLoading) return;

//       if (!sound) {
//         setAudioLoading(true);
//         const { sound: newSound } = await Audio.Sound.createAsync(
//           { uri: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3` },
//           { shouldPlay: true }
//         );

//         setSound(newSound);
//         setIsPlaying(true);

//         newSound.setOnPlaybackStatusUpdate((status: any) => {
//           if (status.didJustFinish) {
//             setIsPlaying(false);
//           }
//         });
//       } else {
//         if (isPlaying) {
//           await sound.pauseAsync();
//         } else {
//           await sound.playAsync();
//         }
//         setIsPlaying(!isPlaying);
//       }
//     } catch (error) {
//       console.error("Error playing audio:", error);
//       Alert.alert("Error", "Failed to play audio. Please try again.");
//     } finally {
//       setAudioLoading(false);
//     }
//   };

//   const toggleBookmark = async () => {
//     if (!userId) {
//       Alert.alert("Login Required", "Please login to bookmark surahs.");
//       return;
//     }

//     try {
//       const bookmarks = await AsyncStorage.getItem(`bookmarks_${userId}`);
//       let bookmarksList = bookmarks ? JSON.parse(bookmarks) : [];

//       if (isBookmarked) {
//         bookmarksList = bookmarksList.filter((b: number) => b !== surahNumber);
//       } else {
//         bookmarksList.push(surahNumber);
//       }

//       await AsyncStorage.setItem(`bookmarks_${userId}`, JSON.stringify(bookmarksList));
//       setIsBookmarked(!isBookmarked);
//     } catch (error) {
//       console.error("Error toggling bookmark:", error);
//     }
//   };

//   const checkBookmarkStatus = async () => {
//     if (!userId) return;

//     try {
//       const bookmarks = await AsyncStorage.getItem(`bookmarks_${userId}`);
//       if (bookmarks) {
//         const bookmarksList = JSON.parse(bookmarks);
//         setIsBookmarked(bookmarksList.includes(surahNumber));
//       }
//     } catch (error) {
//       console.error("Error checking bookmark status:", error);
//     }
//   };

//   const addToRecent = async () => {
//     if (!userId) return;

//     try {
//       const recents = await AsyncStorage.getItem(`recents_${userId}`);
//       let recentsList = recents ? JSON.parse(recents) : [];

//       recentsList = recentsList.filter((r: number) => r !== surahNumber);
//       recentsList.unshift(surahNumber);

//       if (recentsList.length > 10) {
//         recentsList = recentsList.slice(0, 10);
//       }

//       await AsyncStorage.setItem(`recents_${userId}`, JSON.stringify(recentsList));
//     } catch (error) {
//       console.error("Error adding to recents:", error);
//     }
//   };

//   if (loading || !surahData) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.gold} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <ArrowLeft stroke={colors.gold} size={24} />
//         </TouchableOpacity>
//         <View style={styles.titleContainer}>
//           <Text style={styles.titleEnglish}>{surahData?.surahName}</Text>
//           <Text style={styles.titleArabic}>{surahData?.surahNameArabic}</Text>
//         </View>
//         <View style={styles.headerRight}>
//           <TouchableOpacity
//             onPress={() => setShowTranslation(!showTranslation)}
//             style={styles.iconButton}
//           >
//             <Globe stroke={showTranslation ? colors.gold : "#666"} size={24} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={toggleAudio}
//             style={styles.iconButton}
//             disabled={audioLoading}
//           >
//             {audioLoading ? (
//               <ActivityIndicator color={colors.gold} size="small" />
//             ) : isPlaying ? (
//               <Pause stroke={colors.gold} size={24} />
//             ) : (
//               <Play stroke={colors.gold} size={24} />
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity onPress={toggleBookmark} style={styles.iconButton}>
//             <Bookmark
//               stroke={colors.gold}
//               size={24}
//               fill={isBookmarked ? colors.gold : "none"}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <Image
//         source={require("../../assets/icons/left.png")}
//         style={[styles.cornerPattern, styles.topLeftPattern]}
//       />
//       <Image
//         source={require("../../assets/icons/right.png")}
//         style={[styles.cornerPattern, styles.topRightPattern]}
//       />

//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {surahData?.verses?.map((ayah: Ayah, index: number) => (
//           <View key={index} style={styles.ayahContainer}>
//             <View style={styles.ayahHeader}>
//               <Text style={styles.ayahNumber}>[{index + 1}]</Text>
//             </View>
//             <Text style={styles.ayahText}>{ayah.arabic1}</Text>
//             {showTranslation && ayah.english && (
//               <Text style={styles.translationText}>{ayah.english}</Text>
//             )}
//           </View>
//         ))}
//         <View style={styles.bottomSpacing} />
//       </ScrollView>

//       <View style={styles.bottomMosqueContainer}>
//         <Image
//           source={require("../../assets/icons/bottom.png")}
//           style={styles.bottomMosque}
//           resizeMode="contain"
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingTop: 40,
//     paddingBottom: 20,
//     backgroundColor: "rgba(0, 0, 0, 0.8)",
//   },
//   backButton: {
//     padding: 8,
//   },
//   titleContainer: {
//     flex: 1,
//     alignItems: "center",
//   },
//   titleEnglish: {
//     color: colors.gold,
//     fontSize: 20,
//     fontWeight: "600",
//   },
//   titleArabic: {
//     color: colors.gold,
//     fontSize: 24,
//     marginTop: 4,
//     fontFamily: "Arial",
//   },
//   headerRight: {
//     flexDirection: "row",
//     gap: 15,
//   },
//   iconButton: {
//     padding: 8,
//   },
//   cornerPattern: {
//     position: "absolute",
//     width: width * 0.15,
//     height: width * 0.15,
//     tintColor: colors.gold,
//     opacity: 1,
//   },
//   topLeftPattern: {
//     top: 100,
//     left: 20,
//   },
//   topRightPattern: {
//     top: 100,
//     right: 20,
//     // transform: [{ scaleX: -1 }],
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingTop: 20,
//     paddingBottom: 120,
//   },
//   ayahContainer: {
//     marginHorizontal: 20,
//     marginVertical: 10,
//     padding: 15,
//     backgroundColor: "rgba(255, 255, 255, 0.03)",
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: colors.gold + "40",
//   },
//   ayahHeader: {
//     marginBottom: 12,
//   },
//   ayahNumber: {
//     color: colors.gold,
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   ayahText: {
//     color: colors.gold,
//     fontSize: 24,
//     textAlign: "right",
//     lineHeight: 45,
//     fontFamily: "Arial",
//   },
//   translationText: {
//     color: "#BBB",
//     fontSize: 16,
//     lineHeight: 24,
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopColor: colors.gold + "20",
//     borderTopWidth: 1,
//   },
//   bottomMosqueContainer: {
//     position: "absolute",
//     bottom: 0,
//     width: width,
//     height: 100,
//     // backgroundColor: "black",
//     justifyContent: "flex-end",
//   },
//   bottomMosque: {
//     width: width,
//     height: 100,
//     tintColor: colors.gold,
//     opacity: 1,
//   },
//   bottomSpacing: {
//     height: 100,
//   },
// });

// export default SurahDetail;





import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { ArrowLeft, Play, Pause, Bookmark, Globe } from "lucide-react-native";
import { Audio } from "expo-av";
import colors from "../constants/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/Types";
import { useBookmarks } from "../contexts/BookmarkContext";

const { width, height } = Dimensions.get("window");

type SurahDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SurahDetail"
>;

interface Ayah {
  surahNo: number;
  ayahNo: number;
  arabic1: string;
  arabic2: string;
  english: string;
  audio: {
    [key: string]: {
      reciter: string;
      url: string;
    };
  };
}

const SurahDetail = ({ route, navigation }: SurahDetailScreenProps) => {
  const [surahData, setSurahData] = useState<{
    surahName: string;
    surahNameArabic: string;
    verses: Ayah[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const { bookmarks, addBookmark, removeBookmark, addToRecent } = useBookmarks();

  const { surahNumber } = route.params;

  useEffect(() => {
    fetchSurahData();
    addToRecent(surahNumber);

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [surahNumber]);

  const fetchSurahData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://quranapi.pages.dev/api/${surahNumber}.json`);
      
      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const data = await response.json();

      setSurahData({
        surahName: data.surahName,
        surahNameArabic: data.surahNameArabic,
        verses: data.arabic1.map((ayah: string, index: number) => ({
          surahNo: data.surahNo,
          ayahNo: index + 1,
          arabic1: ayah,
          arabic2: data.arabic2[index],
          english: data.english[index] || '',
          audio: data.audio?.[index + 1] || {},
        })),
      });
    } catch (error) {
      console.error("Error fetching surah data:", error);
      Alert.alert(
        "Error",
        "Failed to load surah data. Please check your internet connection and try again.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = async () => {
    try {
      if (audioLoading) return;

      if (!sound) {
        setAudioLoading(true);
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3` },
          { shouldPlay: true }
        );

        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } else {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Failed to play audio. Please try again.");
    } finally {
      setAudioLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (bookmarks.includes(surahNumber)) {
      removeBookmark(surahNumber);
    } else {
      addBookmark(surahNumber);
    }
  };

  if (loading || !surahData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft stroke={colors.gold} size={24} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleEnglish}>{surahData?.surahName}</Text>
          <Text style={styles.titleArabic}>{surahData?.surahNameArabic}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setShowTranslation(!showTranslation)}
            style={styles.iconButton}
          >
            <Globe stroke={showTranslation ? colors.gold : "#666"} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleAudio}
            style={styles.iconButton}
            disabled={audioLoading}
          >
            {audioLoading ? (
              <ActivityIndicator color={colors.gold} size="small" />
            ) : isPlaying ? (
              <Pause stroke={colors.gold} size={24} />
            ) : (
              <Play stroke={colors.gold} size={24} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleBookmark} style={styles.iconButton}>
            <Bookmark
              stroke={colors.gold}
              size={24}
              fill={bookmarks.includes(surahNumber) ? colors.gold : "none"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={require("../../assets/icons/left.png")}
        style={[styles.cornerPattern, styles.topLeftPattern]}
      />
      <Image
        source={require("../../assets/icons/right.png")}
        style={[styles.cornerPattern, styles.topRightPattern]}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {surahData?.verses?.map((ayah: Ayah, index: number) => (
          <View key={index} style={styles.ayahContainer}>
            <View style={styles.ayahHeader}>
              <Text style={styles.ayahNumber}>[{index + 1}]</Text>
            </View>
            <Text style={styles.ayahText}>{ayah.arabic1}</Text>
            {showTranslation && ayah.english && (
              <Text style={styles.translationText}>{ayah.english}</Text>
            )}
          </View>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.bottomMosqueContainer}>
        <Image
          source={require("../../assets/icons/bottom.png")}
          style={styles.bottomMosque}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  titleEnglish: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: "600",
  },
  titleArabic: {
    color: colors.gold,
    fontSize: 24,
    marginTop: 4,
    fontFamily: "Arial",
  },
  headerRight: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    padding: 8,
  },
  cornerPattern: {
    position: "absolute",
    width: width * 0.15,
    height: width * 0.15,
    tintColor: colors.gold,
    opacity: 1,
  },
  topLeftPattern: {
    top: 100,
    left: 20,
  },
  topRightPattern: {
    top: 100,
    right: 20,
    // transform: [{ scaleX: -1 }],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 120,
  },
  ayahContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.gold + "40",
  },
  ayahHeader: {
    marginBottom: 12,
  },
  ayahNumber: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: "600",
  },
  ayahText: {
    color: colors.gold,
    fontSize: 24,
    textAlign: "right",
    lineHeight: 45,
    fontFamily: "Arial",
  },
  translationText: {
    color: "#BBB",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    paddingTop: 12,
    borderTopColor: colors.gold + "20",
    borderTopWidth: 1,
  },
  bottomMosqueContainer: {
    position: "absolute",
    bottom: 0,
    width: width,
    height: 100,
    // backgroundColor: "black",
    justifyContent: "flex-end",
  },
  bottomMosque: {
    width: width,
    height: 100,
    tintColor: colors.gold,
    opacity: 1,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default SurahDetail;