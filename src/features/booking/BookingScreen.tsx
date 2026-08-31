// Mirrors CartDrawer.tsx + PaymentElement.tsx + StripeProvider.tsx on web.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function BookingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookingScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});
