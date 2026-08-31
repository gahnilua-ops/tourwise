// Mirrors DriverUploadPage.tsx on web — docs/photo upload via expo-image-picker.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function DriverUploadScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DriverUploadScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});
