import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ChevronLeft, Info, CheckCircle2, AlertCircle, TrendingUp, Sparkles, Target } from 'lucide-react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const WeeklyReportDetailScreen = ({ route, navigation }: any) => {
  const { reportId } = route.params;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`https://nourishiq-production.up.railway.app/api/reports/${reportId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setReport(res.data);
      } catch (err) {
        console.log('Error fetching report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  if (loading) return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator color="#1D9E75" />
    </SafeAreaView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-100 shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={24} color="#1A2340" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-secondary">Report Detail</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
        <View className="bg-primary p-8 rounded-[40px] mb-8 shadow-lg shadow-primary/40">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white/80 font-bold text-xs uppercase tracking-widest mb-1">Overall Adherence</Text>
              <Text className="text-white text-5xl font-bold">{report.adherence.toFixed(0)}%</Text>
            </View>
            <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center">
              <Target size={32} color="#FFFFFF" />
            </View>
          </View>
          <View className="h-2 bg-white/20 rounded-full overflow-hidden">
            <View className="h-full bg-accent" style={{ width: `${report.adherence}%` }} />
          </View>
        </View>

        <View className="bg-white p-6 rounded-[32px] mb-8 shadow-sm border border-gray-100">
          <View className="flex-row items-center gap-2 mb-4">
            <Sparkles size={20} color="#EF9F27" />
            <Text className="text-secondary font-bold text-lg">AI Summary</Text>
          </View>
          <Text className="text-secondary leading-6 font-medium italic mb-2">
            "{report.summary}"
          </Text>
        </View>

        <Text className="text-secondary font-bold text-lg mb-4 ml-2">Key Insights</Text>
        <View className="mb-8">
          {report.insights.map((insight: string, idx: number) => (
            <View key={idx} className="bg-white p-4 rounded-2xl mb-3 flex-row items-center shadow-sm border border-gray-100">
              <View className="w-2 h-2 rounded-full bg-blue-500 mr-4" />
              <Text className="flex-1 text-secondary text-sm font-medium">{insight}</Text>
            </View>
          ))}
        </View>

        <Text className="text-secondary font-bold text-lg mb-4 ml-2">Next Steps</Text>
        <View className="mb-12">
          {report.recommendations.map((rec: string, idx: number) => (
            <View key={idx} className="bg-white p-4 rounded-2xl mb-3 flex-row items-center shadow-sm border border-gray-100">
              <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-4">
                <CheckCircle2 size={16} color="#1D9E75" />
              </View>
              <Text className="flex-1 text-secondary text-sm font-bold">{rec}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeeklyReportDetailScreen;
