import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Check, ChevronLeft, ShieldCheck } from 'lucide-react-native';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { useAuthStore } from '../store/useAuthStore';

const PlanFeature = ({ text }: { text: string }) => (
  <View className="flex-row items-center mb-4">
    <View className="w-5 h-5 bg-primary/10 rounded-full items-center justify-center mr-3">
      <Check size={12} color="#1D9E75" />
    </View>
    <Text className="text-textPrimary text-sm">{text}</Text>
  </View>
);

const PaywallScreen = ({ navigation }: any) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const handleCheckout = async (planId: string, amount: number) => {
    try {
      const res = await axios.post('https://nourishiq-production.up.railway.app/api/subscription/create', { planId }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const options = {
        description: 'NourishIQ Subscription',
        image: 'https://your-logo-url.com',
        currency: 'INR',
        key: 'your-razorpay-key-id', // process.env equivalent
        amount: amount * 100,
        name: 'NourishIQ',
        subscription_id: res.data.id,
        prefill: {
          email: user?.email,
          contact: user?.phone || '',
          name: user?.name
        },
        theme: { color: '#1D9E75' }
      };

      RazorpayCheckout.open(options).then((data) => {
        Alert.alert('Success', 'Subscription activated successfully');
        navigation.navigate('HomeTab');
      }).catch((error) => {
        Alert.alert('Error', `Payment failed: ${error.description}`);
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create subscription');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={24} color="#1A2340" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-secondary">Upgrade to Pro</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="bg-primary/5 p-8 rounded-card items-center mb-10 border border-primary/10">
          <ShieldCheck size={48} color="#1D9E75" />
          <Text className="text-2xl font-bold text-secondary mt-4">NourishIQ Core</Text>
          <Text className="text-textSecondary text-center mt-2 leading-6">
            Unlock the full power of clinical sports nutrition and AI-driven health optimization.
          </Text>
        </View>

        <View className="mb-10">
          <Text className="text-lg font-bold text-secondary mb-6">What's included:</Text>
          <PlanFeature text="Personalized 7-Day Nutrition Plan" />
          <PlanFeature text="Claude AI Health Coach (Unlimited)" />
          <PlanFeature text="Biomarker Analysis & Monitoring" />
          <PlanFeature text="Daily Reminders & Adherence Score" />
          <PlanFeature text="Supplement Stack Optimization" />
        </View>

        <View className="space-y-4 mb-12">
          <TouchableOpacity 
            className="bg-white border-2 border-primary p-6 rounded-card shadow-sm"
            onPress={() => handleCheckout('plan_123', 499)}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-bold text-secondary">Monthly Plan</Text>
                <Text className="text-textSecondary text-xs">Billed monthly. Cancel anytime.</Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-primary">₹499</Text>
                <Text className="text-textSecondary text-[10px] font-bold">/ MO</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-secondary p-6 rounded-card shadow-sm"
            onPress={() => handleCheckout('plan_456', 3999)}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-bold text-white">Annual Plan</Text>
                <Text className="text-white/70 text-xs">Save ₹1,989. Billed yearly.</Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-white">₹3,999</Text>
                <Text className="text-white/70 text-[10px] font-bold">/ YEAR</Text>
              </View>
            </View>
            <View className="bg-accent absolute -top-3 -right-3 px-3 py-1 rounded-full shadow-sm">
              <Text className="text-white font-bold text-[10px] uppercase">Best Value</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaywallScreen;
