import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      // Navigation handled by RootNavigator checking user state
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 justify-center">
      <Text className="text-3xl font-bold text-primary mb-8 text-center">NourishIQ</Text>
      <Text className="text-xl font-semibold text-textPrimary mb-2">Welcome Back</Text>
      <Text className="text-textSecondary mb-8">Sign in to continue your health journey</Text>
      
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
        className="bg-card h-14 px-4 rounded-input border border-gray-200 mb-6"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        className="bg-primary h-14 rounded-button items-center justify-center shadow-sm"
        onPress={handleLogin}
      >
        <Text className="text-white font-bold text-lg">Sign In</Text>
      </TouchableOpacity>
      
      <View className="flex-row justify-center mt-6">
        <Text className="text-textSecondary">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="text-primary font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
