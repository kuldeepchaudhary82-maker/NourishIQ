import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Info } from 'lucide-react-native';

const MealDetailScreen = ({ route, navigation }: any) => {
  const { meal } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-4 pb-8 bg-background">
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center bg-white rounded-full mb-6 shadow-sm"
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color="#1A2340" />
          </TouchableOpacity>
          
          <Text className="text-primary font-bold text-sm uppercase tracking-widest mb-2">{meal.slot}</Text>
          <Text className="text-3xl font-bold text-secondary mb-4">{meal.name}</Text>
          
          <View className="flex-row flex-wrap gap-4 mt-2">
            <View className="bg-white px-4 py-2 rounded-xl shadow-sm">
              <Text className="text-textSecondary text-[10px] uppercase font-bold">Calories</Text>
              <Text className="text-secondary font-bold text-lg">{meal.macros?.kcal}</Text>
            </View>
            <View className="bg-white px-4 py-2 rounded-xl shadow-sm">
              <Text className="text-textSecondary text-[10px] uppercase font-bold">Protein</Text>
              <Text className="text-primary font-bold text-lg">{meal.macros?.protein}g</Text>
            </View>
            <View className="bg-white px-4 py-2 rounded-xl shadow-sm">
              <Text className="text-textSecondary text-[10px] uppercase font-bold">Carbs</Text>
              <Text className="text-accent font-bold text-lg">{meal.macros?.carbs}g</Text>
            </View>
            <View className="bg-white px-4 py-2 rounded-xl shadow-sm">
              <Text className="text-textSecondary text-[10px] uppercase font-bold">Fat</Text>
              <Text className="text-secondary font-bold text-lg">{meal.macros?.fat}g</Text>
            </View>
          </View>
        </View>

        <View className="px-6 py-8">
          <Text className="text-xl font-bold text-secondary mb-4">Ingredients</Text>
          {meal.ingredients?.map((item: any, idx: number) => (
            <View key={idx} className="flex-row items-center justify-between py-3 border-b border-gray-50">
              <Text className="text-textPrimary font-medium">{item.item}</Text>
              <Text className="text-textSecondary font-bold">{item.amount}</Text>
            </View>
          ))}

          <Text className="text-xl font-bold text-secondary mt-10 mb-4">Preparation</Text>
          <Text className="text-textSecondary leading-7">
            {meal.prep || "Follow the recommended cooking style for optimal nutrition retention."}
          </Text>

          <View className="mt-12 p-6 bg-blue-50 rounded-card flex-row border border-blue-100">
            <Info size={24} color="#3B82F6" />
            <View className="ml-4 flex-1">
              <Text className="text-blue-800 font-bold mb-1">Nutrition Tip</Text>
              <Text className="text-blue-700 text-sm leading-5">
                Consume this meal within 30 minutes of preparation for maximum micronutrient availability.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MealDetailScreen;
