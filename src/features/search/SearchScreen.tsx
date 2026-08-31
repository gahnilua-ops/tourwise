// Mirrors SearchAutocomplete.tsx + pages/SearchResults.tsx on web.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SearchScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});
