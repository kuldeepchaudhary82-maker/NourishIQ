import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { ChevronLeft, Info, AlertCircle } from 'lucide-react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryVoronoiContainer, VictoryTheme, VictoryScatter } from 'victory-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const LabMarkerDetailScreen = ({ route, navigation }: any) => {
  const { marker, history } = route.params;
  const markerName = marker;
  const markerUnit = history[0].unit;
  const referenceRange = { min: history[0].referenceMin, max: history[0].referenceMax };
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://nourishiq-production.up.railway.app/api/metrics/charts/lab-marker?name=${markerName}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const formattedData = res.data.map((d: any) => ({
          x: new Date(d.x),
          y: d.y
        }));
        setData(formattedData);
      } catch (error) {
        console.log('Error fetching lab marker data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [markerName]);

  const currentVal = data[data.length - 1]?.y;
  const isOptimal = currentVal >= referenceRange.min && currentVal <= referenceRange.max;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={24} color="#1A2340" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-secondary">{markerName}</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-8">
        <View className="bg-gray-50 p-6 rounded-card mb-8 items-center">
          <Text className="text-textSecondary font-bold text-xs uppercase tracking-widest mb-2">Latest Reading</Text>
          <View className="flex-row items-baseline">
            <Text className={`text-5xl font-bold ${isOptimal ? 'text-primary' : 'text-danger'}`}>{currentVal || '--'}</Text>
            <Text className="text-textSecondary font-medium ml-2">{markerUnit}</Text>
          </View>
          <View className={`mt-4 px-4 py-1.5 rounded-full ${isOptimal ? 'bg-primary/10' : 'bg-danger/10'}`}>
            <Text className={`text-[10px] font-bold uppercase ${isOptimal ? 'text-primary' : 'text-danger'}`}>
              {isOptimal ? 'Optimal Range' : 'Outside Reference'}
            </Text>
          </View>
        </View>

        <Text className="text-secondary font-bold text-lg mb-6">Historical Trend</Text>
        {loading ? (
          <View className="h-64 items-center justify-center">
            <ActivityIndicator color="#1D9E75" />
          </View>
        ) : data.length > 0 ? (
          <View className="items-center mb-8">
            <VictoryChart
              width={Dimensions.get('window').width - 48}
              height={250}
              theme={VictoryTheme.material}
              containerComponent={<VictoryVoronoiContainer labels={({ datum }) => `${datum.y} ${markerUnit}`} />}
            >
              <VictoryAxis
                tickFormat={(x) => `${new Date(x).getMonth() + 1}/${new Date(x).getFullYear().toString().substr(-2)}`}
                style={{
                  axis: { stroke: "#F0F0F0" },
                  tickLabels: { fontSize: 10, fill: "#5F5E5A" },
                  grid: { stroke: "transparent" }
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  axis: { stroke: "transparent" },
                  tickLabels: { fontSize: 10, fill: "#5F5E5A" },
                  grid: { stroke: "#F0F0F0" }
                }}
              />
              <VictoryLine
                data={data}
                style={{
                  data: { stroke: "#1D9E75", strokeWidth: 3 },
                }}
              />
              <VictoryScatter
                data={data}
                size={5}
                style={{ data: { fill: "#1D9E75" } }}
              />
            </VictoryChart>
          </View>
        ) : (
          <View className="h-40 items-center justify-center bg-gray-50 rounded-xl mb-8">
            <Text className="text-textSecondary italic">Insufficient history for this marker.</Text>
          </View>
        )}

        <View className="bg-white border border-gray-100 rounded-card p-6 mb-10 shadow-sm">
          <View className="flex-row items-center gap-2 mb-4">
            <Info size={18} color="#1D9E75" />
            <Text className="text-secondary font-bold">About {markerName}</Text>
          </View>
          <Text className="text-textSecondary text-sm leading-6 mb-6">
            Reference Range: <Text className="text-secondary font-bold">{referenceRange.min} - {referenceRange.max} {markerUnit}</Text>
          </Text>
          <View className="bg-blue-50 p-4 rounded-xl flex-row gap-3">
            <AlertCircle size={20} color="#1A2340" />
            <Text className="flex-1 text-[11px] text-secondary leading-4">
              Fluctuations can be caused by hydration, recent meals, or physical activity. Always consult your health practitioner for a full interpretation of your lab results.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LabMarkerDetailScreen;
