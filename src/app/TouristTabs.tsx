// Tourist shell — 6-tab bottom navigator.
// Places added as 2nd tab per Pass 1 decision.
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ToursScreen } from '@/features/tours/ToursScreen';
import { PlacesScreen } from '@/features/places/PlacesScreen';
import { SearchScreen } from '@/features/search/SearchScreen';
import { MapScreen } from '@/features/map/MapScreen';
import { WishlistScreen } from '@/features/wishlist/WishlistScreen';
import { AccountScreen } from '@/features/account/AccountScreen';
import { TabBarIcon } from '@/shared/components/TabBarIcon';

const Tab = createBottomTabNavigator();

export function TouristTabs() {
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
        name="Tours"
        component={ToursScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
        }}
      />
      <Tab.Screen
        name="Places"
        component={PlacesScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="map-pin" color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
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

import { StyleSheet } from 'react-native';
