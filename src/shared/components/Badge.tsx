import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

type Variant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'featured'
  | 'package'
  | 'bestseller'
  | 'category';

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  dot?: boolean; // small leading indicator dot
}

const VARIANT_STYLES: Record<Variant, { bg: ViewStyle; text: TextStyle; dotColor?: string }> = {
  default: { bg: { backgroundColor: colors.surfaceSunken }, text: { color: colors.textMuted } },
  success: { bg: { backgroundColor: colors.successBg }, text: { color: colors.success }, dotColor: colors.success },
  warning: { bg: { backgroundColor: colors.warningBg }, text: { color: colors.warning }, dotColor: colors.warning },
  error: { bg: { backgroundColor: colors.errorBg }, text: { color: colors.error }, dotColor: colors.error },
  info: { bg: { backgroundColor: colors.infoBg }, text: { color: colors.info }, dotColor: colors.info },
  featured: { bg: { backgroundColor: '#5C7A2E' }, text: { color: colors.textInverse }, dotColor: '#5C7A2E' },
  package: { bg: { backgroundColor: '#FCBD00' }, text: { color: '#2c3400' }, dotColor: '#FCBD00' },
  bestseller: { bg: { backgroundColor: '#FCBD00' }, text: { color: '#2c3400' }, dotColor: '#FCBD00' },
  category: { bg: { backgroundColor: colors.surfaceMuted }, text: { color: colors.primary } },
};

const SIZE_STYLES = {
  sm: { px: spacing.sm, py: 2, fontSize: fontSize.xs, gap: spacing.xs, dotSize: 4 },
  md: { px: spacing.md, py: spacing.xs, fontSize: fontSize.sm, gap: spacing.sm, dotSize: 6 },
  lg: { px: spacing.lg, py: spacing.sm, fontSize: fontSize.base, gap: spacing.md, dotSize: 8 },
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
  dot,
}: Props) {
  const vs = VARIANT_STYLES[variant];
  const sz = SIZE_STYLES[size];

  return (
    <View
      style={[
        styles.base,
        { paddingHorizontal: sz.px, paddingVertical: sz.py, gap: sz.gap, borderRadius: radius.pill },
        vs.bg,
        style,
      ]}
    >
      {dot && vs.dotColor && (
        <View style={[{ width: sz.dotSize, height: sz.dotSize, borderRadius: sz.dotSize / 2, backgroundColor: vs.dotColor }, styles.dot]} />
      )}
      <Text
        style={[
          styles.text,
          { fontSize: sz.fontSize, fontWeight: fontWeight.bold },
          vs.text,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

// Convenience: StatusBadge for booking/driver statuses
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Variant> = {
    pending: 'warning',
    confirmed: 'success',
    completed: 'success',
    cancelled: 'error',
    rejected: 'error',
    in_progress: 'info',
    assigned: 'info',
    pending_verification: 'warning',
  };
  return <Badge variant={map[status] || 'default'} size="sm">{status.replace('_', ' ')}</Badge>;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    letterSpacing: 0.3,
  },
  dot: {
    marginTop: 1, // visual center align with text
  },
});
