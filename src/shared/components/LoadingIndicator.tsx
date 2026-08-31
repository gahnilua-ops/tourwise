import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
