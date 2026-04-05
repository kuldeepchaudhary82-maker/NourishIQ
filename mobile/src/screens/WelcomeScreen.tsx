import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView className="flex-1 bg-background px-6 justify-between py-12">
      <View className="items-center mt-12">
        <View className="w-24 h-24 bg-primary rounded-3xl items-center justify-center mb-6">
          <Text className="text-white text-4xl font-bold">NIQ</Text>
        </View>
        <Text className="text-4xl font-bold text-secondary">NourishIQ</Text>
        <Text className="text-textSecondary text-center mt-4 px-8 leading-6">
          Personalised Nutrition, Supplement & Health Optimisation App
        </Text>
      </View>

      <View className="w-full">
        <TouchableOpacity 
          className="bg-primary h-14 rounded-button items-center justify-center mb-4 shadow-md"
          onPress={() => navigation.navigate('Register')}
        >
          <Text className="text-white font-bold text-lg">Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white border border-gray-200 h-14 rounded-button items-center justify-center"
          onPress={() => navigation.navigate('Login')}
        >
          <Text className="text-secondary font-bold text-lg">Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
