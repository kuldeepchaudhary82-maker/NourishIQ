import React, { useState } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import Step1Demographics from './Step1_Demographics';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const OnboardingScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({});
  const accessToken = useAuthStore((state) => state.accessToken);

  const totalSteps = 6; // Simplified for now

  const handleNext = async (data: any) => {
    const newData = { ...onboardingData, ...data };
    setOnboardingData(newData);
    
    // Save partial data to backend
    if (step === 1) {
      await axios.post('https://nourishiq-production.up.railway.app/api/onboarding/health-profile', data, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final step
      await axios.post('https://nourishiq-production.up.railway.app/api/onboarding/complete', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      // Navigate to Home
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Demographics onNext={handleNext} data={onboardingData} />;
      default:
        return (
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-2xl font-bold mb-4">Step {step} Coming Soon</Text>
            <TouchableOpacity 
              className="bg-primary px-8 py-3 rounded-button"
              onPress={() => handleNext({})}
            >
              <Text className="text-white font-bold">Skip Step</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Text className="text-textSecondary font-semibold">Step {step} of {totalSteps}</Text>
        <View className="h-2 flex-1 bg-gray-200 ml-4 rounded-full overflow-hidden">
          <View 
            className="h-full bg-primary" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </View>
      </View>
      {renderStep()}
    </SafeAreaView>
  );
};

export default OnboardingScreen;
