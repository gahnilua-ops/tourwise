import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'numeric';
type Variant = 'default' | 'outlined' | 'filled';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: InputType;
  secureTextEntry?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: Variant;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric' | 'decimal-pad';
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  onSubmitEditing?: () => void;
  testID?: string;
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  type = 'text',
  secureTextEntry = false,
  error,
  helperText,
  disabled,
  required,
  variant = 'default',
  style,
  inputStyle,
  labelStyle,
  maxLength,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  testID,
}: Props) {
  const [focused, setFocused] = React.useState(false);

  const inputContainerStyle: ViewStyle = {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  };

  const variantStyles: Record<Variant, ViewStyle> = {
    default: {
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: error ? colors.error : focused ? colors.primary : colors.border,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: error ? colors.error : focused ? colors.primary : colors.border,
    },
    filled: {
      backgroundColor: colors.surfaceSunken,
      borderWidth: 0,
    },
  };

  const containerStyle = [
    styles.container,
    variantStyles[variant],
    disabled ? styles.disabled : {},
    style,
  ];

  return (
    <View style={containerStyle} testID={testID}>
      <Text
        style={[
          styles.label,
          { color: error ? colors.error : colors.text },
          labelStyle,
        ]}
      >
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          inputContainerStyle,
          inputStyle,
        ]}
        testID={testID ? `${testID}-input` : undefined}
      />
      {(error || helperText) ? (
        <Text
          style={[
            styles.helper,
            { color: error ? colors.error : colors.textMuted },
          ]}
        >
          {error || helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  input: {
    fontSize: fontSize.base,
    color: colors.text,
  },
  helper: {
    fontSize: fontSize.xs,
  },
});
