import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '@/app/theme';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  size?: Size;
  fullScreen?: boolean;
  message?: string;
  style?: any;
}

const SIZE_MAP: Record<Size, number> = {
  sm: 20,
  md: 28,
  lg: 40,
  xl: 56,
};

export function LoadingIndicator({
  size = 'lg',
  fullScreen = false,
  message,
  style,
}: Props) {
  const indicatorSize = SIZE_MAP[size];

  const content = (
    <View style={styles.container}>
      <ActivityIndicator
        size={size === 'sm' ? 'small' : size === 'md' ? 'small' : 'large'}
        color={colors.primary}
        style={{ marginBottom: message ? spacing.md : 0 }}
      />
      {message && (
        <Text style={[
          styles.message,
          { fontSize: size === 'sm' ? fontSize.sm : fontSize.base },
        ]}>
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, style]}>
        {content}
      </View>
    );
  }

  return <View style={style}>{content}</View>;
}

// Skeleton placeholder for loading lists/cards
export function Skeleton({ width = '100%', height, style }: { width?: string | number; height: number; style?: any }) {
  return (
    <View style={[styles.skeleton, { width, height }, style]} />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  skeleton: {
    backgroundColor: colors.surfaceSunken,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
