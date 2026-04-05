import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

interface StepProps {
  onNext: (data: any) => void;
  data: any;
}

const Step1Demographics = ({ onNext, data }: StepProps) => {
  const [formData, setFormData] = useState({
    age: data.age?.toString() || '',
    gender: data.gender || '',
    heightCm: data.heightCm?.toString() || '',
    currentWeight: data.currentWeight?.toString() || '',
    targetWeight: data.targetWeight?.toString() || '',
    city: data.city || '',
  });

  const handleNext = () => {
    onNext({
      age: parseInt(formData.age),
      gender: formData.gender,
      heightCm: parseFloat(formData.heightCm),
      currentWeight: parseFloat(formData.currentWeight),
      targetWeight: parseFloat(formData.targetWeight),
      city: formData.city,
    });
  };

  return (
    <ScrollView className="px-6 py-4">
      <Text className="text-2xl font-bold text-secondary mb-2">Tell us about yourself</Text>
      <Text className="text-textSecondary mb-8">This helps us calculate your baseline calorie and macro needs.</Text>

      <View className="space-y-4">
        <View>
          <Text className="text-textPrimary font-semibold mb-2">Age</Text>
          <TextInput
            placeholder="e.g. 28"
            className="bg-card h-12 px-4 rounded-input border border-gray-200"
            keyboardType="number-pad"
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
          />
        </View>

        <View>
          <Text className="text-textPrimary font-semibold mb-2">Gender</Text>
          <View className="flex-row space-x-4">
            {['Male', 'Female', 'Other'].map((g) => (
              <TouchableOpacity
                key={g}
                className={`flex-1 h-12 rounded-input items-center justify-center border ${
                  formData.gender === g ? 'bg-primary border-primary' : 'bg-card border-gray-200'
                }`}
                onPress={() => setFormData({ ...formData, gender: g })}
              >
                <Text className={formData.gender === g ? 'text-white font-bold' : 'text-textPrimary'}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex-row space-x-4">
          <View className="flex-1">
            <Text className="text-textPrimary font-semibold mb-2">Height (cm)</Text>
            <TextInput
              placeholder="175"
              className="bg-card h-12 px-4 rounded-input border border-gray-200"
              keyboardType="number-pad"
              value={formData.heightCm}
              onChangeText={(text) => setFormData({ ...formData, heightCm: text })}
            />
          </View>
          <View className="flex-1">
            <Text className="text-textPrimary font-semibold mb-2">Weight (kg)</Text>
            <TextInput
              placeholder="70"
              className="bg-card h-12 px-4 rounded-input border border-gray-200"
              keyboardType="number-pad"
              value={formData.currentWeight}
              onChangeText={(text) => setFormData({ ...formData, currentWeight: text })}
            />
          </View>
        </View>

        <View>
          <Text className="text-textPrimary font-semibold mb-2">Target Weight (kg)</Text>
          <TextInput
            placeholder="65"
            className="bg-card h-12 px-4 rounded-input border border-gray-200"
            keyboardType="number-pad"
            value={formData.targetWeight}
            onChangeText={(text) => setFormData({ ...formData, targetWeight: text })}
          />
        </View>

        <View>
          <Text className="text-textPrimary font-semibold mb-2">City</Text>
          <TextInput
            placeholder="e.g. Mumbai"
            className="bg-card h-12 px-4 rounded-input border border-gray-200"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
          />
        </View>
      </View>

      <TouchableOpacity 
        className="bg-primary h-14 rounded-button items-center justify-center mt-12 mb-8 shadow-sm"
        onPress={handleNext}
      >
        <Text className="text-white font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Step1Demographics;
