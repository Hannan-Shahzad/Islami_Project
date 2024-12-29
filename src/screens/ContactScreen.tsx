import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Use Expo Linear Gradient
import { supabase } from '../configs/SupabaseConfig';

const ContactUsScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Save data to Supabase here
    const { data, error } = await supabase
      .from('contact_us')
      .insert([
        { name, email, message }
      ]);

    if (error) {
      Alert.alert('Error', 'Something went wrong, please try again.');
      return;
    }

    // Clear input fields after success
    setName('');
    setEmail('');
    setMessage('');

    Alert.alert('Success', 'Your message has been sent!');
  };

  return (
    <LinearGradient
      colors={['#000000', '#FFD700']} // Black and gold gradient
      style={styles.container}
    >
      {/* Logo */}
      <Image
        source={require('../../assets/icons/49053.jpg')} // Replace with your logo file path
        style={styles.logo}
      />
      
      <Text style={styles.heading}>Contact Us</Text>
      
      {/* Name Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#FFD700" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#FFD700"
          value={name}
          onChangeText={setName}
        />
      </View>
      
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#FFD700" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          placeholderTextColor="#FFD700"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      
      {/* Message Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="comment" size={20} color="#FFD700" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Your Message"
          placeholderTextColor="#FFD700"
          multiline
          value={message}
          onChangeText={setMessage}
        />
      </View>
      
      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button title="Send Message" onPress={handleSubmit} color="#FFD700" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    borderRadius: 60,
    // tintColor: '#FFD700',
  },
  heading: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    marginVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  input: {
    flex: 1,
    color: '#FFD700',
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default ContactUsScreen;
