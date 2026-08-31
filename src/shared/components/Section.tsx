import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '@/app/theme';
import { ChevronRight } from './icons';

interface Props {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  testID?: string;
}

export function Section({
  title,
  children,
  subtitle,
  actionLabel,
  onAction,
  style,
  titleStyle,
  testID,
}: Props) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.header}>
        <Text style={[
          styles.title,
          { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
          titleStyle,
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
        {actionLabel && onAction && (
          <TouchableOpacity onPress={onAction} style={styles.action}>
            <Text style={styles.actionText}>{actionLabel}</Text>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  content: {
    gap: spacing.md,
  },
});
