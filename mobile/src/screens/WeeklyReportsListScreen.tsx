import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const WeeklyReportsListScreen = ({ navigation }: any) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('https://nourishiq-production.up.railway.app/api/reports', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setReports(res.data);
      } catch (err) {
        console.log('Error fetching reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      className="bg-white p-6 rounded-3xl mb-4 flex-row items-center shadow-sm border border-gray-100"
      onPress={() => navigation.navigate('WeeklyReportDetail', { reportId: item.id })}
    >
      <View className="p-3 bg-primary/10 rounded-2xl mr-4">
        <Calendar size={24} color="#1D9E75" />
      </View>
      <View className="flex-1">
        <Text className="text-secondary font-bold text-lg">
          {formatDate(item.startDate)} - {formatDate(item.endDate)}
        </Text>
        <View className="flex-row items-center mt-1">
          <TrendingUp size={14} color="#5F5E5A" className="mr-1" />
          <Text className="text-textSecondary text-xs">Adherence: {item.adherence.toFixed(1)}%</Text>
        </View>
      </View>
      <ChevronRight size={20} color="#1A2340" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={24} color="#1A2340" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-secondary">Weekly Health Reports</Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#1D9E75" />
          </View>
        ) : reports.length > 0 ? (
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-12">
            <Calendar size={64} color="#D1D5DB" className="mb-6" />
            <Text className="text-secondary font-bold text-lg mb-2">No Reports Yet</Text>
            <Text className="text-textSecondary text-center leading-5">
              Weekly AI summaries are generated every Sunday night based on your logged data. Start logging to see your first report!
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WeeklyReportsListScreen;
