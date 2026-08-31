// Mirrors LiveMapWidget.tsx + LocationPickerModal.tsx on web (Leaflet -> react-native-maps).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MapScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});
