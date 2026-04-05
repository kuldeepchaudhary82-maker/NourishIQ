import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import axios from 'axios';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async (accessToken: string) => {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync({
    projectId: 'your-eas-project-id', // Replace with actual project ID from app.json
  })).data;

  // Send the token to your backend
  try {
    await axios.post('http://localhost:3000/api/notifications/fcm-token', {
      fcmToken: token,
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('FCM token registered:', token);
  } catch (err) {
    console.error('Error registering FCM token:', err);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1D9E75',
    });
  }

  return token;
};

export const handleNotificationResponse = (response: any, navigation: any) => {
  const { type, mealSlot, deepLink } = response.notification.request.content.data;

  if (type === 'MEAL_REMINDER') {
    navigation.navigate('LogMeal', { slot: mealSlot });
  } else if (type === 'DAILY_TIP' || type === 'SUPPLEMENT_REMINDER') {
    navigation.navigate('HomeTab');
  } else if (deepLink) {
    // Handle generic deep links
  }
};
