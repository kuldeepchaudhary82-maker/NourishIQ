import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Utensils, Clock, Flame } from 'lucide-react-native';

const DayPlanScreen = ({ route, navigation }: any) => {
  const { dayPlan } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-textSecondary font-semibold">Detailed View</Text>
            <Text className="text-3xl font-bold text-secondary">Day {dayPlan.day}</Text>
          </View>
        </View>

        {dayPlan.meals?.map((meal: any, index: number) => (
          <TouchableOpacity 
            key={index}
            className="bg-white p-5 rounded-card border border-gray-100 mb-6 shadow-sm"
            onPress={() => navigation.navigate('MealDetail', { meal })}
          >
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1 mr-4">
                <Text className="text-primary font-bold text-xs uppercase tracking-widest mb-1">{meal.slot}</Text>
                <Text className="text-xl font-bold text-secondary">{meal.name}</Text>
              </View>
              <View className="bg-gray-50 px-3 py-1.5 rounded-full flex-row items-center">
                <Clock size={14} color="#5F5E5A" />
                <Text className="text-textSecondary text-xs font-bold ml-1">{meal.time}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-6 border-t border-gray-50 pt-4">
              <View className="flex-row items-center">
                <Flame size={16} color="#E24B4A" />
                <Text className="text-textSecondary text-xs font-bold ml-1">{meal.macros?.kcal} kcal</Text>
              </View>
              <View className="flex-row items-center">
                <Utensils size={16} color="#1D9E75" />
                <Text className="text-textSecondary text-xs font-bold ml-1">{meal.macros?.protein}g Protein</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DayPlanScreen;
