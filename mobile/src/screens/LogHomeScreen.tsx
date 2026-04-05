import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Utensils, Pill, Activity, Droplet, ChevronRight } from 'lucide-react-native';

const LogItem = ({ title, subtitle, icon, color, onPress }: any) => (
  <TouchableOpacity 
    className="bg-white p-5 rounded-card border border-gray-100 mb-4 flex-row items-center shadow-sm"
    onPress={onPress}
  >
    <div className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${color}`}>
      {icon}
    </div>
    <View className="flex-1">
      <Text className="text-lg font-bold text-secondary">{title}</Text>
      <Text className="text-textSecondary text-xs">{subtitle}</Text>
    </View>
    <ChevronRight size={20} color="#5F5E5A" />
  </TouchableOpacity>
);

const LogHomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-secondary mb-2">Daily Logging</Text>
        <Text className="text-textSecondary mb-8">Keep track of your adherence to stay on goal.</Text>

        <LogItem 
          title="Log Meal" 
          subtitle="Breakfast, Lunch, Dinner or Snacks" 
          icon={<Utensils size={24} color="#1D9E75" />}
          color="bg-primary/10"
          onPress={() => navigation.navigate('LogMeal')}
        />

        <LogItem 
          title="Log Supplement" 
          subtitle="Vitamins, Minerals, or Performance Stack" 
          icon={<Pill size={24} color="#EF9F27" />}
          color="bg-accent/10"
          onPress={() => navigation.navigate('LogSupplement')}
        />

        <LogItem 
          title="Log Activity" 
          subtitle="Workouts, Steps, and Active Minutes" 
          icon={<Activity size={24} color="#1A2340" />}
          color="bg-secondary/10"
          onPress={() => navigation.navigate('LogActivity')}
        />

        <LogItem 
          title="Log Water" 
          subtitle="Stay hydrated throughout the day" 
          icon={<Droplet size={24} color="#3B82F6" />}
          color="bg-blue-50/50"
          onPress={() => navigation.navigate('LogWater')}
        />

        <TouchableOpacity 
          className="mt-8 bg-gray-100 p-4 rounded-card items-center border border-dashed border-gray-300"
          onPress={() => navigation.navigate('LogDailySummary', { date: new Date().toISOString() })}
        >
          <Text className="text-textSecondary font-bold">View Today's Log Summary</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LogHomeScreen;
