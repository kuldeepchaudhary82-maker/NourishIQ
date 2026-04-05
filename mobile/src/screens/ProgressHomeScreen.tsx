import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { TrendingDown, TrendingUp, Award, Activity, ChevronRight, FlaskConical } from 'lucide-react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const SummaryCard = ({ title, value, unit, change, color, icon }: any) => (
  <View className="bg-white p-5 rounded-card border border-gray-100 flex-1 shadow-sm">
    <View className="flex-row justify-between items-start mb-4">
      <View className={`w-10 h-10 rounded-xl items-center justify-center ${color}`}>
        {icon}
      </View>
      <View className={`flex-row items-center px-2 py-1 rounded-full ${change < 0 ? 'bg-green-50' : 'bg-red-50'}`}>
        {change < 0 ? <TrendingDown size={12} color="#1D9E75" /> : <TrendingUp size={12} color="#E24B4A" />}
        <Text className={`text-[10px] font-bold ml-1 ${change < 0 ? 'text-primary' : 'text-danger'}`}>
          {Math.abs(change)}{unit}
        </Text>
      </View>
    </View>
    <Text className="text-textSecondary text-xs font-medium">{title}</Text>
    <View className="flex-row items-baseline mt-1">
      <Text className="text-2xl font-bold text-secondary">{value}</Text>
      <Text className="text-textSecondary text-xs ml-1">{unit}</Text>
    </View>
  </View>
);

const ProgressHomeScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/metrics/progress/summary', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSummary(res.data);
    } catch (error) {
      console.log('Error fetching metrics');
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

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1D9E75" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        className="px-6 py-6" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="mb-8">
          <Text className="text-2xl font-bold text-secondary">Your Progress</Text>
          <Text className="text-textSecondary">Visualizing your journey to health optimization.</Text>
        </View>

        {/* Adherence Score */}
        <TouchableOpacity 
          className="bg-primary p-6 rounded-card mb-8 flex-row items-center justify-between"
          onPress={() => navigation.navigate('WeeklyReportsList')}
        >
          <View className="flex-1">
            <Text className="text-white/70 text-xs font-bold uppercase mb-1">Weekly Adherence</Text>
            <Text className="text-white text-3xl font-bold">{summary?.adherenceScore || 0}%</Text>
            <Text className="text-white/80 text-[10px] mt-2 font-bold uppercase tracking-wider">Tap to view AI Analysis ➔</Text>
          </View>
          <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center">
            <Award size={32} color="white" />
          </View>
        </TouchableOpacity>

        {/* Summary Grid */}
        <View className="flex-row gap-4 mb-4">
          <SummaryCard 
            title="Weight Loss" 
            value={summary?.currentWeight} 
            unit="kg" 
            change={summary?.weightChange} 
            color="bg-blue-50" 
            icon={<Activity size={20} color="#3B82F6" />} 
          />
          <SummaryCard 
            title="Body Fat" 
            value="18.4" // Mocked
            unit="%" 
            change={summary?.fatChange || -1.2} 
            color="bg-orange-50" 
            icon={<Activity size={20} color="#EF9F27" />} 
          />
        </View>

        {/* Trends List */}
        <Text className="text-lg font-bold text-secondary mt-6 mb-4">Detailed Trends</Text>
        
        <TouchableOpacity 
          className="bg-white p-5 rounded-card border border-gray-100 flex-row items-center justify-between shadow-sm mb-4"
          onPress={() => navigation.navigate('WeightChart')}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
              <Activity size={20} color="#3B82F6" />
            </View>
            <Text className="font-bold text-secondary">Weight Trend</Text>
          </View>
          <ChevronRight size={20} color="#5F5E5A" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white p-5 rounded-card border border-gray-100 flex-row items-center justify-between shadow-sm mb-4"
          onPress={() => navigation.navigate('BodyFatChart')}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mr-4">
              <Activity size={20} color="#EF9F27" />
            </View>
            <Text className="font-bold text-secondary">Body Fat % Trend</Text>
          </View>
          <ChevronRight size={20} color="#5F5E5A" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white p-5 rounded-card border border-gray-100 flex-row items-center justify-between shadow-sm mb-8"
          onPress={() => navigation.navigate('LabResults')}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
              <FlaskConical size={20} color="#1D9E75" />
            </View>
            <Text className="font-bold text-secondary">Biomarker History</Text>
          </View>
          <ChevronRight size={20} color="#5F5E5A" />
        </TouchableOpacity>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressHomeScreen;
