import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, radius, fontSize, fontWeight, spacing } from '@/app/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const VARIANT_STYLES: Record<Variant, { bg: ViewStyle; text: TextStyle; pressed: ViewStyle }> = {
  primary: {
    bg: { backgroundColor: colors.primary },
    text: { color: colors.textInverse },
    pressed: { backgroundColor: colors.primaryDark },
  },
  accent: {
    bg: { backgroundColor: colors.accent },
    text: { color: colors.textInverse },
    pressed: { backgroundColor: '#4A631F' },
  },
  secondary: {
    bg: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    text: { color: colors.text },
    pressed: { backgroundColor: colors.surfaceSunken },
  },
  ghost: {
    bg: { backgroundColor: 'transparent' },
    text: { color: colors.primary },
    pressed: { backgroundColor: colors.surfaceSunken },
  },
  danger: {
    bg: { backgroundColor: colors.error },
    text: { color: colors.textInverse },
    pressed: { backgroundColor: '#b82b35' },
  },
};

const SIZE_STYLES: Record<Size, { height: number; px: number; fontSize: number; gap: number }> = {
  sm: { height: 36, px: 12, fontSize: 13, gap: 6 },
  md: { height: 48, px: 16, fontSize: 15, gap: 8 },
  lg: { height: 56, px: 24, fontSize: 16, gap: 10 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  iconRight,
  fullWidth,
  style,
  textStyle,
}: Props) {
  const [pressed, setPressed] = React.useState(false);
  const sz = SIZE_STYLES[size];
  const vs = VARIANT_STYLES[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          height: sz.height,
          paddingHorizontal: sz.px,
          borderRadius: radius.xl,
        },
        vs.bg,
        pressed ? vs.pressed : {},
        disabled ? styles.disabled : {},
        fullWidth ? styles.fullWidth : {},
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vs.text.color} />
      ) : (
        <View style={[styles.inner, { gap: sz.gap }]}>
          {icon}
          <Text
            style={[
              styles.text,
              { fontSize: sz.fontSize },
              vs.text,
              disabled ? styles.textDisabled : {},
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconRight}
        </View>
      )}
    </TouchableOpacity>
  );
}

// Brand-gradient button variant (sage → teal)
// Actual gradient requires expo-linear-gradient — falls back to primary tint.
export function GradientButton({ style: outerStyle, ...props }: Props) {
  return (
    <View style={[styles.gradientOuter, outerStyle]}>
      <Button
        variant="primary"
        {...props}
        style={styles.gradientInner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: fontWeight.bold,
    letterSpacing: 0.2,
  },
  disabled: { opacity: 0.5 },
  textDisabled: { opacity: 0.7 },
  fullWidth: { width: '100%' },
  gradientOuter: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  gradientInner: {
    backgroundColor: 'transparent',
  },
});
