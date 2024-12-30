// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { supabase } from '../configs/SupabaseConfig';
// import { RootStackParamList } from '../navigation/Types';
// import { LinearGradient } from 'expo-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type AuthScreenProps = {
//   navigation: NativeStackNavigationProp<RootStackParamList, 'AuthScreen'>;
// };

// const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // Handle sign-up
//   const handleSignUp = async () => {
//     if (!name || !email || !password) {
//       alert('Please fill in all fields');
//       return;
//     }

//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (error) {
//         if (error.message === 'User already registered') {
//           alert('User already registered. Please log in.');
//           setIsSignUp(false);
//           return;
//         }
//         console.log('Sign-up error:', error);
//         alert(error.message);
//         return;
//       }

//       if (!data || !data.user) {
//         console.log('No user returned after sign-up');
//         alert('Sign-up failed. Please try again later.');
//         return;
//       }

//       const user = data.user;
//       console.log('Sign up successful, user:', user);

//       // Insert user name into the users table after signup
//       const { error: insertError } = await supabase
//         .from('users')
//         .insert([
//           {
//             id: user.id,
//             displayname: name,
//           },
//         ]);

//       if (insertError) {
//         alert(insertError.message);
//         return;
//       }

//       console.log('User inserted into database');

//       // Store user data in AsyncStorage
//       await AsyncStorage.setItem('username', name);
//       await AsyncStorage.setItem('loggedIn', 'true');

//       // Alert the user after successful sign-up
//       Alert.alert('Sign Up Successful!', 'You have successfully signed up.', [
//         {
//           text: 'OK',
//           onPress: () => {
//             setEmail('');
//             setPassword('');
//             setName('');
//             navigation.navigate('AuthScreen');
//           },
//         },
//       ]);
//     } catch (error) {
//       console.log('Unexpected error during sign-up:', error);
//       alert('An unexpected error occurred during sign-up. Please try again.');
//     }
//   };

//   // Handle login
//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert('Please fill in all fields');
//       return;
//     }

//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         alert(error.message);
//         return;
//       }

//       if (!data || !data.user) {
//         alert('Login failed. Please try again.');
//         return;
//       }

//       const user = data.user;
//       console.log('Login successful, user:', user);

//       // Fetch user data to ensure name is stored
//       const { data: userData, error: fetchError } = await supabase
//         .from('users')
//         .select('displayname')
//         .eq('id', user.id)
//         .single();

//       if (fetchError) {
//         alert(fetchError.message);
//         return;
//       }

//       const storedName = userData?.displayname || email; // Use email as fallback if name is not available

//       console.log('User data fetched:', userData);

//       // Store user data in AsyncStorage
//       await AsyncStorage.setItem('username', storedName);
//       await AsyncStorage.setItem('loggedIn', 'true');

//       alert('Login successful!');
//       setEmail('');
//       setPassword('');

//       // Navigate to FirstScreen with the user's name
//       navigation.navigate('FirstScreen', { isLoggedIn: true, name: storedName });
//     } catch (error) {
//       console.log('Unexpected error during login:', error);
//       alert('An unexpected error occurred during login. Please try again.');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#1a1a1a', '#D4AF37']}
//         style={styles.gradientBackground}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//       >
//         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
//           <ScrollView contentContainerStyle={styles.scrollViewContent}>
//             <View style={styles.innerContainer}>
//               <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>

//               {isSignUp ? (
//                 <>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Name"
//                     placeholderTextColor="#8e7a2b"
//                     value={name}
//                     onChangeText={setName}
//                     autoCapitalize="words"
//                   />
//                 </>
//               ) : null}

//               <TextInput
//                 style={styles.input}
//                 placeholder="Email"
//                 placeholderTextColor="#8e7a2b"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 placeholderTextColor="#8e7a2b"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry
//               />

//               {isSignUp ? (
//                 <TouchableOpacity style={styles.button} onPress={handleSignUp}>
//                   <Text style={styles.buttonText}>Sign Up</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity style={styles.button} onPress={handleLogin}>
//                   <Text style={styles.buttonText}>Login</Text>
//                 </TouchableOpacity>
//               )}

//               <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
//                 <Text style={styles.linkText}>
//                   {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   gradientBackground: { flex: 1, justifyContent: 'center' },
//   keyboardAvoidingView: { flex: 1 },
//   scrollViewContent: { flexGrow: 1 },
//   innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   title: { fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 40 },
//   input: {
//     width: '100%',
//     height: 50,
//     borderColor: '#D4AF37',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//     fontSize: 16,
//     color: '#D4AF37',
//     backgroundColor: '#1a1a1a',
//   },
//   button: { width: '100%', height: 50, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginBottom: 20 },
//   buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
//   linkText: { color: '#D4AF37', fontSize: 16, marginTop: 10 },
// });

// export default AuthScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../configs/SupabaseConfig';
import { RootStackParamList } from '../navigation/Types';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

type AuthScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AuthScreen'>;
};

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  // Handle sign-up
  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message === 'User already registered') {
          alert('User already registered. Please log in.');
          setIsSignUp(false);
          return;
        }
        console.log('Sign-up error:', error);
        alert(error.message);
        return;
      }

      if (!data || !data.user) {
        console.log('No user returned after sign-up');
        alert('Sign-up failed. Please try again later.');
        return;
      }

      const user = data.user;
      console.log('Sign up successful, user:', user);

      // Insert user name into the users table after signup
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            displayname: name,
          },
        ]);

      if (insertError) {
        alert(insertError.message);
        return;
      }

      console.log('User inserted into database');

      // Store user data in AsyncStorage
      await AsyncStorage.setItem('username', name);
      await AsyncStorage.setItem('loggedIn', 'true');

      // Use context to login
      login(user.id);

      // Alert the user after successful sign-up
      Alert.alert('Sign Up Successful!', 'You have successfully signed up.', [
        {
          text: 'OK',
          onPress: () => {
            setEmail('');
            setPassword('');
            setName('');
            navigation.navigate('AuthScreen');
          },
        },
      ]);
    } catch (error) {
      console.log('Unexpected error during sign-up:', error);
      alert('An unexpected error occurred during sign-up. Please try again.');
    }
  };

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data || !data.user) {
        alert('Login failed. Please try again.');
        return;
      }

      const user = data.user;
      console.log('Login successful, user:', user);

      // Fetch user data to ensure name is stored
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('displayname')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        alert(fetchError.message);
        return;
      }

      const storedName = userData?.displayname || email; // Use email as fallback if name is not available

      console.log('User data fetched:', userData);

      // Store user data in AsyncStorage
      await AsyncStorage.setItem('username', storedName);
      await AsyncStorage.setItem('loggedIn', 'true');

      // Use context to login
      login(user.id);

      alert('Login successful!');
      setEmail('');
      setPassword('');

      // Navigate to FirstScreen with the user's name
      navigation.navigate('FirstScreen');
    } catch (error) {
      console.log('Unexpected error during login:', error);
      alert('An unexpected error occurred during login. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#D4AF37']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.innerContainer}>
              <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>

              {isSignUp ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#8e7a2b"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#8e7a2b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8e7a2b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {isSignUp ? (
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.linkText}>
                  {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradientBackground: { flex: 1, justifyContent: 'center' },
  keyboardAvoidingView: { flex: 1 },
  scrollViewContent: { flexGrow: 1 },
  innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 40 },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#D4AF37',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#D4AF37',
    backgroundColor: '#1a1a1a',
  },
  button: { width: '100%', height: 50, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginBottom: 20 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#D4AF37', fontSize: 16, marginTop: 10 },
});

export default AuthScreen;