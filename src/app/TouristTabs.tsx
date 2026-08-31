// Tourist shell — bottom tab navigator.
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ToursScreen } from '@/features/tours/ToursScreen';
import { SearchScreen } from '@/features/search/SearchScreen';
import { MapScreen } from '@/features/map/MapScreen';
import { WishlistScreen } from '@/features/wishlist/WishlistScreen';
import { AccountScreen } from '@/features/account/AccountScreen';

const Tab = createBottomTabNavigator();

export function TouristTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Tours" component={ToursScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
