import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, fontSize, fontWeight, radius } from '@/app/theme';
import { Button } from './Button';

type IconName = 'search' | 'heart' | 'map-pin' | 'calendar' | 'bag' | 'user' | 'bell' | 'chat' | 'star' | 'inbox' | 'truck' | 'credit-card';

const ICON_MAP: Record<IconName, any> = {
  search: 'Search',
  heart: 'Heart',
  'map-pin': 'MapPin',
  calendar: 'Calendar',
  bag: 'ShoppingCart',
  user: 'User',
  bell: 'Bell',
  chat: 'MessageSquare',
  star: 'Star',
  inbox: 'Inbox',
  truck: 'Car',
  'credit-card': 'CreditCard',
};

export function EmptyState({
  icon = 'inbox',
  title,
  message,
  actionLabel,
  onAction,
  style,
  iconSize = 64,
}: {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  iconSize?: number;
}) {
  const IconComponent = ICON_MAP[icon] ? require('./icons')[ICON_MAP[icon]] : null;

  return (
    <View style={[styles.container, style]}>
      {IconComponent && (
        <View style={styles.iconWrapper}>
          <IconComponent size={iconSize} color={colors.borderStrong} />
        </View>
      )}
      <Text style={[
        styles.title,
        { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
      ]}>
        {title}
      </Text>
      {message && (
        <Text style={[
          styles.message,
          { fontSize: fontSize.base },
        ]}>
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="md"
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  iconWrapper: {
    opacity: 0.6,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: spacing.sm,
    minWidth: 200,
  },
});
