// Mirrors lib/voucher.tsx + qrcode dep on web — shows QR voucher via react-native-qrcode-svg.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function VoucherScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VoucherScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});
