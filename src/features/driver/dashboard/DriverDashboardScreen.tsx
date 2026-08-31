// Mirrors DriverDashboard.tsx on web — today's trips, earnings.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function DriverDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DriverDashboardScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});
