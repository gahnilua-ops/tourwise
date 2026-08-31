// Driver shell — bottom tab navigator.
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DriverDashboardScreen } from '@/features/driver/dashboard/DriverDashboardScreen';
import { DriverUploadScreen } from '@/features/driver/upload/DriverUploadScreen';
import { AccountScreen } from '@/features/account/AccountScreen';

const Tab = createBottomTabNavigator();

export function DriverTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Trips" component={DriverDashboardScreen} />
      <Tab.Screen name="Upload" component={DriverUploadScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
