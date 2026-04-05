import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, ChevronLeft, Bot } from 'lucide-react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const AIChatScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollViewRef = useRef<any>();
  const accessToken = useAuthStore((state) => state.accessToken);

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/api/coach/chat', {
        message: inputText,
        conversationId
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const botReply = { role: 'assistant', content: res.data.reply };
      setMessages(prev => [...prev, botReply]);
      setConversationId(res.data.conversationId);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#1A2340" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="font-bold text-secondary">NourishIQ Coach</Text>
          <Text className="text-[10px] text-primary font-bold uppercase">Always Active</Text>
        </View>
        <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
          <Bot size={20} color="#1D9E75" />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-6 py-4"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 && (
            <View className="items-center mt-12">
              <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
                <Bot size={32} color="#5F5E5A" />
              </View>
              <Text className="text-secondary font-bold text-lg">Hi! I'm your health coach.</Text>
              <Text className="text-textSecondary text-center mt-2 px-8">
                Ask me anything about your nutrition plan, supplements, or how to improve your lab markers.
              </Text>
            </View>
          )}

          {messages.map((msg, idx) => (
            <View 
              key={idx} 
              className={`mb-4 max-w-[85%] ${msg.role === 'user' ? 'self-end bg-primary rounded-2xl rounded-tr-none' : 'self-start bg-gray-100 rounded-2xl rounded-tl-none'}`}
            >
              <View className="p-4">
                <Text className={msg.role === 'user' ? 'text-white' : 'text-textPrimary'}>
                  {msg.content}
                </Text>
              </View>
            </View>
          ))}
          {loading && (
            <View className="self-start bg-gray-100 rounded-2xl rounded-tl-none p-4 mb-4">
              <Text className="text-textSecondary italic">Thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View className="px-6 py-4 border-t border-gray-100 flex-row items-center">
          <TextInput
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 h-12 px-4 rounded-full border border-gray-200"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            className={`ml-4 w-12 h-12 rounded-full items-center justify-center ${inputText.trim() ? 'bg-primary' : 'bg-gray-200'}`}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AIChatScreen;
