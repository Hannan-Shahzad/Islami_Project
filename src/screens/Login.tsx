// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { supabase } from '../configs/SupabaseConfig'; // Import Supabase client
// import { RootStackParamList } from '../navigation/Types'; // Adjust the path to your type definition file

// // type LoginScreenProps = {
// //   navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
// // };

// const Login: React.FC<LoginScreenProps> = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert('Please fill in all fields');
//       return;
//     }

//     const { user, error }:any = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     if (user) {
//       alert('Login successful!');
//       // Navigate to the home screen or other screen
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
//         <View style={styles.innerContainer}>
//           <Text style={styles.title}>Login</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             placeholderTextColor="#8e7a2b"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             placeholderTextColor="#8e7a2b"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />
//           <TouchableOpacity style={styles.button} onPress={handleLogin}>
//             <Text style={styles.buttonText}>Login</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//             <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   keyboardAvoidingView: { flex: 1 },
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

// export default Login;
import { View, Text } from 'react-native'
import React from 'react'

export default function Login() {
  return (
    <View>
      <Text>Login</Text>
    </View>
  )
}