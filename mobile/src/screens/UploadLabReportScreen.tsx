import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { ChevronLeft, Upload, FileText, CheckCircle2, X } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const UploadLabReportScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [extractedData, setExtractedData] = useState<any[] | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setFile(result.assets[0]);
      }
    } catch (err) {
      console.log('Error picking document:', err);
    }
  };

  const uploadAndProcess = async () => {
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('report', {
      uri: file.uri,
      name: file.name,
      type: 'application/pdf',
    } as any);

    try {
      const res = await axios.post('https://nourishiq-production.up.railway.app/api/metrics/lab-results/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setExtractedData(res.data.data);
    } catch (error: any) {
      Alert.alert('Processing Error', error.response?.data?.message || 'Failed to extract data from the PDF');
    } finally {
      setLoading(false);
    }
  };

  const confirmResults = async () => {
    if (!extractedData) return;
    setLoading(true);

    try {
      await axios.post('https://nourishiq-production.up.railway.app/api/metrics/lab-results/confirm', {
        results: extractedData,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      Alert.alert('Success', 'Lab results have been saved to your profile.');
      navigation.replace('LabResults');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to save results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={24} color="#1A2340" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-secondary">Upload Lab Report</Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        {!extractedData ? (
          <View className="flex-1">
            <Text className="text-textSecondary mb-8 leading-6">
              Upload your blood test or lab report in PDF format. Our AI will automatically extract the biomarkers for you to review.
            </Text>

            <TouchableOpacity 
              className="w-full aspect-square max-h-64 border-2 border-dashed border-gray-200 rounded-[32px] items-center justify-center bg-gray-50 mb-8"
              onPress={pickDocument}
            >
              {file ? (
                <View className="items-center">
                  <FileText size={48} color="#1D9E75" />
                  <Text className="text-secondary font-bold mt-4 px-8 text-center" numberOfLines={1}>
                    {file.name}
                  </Text>
                  <TouchableOpacity onPress={() => setFile(null)} className="mt-4">
                    <Text className="text-danger font-bold text-sm">Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="items-center">
                  <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-4">
                    <Upload size={32} color="#1D9E75" />
                  </View>
                  <Text className="text-secondary font-bold">Select PDF Report</Text>
                  <Text className="text-textSecondary text-xs mt-1">Max file size 5MB</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              className={`h-14 rounded-xl items-center justify-center shadow-md ${!file || loading ? 'bg-gray-200' : 'bg-primary'}`}
              onPress={uploadAndProcess}
              disabled={!file || loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Extract Biomarkers</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-bold text-secondary">Review Extracted Data</Text>
              <TouchableOpacity onPress={() => setExtractedData(null)}>
                <X size={20} color="#5F5E5A" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 mb-6" showsVerticalScrollIndicator={false}>
              {extractedData.map((item, index) => (
                <View key={index} className="bg-gray-50 p-4 rounded-xl mb-3 flex-row justify-between items-center border border-gray-100">
                  <View className="flex-1">
                    <Text className="text-secondary font-bold text-sm">{item.markerName}</Text>
                    <Text className="text-textSecondary text-[10px] mt-0.5">
                      Range: {item.referenceMin || 'N/A'} - {item.referenceMax || 'N/A'} {item.unit}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-primary font-bold text-sm">{item.value} {item.unit}</Text>
                    <View className="flex-row items-center mt-1">
                      <CheckCircle2 size={10} color="#1D9E75" />
                      <Text className="text-[10px] text-primary font-medium ml-1">Verified</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              className={`h-14 rounded-xl items-center justify-center shadow-md mb-4 ${loading ? 'bg-gray-200' : 'bg-primary'}`}
              onPress={confirmResults}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Confirm & Save Results</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UploadLabReportScreen;
