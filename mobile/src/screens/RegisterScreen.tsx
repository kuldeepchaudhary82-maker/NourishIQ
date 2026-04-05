import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name,
        email,
        password,
      });
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text className="text-3xl font-bold text-primary mb-8 text-center">NourishIQ</Text>
        <Text className="text-xl font-semibold text-textPrimary mb-2">Create Account</Text>
        <Text className="text-textSecondary mb-8">Start your personalised nutrition plan today</Text>
        
        <TextInput
          placeholder="Full Name"
          className="bg-card h-14 px-4 rounded-input border border-gray-200 mb-4"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          className="bg-card h-14 px-4 rounded-input border border-gray-200 mb-4"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          placeholder="Password"
          className="bg-card h-14 px-4 rounded-input border border-gray-200 mb-8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          className="bg-primary h-14 rounded-button items-center justify-center shadow-sm"
          onPress={handleRegister}
        >
          <Text className="text-white font-bold text-lg">Create Account</Text>
        </TouchableOpacity>
        
        <View className="flex-row justify-center mt-6">
          <Text className="text-textSecondary">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-primary font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
