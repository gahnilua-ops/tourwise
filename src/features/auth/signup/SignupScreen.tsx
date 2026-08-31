// Sign-up screen (tourist or driver, role chosen or assigned post-signup).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SignupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SignupScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});
