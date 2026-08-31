// Mirrors pages/SupportPage.tsx + data/supportFAQ.ts on web.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function FaqScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FaqScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});
