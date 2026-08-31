// Root stack: RoleGate decides whether the user lands in TouristTabs or
// DriverTabs. Shared screens (support, legal, voucher, booking) are pushed
// on top of either shell from a stack, not tabs.
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoleGate } from './RoleGate';
import { TouristTabs } from './TouristTabs';
import { DriverTabs } from './DriverTabs';
import { LoginScreen } from '@/features/auth/login/LoginScreen';
import { SignupScreen } from '@/features/auth/signup/SignupScreen';
import { DriverRegisterScreen } from '@/features/driver/register/DriverRegisterScreen';
import { BookingScreen } from '@/features/booking/BookingScreen';
import { VoucherScreen } from '@/features/booking/voucher/VoucherScreen';
import { FaqScreen } from '@/features/support/faq/FaqScreen';
import { ChatScreen } from '@/features/support/chat/ChatScreen';
import { LegalScreen } from '@/features/legal/LegalScreen';
import { NotificationsScreen } from '@/features/notifications/NotificationsScreen';
import { TourDetailScreen } from '@/features/tours/TourDetailScreen';
import { PlaceDetailScreen } from '@/features/places/PlaceDetailScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="RoleGate">
      <Stack.Screen name="RoleGate" component={RoleGate} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="DriverRegister" component={DriverRegisterScreen} />

      <Stack.Screen name="TouristShell" component={TouristTabs} options={{ headerShown: false }} />
      <Stack.Screen name="DriverShell" component={DriverTabs} options={{ headerShown: false }} />

      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Voucher" component={VoucherScreen} />
      <Stack.Screen name="Faq" component={FaqScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Legal" component={LegalScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      <Stack.Screen name="TourDetail" component={TourDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
