import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTooltip, VictoryVoronoiContainer, VictoryTheme } from 'victory-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const WeightChartScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [range, setRange] = useState('3M');
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://nourishiq-production.up.railway.app/api/metrics/charts/weight?range=${range}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        // Ensure x is a Date object for Victory
        const formattedData = res.data.map((d: any) => ({
          x: new Date(d.x),
          y: d.y
        }));
        setData(formattedData);
      } catch (error) {
        console.log('Error fetching chart data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={24} color="#1A2340" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-secondary">Weight Trend</Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        <View className="flex-row bg-gray-50 p-1 rounded-xl mb-8">
          {['4W', '3M', '6M', '1Y'].map((r) => (
            <TouchableOpacity 
              key={r}
              className={`flex-1 py-2 rounded-lg items-center ${range === r ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setRange(r)}
            >
              <Text className={`text-xs font-bold ${range === r ? 'text-primary' : 'text-textSecondary'}`}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center h-64">
            <ActivityIndicator color="#1D9E75" />
          </View>
        ) : data.length > 0 ? (
          <View className="items-center">
            <VictoryChart
              width={Dimensions.get('window').width - 48}
              height={300}
              theme={VictoryTheme.material}
              containerComponent={<VictoryVoronoiContainer labels={({ datum }) => `${datum.y} kg`} />}
            >
              <VictoryAxis
                tickFormat={(x) => `${new Date(x).getDate()}/${new Date(x).getMonth() + 1}`}
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
                animate={{
                  duration: 1000,
                  onLoad: { duration: 500 }
                }}
              />
            </VictoryChart>
            
            <View className="mt-8 bg-gray-50 p-6 rounded-card w-full">
              <View className="flex-row justify-between mb-4">
                <Text className="text-textSecondary">Initial Weight</Text>
                <Text className="text-secondary font-bold">{data[0]?.y} kg</Text>
              </View>
              <View className="flex-row justify-between mb-4">
                <Text className="text-textSecondary">Current Weight</Text>
                <Text className="text-secondary font-bold">{data[data.length - 1]?.y} kg</Text>
              </View>
              <View className="flex-row justify-between pt-4 border-t border-gray-200">
                <Text className="text-textSecondary font-bold">Net Change</Text>
                <Text className="text-primary font-bold">{(data[data.length - 1]?.y - data[0]?.y).toFixed(1)} kg</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center h-64">
            <Text className="text-textSecondary">No data available for this range.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WeightChartScreen;
