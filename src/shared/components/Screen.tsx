import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/app/theme';

type KeyboardBehavior = 'padding' | 'height' | 'position';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
  keyboardBehavior?: KeyboardBehavior;
  keyboardVerticalOffset?: number;
  backgroundColor?: string;
  safeAreaTop?: boolean;
  safeAreaBottom?: boolean;
}

export function Screen({
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  keyboardBehavior = 'padding',
  keyboardVerticalOffset,
  backgroundColor = colors.background,
  safeAreaTop = true,
  safeAreaBottom = true,
}: Props) {
  const contentStyle: ViewStyle = {
    flexGrow: 1,
    paddingTop: safeAreaTop ? spacing.lg : 0,
    paddingBottom: safeAreaBottom ? spacing.xl : 0,
    paddingHorizontal: spacing.lg,
    ...contentContainerStyle,
  };

  const scrollContent = (
    <ScrollView
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      keyboardShouldPersistTaps="handled"
      style={styles.scrollView}
    >
      {children}
    </ScrollView>
  );

  if (Platform.OS === 'ios') {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor }, style]}
      >
        <KeyboardAvoidingView
          behavior={keyboardBehavior}
          keyboardVerticalOffset={
            keyboardVerticalOffset ?? (safeAreaTop ? spacing.lg : 0)
          }
          style={styles.keyboardAvoiding}
        >
          {scrollContent}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }, style]}
    >
      {scrollContent}
    </SafeAreaView>
  );
}

// Flat-screen variant for tab screens that manage their own scroll
export function ScreenFlat({
  children,
  style,
  backgroundColor = colors.background,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}) {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
});
