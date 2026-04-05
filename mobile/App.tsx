import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, handleNotificationResponse } from './src/services/notification.service';
import { useAuthStore } from './src/store/useAuthStore';

export default function App() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    if (accessToken) {
      registerForPushNotificationsAsync(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationResponse(response, navigationRef.current);
    });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}
