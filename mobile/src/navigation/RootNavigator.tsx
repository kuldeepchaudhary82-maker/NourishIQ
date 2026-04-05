import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MainTabNavigator from './MainTabNavigator';
import { useAuthStore } from '../store/useAuthStore';
import LogMealScreen from '../screens/LogMealScreen';
import DayPlanScreen from '../screens/DayPlanScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import AIChatScreen from '../screens/AIChatScreen';
import WeightChartScreen from '../screens/WeightChartScreen';

import LabResultsScreen from '../screens/LabResultsScreen';
import LabMarkerDetailScreen from '../screens/LabMarkerDetailScreen';
import UploadLabReportScreen from '../screens/UploadLabReportScreen';
import WeeklyReportsListScreen from '../screens/WeeklyReportsListScreen';
import WeeklyReportDetailScreen from '../screens/WeeklyReportDetailScreen';

import PaywallScreen from '../screens/PaywallScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user.isVerified ? (
          <Stack.Group>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="Paywall" component={PaywallScreen} />
            </Stack.Group>
            <Stack.Screen name="AIChat" component={AIChatScreen} />
            <Stack.Screen name="DayPlan" component={DayPlanScreen} />
            <Stack.Screen name="MealDetail" component={MealDetailScreen} />
            <Stack.Screen name="WeightChart" component={WeightChartScreen} />
            <Stack.Screen name="BodyFatChart" component={BodyFatChartScreen} />
            <Stack.Screen name="LabResults" component={LabResultsScreen} />
            <Stack.Screen name="LabMarkerDetail" component={LabMarkerDetailScreen} />
            <Stack.Screen name="UploadLabReport" component={UploadLabReportScreen} />
            <Stack.Screen name="WeeklyReportsList" component={WeeklyReportsListScreen} />
            <Stack.Screen name="WeeklyReportDetail" component={WeeklyReportDetailScreen} />
            <Stack.Screen name="SupplementPlan" component={() => <View><Text>Supplement Plan Screen</Text></View>} />
            <Stack.Screen name="LogMeal" component={LogMealScreen} />
            <Stack.Screen name="LogSupplement" component={() => <View><Text>Log Supplement Screen</Text></View>} />
            <Stack.Screen name="LogActivity" component={() => <View><Text>Log Activity Screen</Text></View>} />
            <Stack.Screen name="LogWater" component={() => <View><Text>Log Water Screen</Text></View>} />
            <Stack.Screen name="LogDailySummary" component={() => <View><Text>Log Daily Summary Screen</Text></View>} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
ck.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
