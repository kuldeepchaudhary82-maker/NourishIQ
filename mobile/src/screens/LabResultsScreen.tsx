import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ChevronLeft, Info, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const LabResultsScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [labResults, setLabResults] = useState<any>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/metrics/lab-results', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setLabResults(res.data);
      } catch (error) {
        console.log('Error fetching lab results');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (val: number, min?: number, max?: number) => {
    if (!min || !max) return 'text-textSecondary';
    if (val < min || val > max) return 'text-danger';
    return 'text-primary';
  };

  const getStatusIcon = (val: number, min?: number, max?: number) => {
    if (!min || !max) return <Info size={16} color="#5F5E5A" />;
    if (val < min || val > max) return <AlertCircle size={16} color="#E24B4A" />;
    return <CheckCircle2 size={16} color="#1D9E75" />;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={24} color="#1A2340" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-secondary">Biomarkers</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#1D9E75" />
        </View>
      ) : (
        <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
          {Object.entries(labResults || {}).map(([marker, history]: [string, any]) => (
            <TouchableOpacity 
              key={marker}
              className="bg-white p-5 rounded-card border border-gray-100 mb-4 shadow-sm"
              onPress={() => navigation.navigate('LabMarkerDetail', { marker, history })}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-secondary">{marker}</Text>
                <View className="flex-row items-center">
                  {getStatusIcon(history[0].value, history[0].referenceMin, history[0].referenceMax)}
                  <Text className={`text-xs font-bold ml-1 ${getStatusColor(history[0].value, history[0].referenceMin, history[0].referenceMax)}`}>
                    {history[0].value} {history[0].unit}
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center justify-between border-t border-gray-50 pt-4">
                <Text className="text-textSecondary text-[10px] uppercase font-bold">Ref. Range</Text>
                <Text className="text-textPrimary text-xs font-semibold">
                  {history[0].referenceMin} - {history[0].referenceMax} {history[0].unit}
                </Text>
              </View>
              
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-textSecondary text-[10px] uppercase font-bold">Latest Test</Text>
                <Text className="text-textPrimary text-xs">
                  {new Date(history[0].testDate).toLocaleDateString('en-GB')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            className="bg-primary/10 border border-dashed border-primary p-6 rounded-card items-center mt-4 mb-12"
            onPress={() => navigation.navigate('UploadLabReport')}
          >
            <Text className="text-primary font-bold">Upload New Lab Report</Text>
          </TouchableOpacity>
          
          <View className="h-10" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default LabResultsScreen;
