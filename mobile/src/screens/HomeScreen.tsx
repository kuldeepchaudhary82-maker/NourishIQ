import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { Activity, Droplet, Flame, Utensils } from 'lucide-react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const MacroRing = ({ label, current, target, color }: { label: string; current: number; target: number; color: string }) => {
  const progress = target > 0 ? Math.min(current / target, 1) : 0;
  return (
    <View className="items-center">
      <View className="w-16 h-16 rounded-full border-4 border-gray-100 items-center justify-center">
        <View className={`w-14 h-14 rounded-full border-4 ${color} absolute`} style={{ opacity: progress }} />
        <Text className="text-xs font-bold text-textPrimary">{current}g</Text>
      </View>
      <Text className="text-[10px] text-textSecondary mt-1 uppercase font-semibold">{label}</Text>
    </View>
  );
};

const HomeScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [waterCount, setWaterCount] = useState(1200); // Mock
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const fetchData = async () => {
    try {
      const planRes = await axios.get('https://nourishiq-production.up.railway.app/api/plan/current', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setCurrentPlan(planRes.data);
    } catch (error) {
      console.log('No plan found or error fetching');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        className="px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-row items-center justify-between mt-6 mb-8">
          <View>
            <Text className="text-textSecondary font-semibold">Hello, {user?.name.split(' ')[0]}</Text>
            <Text className="text-2xl font-bold text-secondary">Saturday, Apr 4</Text>
          </View>
          <TouchableOpacity 
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm"
            onPress={() => navigation.navigate('AIChat')}
          >
            <Activity size={24} color="#1D9E75" />
          </TouchableOpacity>
        </View>

        {/* Macro Progress */}
        <View className="bg-card p-6 rounded-card shadow-sm mb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-3xl font-bold text-secondary">1,840</Text>
              <Text className="text-textSecondary text-xs">kcal consumed of 2,450</Text>
            </View>
            <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center">
              <Flame size={24} color="#1D9E75" />
            </View>
          </View>
          
          <View className="flex-row justify-between">
            <MacroRing label="Protein" current={140} target={180} color="border-primary" />
            <MacroRing label="Carbs" current={210} target={280} color="border-accent" />
            <MacroRing label="Fat" current={54} target={65} color="border-secondary" />
          </View>
        </View>

        {/* Water Intake */}
        <View className="bg-white p-6 rounded-card shadow-sm mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mr-4">
              <Droplet size={24} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-secondary">{waterCount} ml</Text>
              <View className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <View className="h-full bg-blue-400" style={{ width: '60%' }} />
              </View>
            </View>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center ml-4"
            onPress={() => setWaterCount(waterCount + 200)}
          >
            <Text className="text-white font-bold text-xl">+</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Timeline */}
        <Text className="text-xl font-bold text-secondary mb-4">Today's Meal Plan</Text>
        
        {currentPlan ? (
          <View className="mb-12">
            {/* Logic to filter for current day in plan history or active plan JSON */}
            {/* Mocking for now based on typical structure */}
            {[
              { slot: 'Breakfast', name: 'Quinoa Poha with Peanuts', time: '08:00 AM', kcal: 420 },
              { slot: 'Lunch', name: 'Grilled Chicken & Sautéed Veggies', time: '01:30 PM', kcal: 650 },
              { slot: 'Snack', name: 'Greek Yogurt & Almonds', time: '05:00 PM', kcal: 280 },
              { slot: 'Dinner', name: 'Baked Salmon with Broccoli', time: '08:30 PM', kcal: 540 },
            ].map((meal, index) => (
              <TouchableOpacity 
                key={index}
                className="bg-card p-4 rounded-card border border-gray-100 mb-4 flex-row items-center"
                onPress={() => navigation.navigate('MealDetail', { meal })}
              >
                <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mr-4">
                  <Utensils size={20} color="#5F5E5A" />
                </View>
                <View className="flex-1">
                  <Text className="text-textSecondary text-xs font-semibold uppercase">{meal.slot} • {meal.time}</Text>
                  <Text className="text-lg font-bold text-secondary">{meal.name}</Text>
                  <Text className="text-textSecondary text-xs">{meal.kcal} kcal</Text>
                </View>
                <TouchableOpacity className="bg-primary/10 px-4 py-2 rounded-full">
                  <Text className="text-primary font-bold text-xs">Log</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="bg-accent/10 p-6 rounded-card border border-accent/20 mb-12">
            <Text className="text-accent font-bold text-lg">No Active Plan</Text>
            <Text className="text-textSecondary mt-2">Complete your profile to generate your first personalised nutrition plan.</Text>
            <TouchableOpacity 
              className="bg-accent h-12 rounded-button items-center justify-center mt-6"
              onPress={() => navigation.navigate('Onboarding')}
            >
              <Text className="text-white font-bold">Complete Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
