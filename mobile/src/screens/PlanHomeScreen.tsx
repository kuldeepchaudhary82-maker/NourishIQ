import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ChevronRight, Calendar, Info } from 'lucide-react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const PlanHomeScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<any>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get('https://nourishiq-production.up.railway.app/api/plan/current', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setPlan(res.data);
      } catch (error) {
        console.log('Error fetching plan');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1D9E75" />
      </View>
    );
  }

  if (!plan) {
    return (
      <SafeAreaView className="flex-1 bg-background px-6 justify-center items-center">
        <Info size={48} color="#EF9F27" />
        <Text className="text-xl font-bold text-secondary mt-4">No Active Plan</Text>
        <Text className="text-textSecondary text-center mt-2 mb-8">
          Complete your onboarding and generate a plan to see it here.
        </Text>
        <TouchableOpacity 
          className="bg-primary px-8 py-3 rounded-button"
          onPress={() => navigation.navigate('Onboarding')}
        >
          <Text className="text-white font-bold">Start Onboarding</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-2xl font-bold text-secondary">Your 7-Day Plan</Text>
          <Text className="text-textSecondary">Optimised based on your latest lab results.</Text>
        </View>

        {/* Macro Overview */}
        <View className="bg-secondary p-6 rounded-card mb-8">
          <Text className="text-white/70 text-xs font-bold uppercase mb-2">Daily Targets</Text>
          <Text className="text-white text-3xl font-bold mb-4">{plan.calorieTargets?.daily} kcal</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-white/50 text-[10px] uppercase">Protein</Text>
              <Text className="text-white font-bold">{plan.calorieTargets?.protein}g</Text>
            </View>
            <View>
              <Text className="text-white/50 text-[10px] uppercase">Carbs</Text>
              <Text className="text-white font-bold">{plan.calorieTargets?.carbs}g</Text>
            </View>
            <View>
              <Text className="text-white/50 text-[10px] uppercase">Fat</Text>
              <Text className="text-white font-bold">{plan.calorieTargets?.fat}g</Text>
            </View>
          </View>
        </View>

        {/* Weekly List */}
        <View className="space-y-4">
          {plan.mealPlan?.map((dayPlan: any, index: number) => (
            <TouchableOpacity 
              key={index}
              className="bg-white p-5 rounded-card border border-gray-100 flex-row items-center justify-between shadow-sm mb-4"
              onPress={() => navigation.navigate('DayPlan', { dayPlan })}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
                  <Calendar size={20} color="#1D9E75" />
                </View>
                <View>
                  <Text className="text-lg font-bold text-secondary">Day {dayPlan.day}</Text>
                  <Text className="text-textSecondary text-xs">{dayPlan.meals?.length} meals scheduled</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#5F5E5A" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Supplement Stack Preview */}
        <TouchableOpacity 
          className="mt-4 bg-accent/10 p-5 rounded-card border border-accent/20 flex-row items-center justify-between mb-12"
          onPress={() => navigation.navigate('SupplementPlan', { supplements: plan.supplementStack })}
        >
          <View>
            <Text className="text-accent font-bold text-lg">Supplement Stack</Text>
            <Text className="text-textSecondary text-xs">{plan.supplementStack?.length} items in your daily protocol</Text>
          </View>
          <ChevronRight size={20} color="#EF9F27" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlanHomeScreen;
