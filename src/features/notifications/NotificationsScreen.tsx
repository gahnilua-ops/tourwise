// Mirrors NotificationBell.tsx + lib/useNotifications.ts on web (push via expo-notifications).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NotificationsScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});
