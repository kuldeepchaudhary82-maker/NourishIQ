import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const LogMealScreen = ({ navigation }: any) => {
  const [mealName, setMealName] = useState('');
  const [slot, setSlot] = useState('Breakfast');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleLog = async () => {
    if (!mealName) return Alert.alert('Error', 'Please enter a meal name');
    try {
      await axios.post('https://nourishiq-production.up.railway.app/api/log/meal', {
        date: new Date().toISOString(),
        mealSlot: slot.toLowerCase(),
        loggedMeal: mealName,
        kcal: parseFloat(kcal) || 0,
        proteinG: parseFloat(protein) || 0,
        status: 'LOGGED'
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      Alert.alert('Success', 'Meal logged successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to log meal');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-6 py-6">
        <Text className="text-2xl font-bold text-secondary mb-6">Log Meal</Text>
        
        <View className="mb-6">
          <Text className="text-textPrimary font-semibold mb-2">Meal Slot</Text>
          <View className="flex-row flex-wrap gap-2">
            {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map((s) => (
              <TouchableOpacity 
                key={s}
                className={`px-4 py-2 rounded-full border ${slot === s ? 'bg-primary border-primary' : 'bg-card border-gray-200'}`}
                onPress={() => setSlot(s)}
              >
                <Text className={slot === s ? 'text-white font-bold' : 'text-textSecondary'}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-textPrimary font-semibold mb-2">What did you eat?</Text>
          <TextInput
            placeholder="e.g. Scrambled eggs with whole wheat toast"
            className="bg-card h-14 px-4 rounded-input border border-gray-200"
            value={mealName}
            onChangeText={setMealName}
          />
        </View>

        <View className="flex-row gap-4 mb-8">
          <View className="flex-1">
            <Text className="text-textPrimary font-semibold mb-2">Calories (kcal)</Text>
            <TextInput
              placeholder="0"
              className="bg-card h-14 px-4 rounded-input border border-gray-200"
              keyboardType="number-pad"
              value={kcal}
              onChangeText={setKcal}
            />
          </View>
          <View className="flex-1">
            <Text className="text-textPrimary font-semibold mb-2">Protein (g)</Text>
            <TextInput
              placeholder="0"
              className="bg-card h-14 px-4 rounded-input border border-gray-200"
              keyboardType="number-pad"
              value={protein}
              onChangeText={setProtein}
            />
          </View>
        </View>

        <TouchableOpacity 
          className="bg-primary h-14 rounded-button items-center justify-center shadow-md"
          onPress={handleLog}
        >
          <Text className="text-white font-bold text-lg">Save Meal Log</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LogMealScreen;
