import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ClipboardList, PlusCircle, BarChart2, User } from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import { View, Text } from 'react-native';

import LogHomeScreen from '../screens/LogHomeScreen';

import PlanHomeScreen from '../screens/PlanHomeScreen';

import ProgressHomeScreen from '../screens/ProgressHomeScreen';

const Tab = createBottomTabNavigator();

const Placeholder = ({ name }: { name: string }) => (
  <View className="flex-1 items-center justify-center bg-background">
    <Text className="text-primary font-bold text-xl">{name} Tab</Text>
  </View>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#1D9E75',
        tabBarInactiveTintColor: '#5F5E5A',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="PlanTab"
        component={PlanHomeScreen}
        options={{
          tabBarLabel: 'Plan',
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="LogTab"
        component={LogHomeScreen}
        options={{
          tabBarLabel: 'Log',
          tabBarIcon: ({ color }) => <PlusCircle size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressHomeScreen}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={() => <Placeholder name="Profile" />}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
