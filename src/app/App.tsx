import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '@/core/errors/ErrorBoundary';
import { RootNavigator } from './RootNavigator';

const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;

export default function App() {
  return (
    <ErrorBoundary>
      <StripeProvider publishableKey={stripePublishableKey}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <RootNavigator />
        </NavigationContainer>
      </StripeProvider>
    </ErrorBoundary>
  );
}
