import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const SIZE_MAP: Record<Size, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  xxl: 80,
};

interface Props {
  source?: ImageSourcePropType;
  name?: string;
  size?: Size;
  style?: ViewStyle;
  fallbackColor?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name: string): string {
  // Deterministic color from name string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

export function Avatar({
  source,
  name,
  size = 'md',
  style,
  fallbackColor,
}: Props) {
  const dimension = SIZE_MAP[size];
  const fontSizeMap: Record<Size, number> = {
    xs: 8, sm: 11, md: 14, lg: 16, xl: 22, xxl: 28,
  };

  const bgColor = fallbackColor || (name ? getColorFromName(name) : colors.primaryLight);

  if (source) {
    return (
      <Image
        source={source}
        style={[
          styles.image,
          { width: dimension, height: dimension, borderRadius: dimension / 2 },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        { width: dimension, height: dimension, borderRadius: dimension / 2, backgroundColor: bgColor },
        style,
      ]}
    >
      {name && (
        <Text
          style={[
            styles.initials,
            { fontSize: fontSizeMap[size], fontWeight: fontWeight.bold },
          ]}
        >
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {},
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.textInverse,
  },
});
