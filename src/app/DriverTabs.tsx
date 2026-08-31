// Driver shell — 3-tab bottom navigator.
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DriverDashboardScreen } from '@/features/driver/dashboard/DriverDashboardScreen';
import { DriverUploadScreen } from '@/features/driver/upload/DriverUploadScreen';
import { AccountScreen } from '@/features/account/AccountScreen';
import { TabBarIcon } from '@/shared/components/TabBarIcon';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0E7C7B',
        tabBarInactiveTintColor: '#736B57',
        tabBarStyle: {
          backgroundColor: '#FBF8F1',
          borderTopColor: '#E6DFCF',
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="Trips"
        component={DriverDashboardScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
      <Tab.Screen
        name="Upload"
        component={DriverUploadScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="upload" color={color} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
