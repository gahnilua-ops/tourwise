// Mirrors ClientChatWidget.tsx on web.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});
