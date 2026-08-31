import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, radius, shadow, spacing } from '@/app/theme';

type Variant = 'default' | 'outlined' | 'elevated' | 'sunken' | 'gradient';

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  padding?: keyof typeof spacing | number;
  style?: ViewStyle;
  onPress?: () => void;
  testID?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
  onPress,
  testID,
}: Props) {
  const pad = typeof padding === 'number' ? padding : spacing[padding];

  const baseStyle: ViewStyle = {
    borderRadius: radius.xl,
    padding: pad,
  };

  const variantStyles: Record<Variant, ViewStyle> = {
    default: {
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    elevated: {
      backgroundColor: colors.surface,
      ...shadow.md,
    },
    sunken: {
      backgroundColor: colors.surfaceSunken,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    gradient: {
      backgroundColor: colors.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primaryLight,
    },
  };

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        activeOpacity={0.75}
        style={[baseStyle, variantStyles[variant], style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} style={[baseStyle, variantStyles[variant], style]}>
      {children}
    </View>
  );
}

// Specialized: TourCard container (used by ToursScreen/TourDetail)
export function TourCardContainer({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        styles.tourCard,
        { overflow: 'hidden' },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tourCard: {
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
