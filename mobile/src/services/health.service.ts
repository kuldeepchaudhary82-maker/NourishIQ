import AppleHealthKit, { HealthInputOptions, HealthKitPermissions } from 'react-native-health';
import { Platform } from 'react-native';
import axios from 'axios';

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.RestingHeartRate,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.Weight,
      AppleHealthKit.Constants.Permissions.BodyFatPercentage,
    ],
    write: [],
  },
};

export const syncHealthData = (accessToken: string) => {
  if (Platform.OS !== 'ios') return;

  AppleHealthKit.initHealthKit(permissions, (error) => {
    if (error) {
      console.log('[HealthKit] Init error:', error);
      return;
    }

    const options: HealthInputOptions = {
      startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    };

    // Sync Steps
    AppleHealthKit.getStepCount(options, (err, results) => {
      if (results) {
        axios.post('https://nourishiq-production.up.railway.app/api/log/activity/sync', {
          date: new Date().toISOString(),
          steps: results.value,
          source: 'HEALTH_KIT',
        }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
    });

    // Sync Calories
    AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
      if (results && results.length > 0) {
        axios.post('https://nourishiq-production.up.railway.app/api/log/activity/sync', {
          date: new Date().toISOString(),
          activeCalories: results[0].value,
          source: 'HEALTH_KIT',
        }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
    });
  });
};
