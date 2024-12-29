// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { supabase } from '../supabaseClient'; // Import Supabase client
// import { RootStackParamList } from '../type'; // Adjust the path to your type definition file

// type SignUpScreenProps = {
//   navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
// };

// const SignUp: React.FC<SignUpScreenProps> = ({ navigation }) => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSignUp = async () => {
//     if (!username || !email || !password) {
//       alert('Please fill in all fields');
//       return;
//     }

//     // Sign up user with email and password using Supabase auth
//     const { user, error }:any = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: { username }, // Store additional data like username
//       },
//     });

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     alert('Sign up successful! Please check your email for verification.');
//     navigation.navigate('Login');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
//         <ScrollView contentContainerStyle={styles.scrollViewContent}>
//           <View style={styles.innerContainer}>
//             <Text style={styles.title}>Sign Up</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Username"
//               placeholderTextColor="#8e7a2b"
//               value={username}
//               onChangeText={setUsername}
//               autoCapitalize="none"
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               placeholderTextColor="#8e7a2b"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor="#8e7a2b"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//             />
//             <TouchableOpacity style={styles.button} onPress={handleSignUp}>
//               <Text style={styles.buttonText}>Sign Up</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//               <Text style={styles.linkText}>Already have an account? Login</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   keyboardAvoidingView: { flex: 1 },
//   scrollViewContent: { flexGrow: 1 },
//   innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   title: { fontSize: 32, fontWeight: 'bold', color: '#D4AF37', marginBottom: 40 },
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
//   linkText: { color: '#D4AF37', fontSize: 16 },
// });

// export default SignUp;

import { View, Text } from 'react-native'
import React from 'react'

export default function SignUp() {
  return (
    <View>
      <Text>SignUp</Text>
    </View>
  )
}