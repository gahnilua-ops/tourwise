// Sign-up screen: name + email + role choice (Tourist / Driver).
// On success: writes profile.role and navigates to RoleGate.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Mail, User, ArrowRight, CheckCircle } from 'lucide-react-native';
import { supabase } from '@/core/services/supabaseClient';
import { Field } from '@/shared/components/Field';
import { Button } from '@/shared/components/Button';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

type Role = 'tourist' | 'driver';

export function SignupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<Role>('tourist');
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSendLink = async () => {
    if (!fullName.trim() || !email.trim()) return;
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: 'tourwise://auth-callback',
        data: { full_name: fullName.trim(), role },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.xl,
        paddingBottom: insets.bottom + spacing.xl,
        paddingHorizontal: spacing.lg,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.subheading}>
            Join TourWise to discover and book Bohol tours.
          </Text>
        </View>

        {!sent ? (
          <>
            <Field
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Juan dela Cruz"
              autoCapitalize="words"
              required
            />
            <Field
              label="Email address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              type="email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              required
            />

            {/* Role selector */}
            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>I want to…</Text>
              <View style={styles.roleCards}>
                <RoleCard
                  title="Book tours"
                  subtitle="Discover and reserve experiences"
                  selected={role === 'tourist'}
                  onPress={() => setRole('tourist')}
                />
                <RoleCard
                  title="Offer tours"
                  subtitle="Register as a driver or operator"
                  selected={role === 'driver'}
                  onPress={() => setRole('driver')}
                />
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              title="Continue with email"
              onPress={handleSendLink}
              disabled={!fullName.trim() || !email.trim()}
              loading={loading}
              size="lg"
              fullWidth
              iconRight={<ArrowRight size={20} color="#fff" />}
            />

            <Text style={styles.hint}>
              By continuing you agree to our Terms of Service and Privacy Policy.
            </Text>
          </>
        ) : (
          <View style={styles.successWrap}>
            <CheckCircle size={56} color={colors.success} />
            <Text style={styles.successTitle}>Check your email</Text>
            <Text style={styles.successBody}>
              We sent a sign-in link to{' '}
              <Text style={styles.successEmail}>{email}</Text>.
              {'\n'}Tap the link to complete sign-up.
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function RoleCard({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.roleCard, selected && styles.roleCardSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.roleCardRadio}>
        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
      </View>
      <View style={styles.roleCardContent}>
        <Text style={[styles.roleCardTitle, selected && styles.roleCardTitleSelected]}>
          {title}
        </Text>
        <Text style={styles.roleCardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: 28,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
  },
  subheading: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    lineHeight: 22,
  },
  roleSection: {
    gap: spacing.sm,
  },
  roleLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  roleCards: {
    gap: spacing.sm,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.infoBg,
  },
  roleCardRadio: {
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  roleCardContent: {
    flex: 1,
  },
  roleCardTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  roleCardTitleSelected: {
    color: colors.primary,
  },
  roleCardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.error,
    textAlign: 'center',
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    textAlign: 'center',
    lineHeight: 18,
  },
  successWrap: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  successTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  successBody: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  successEmail: {
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingTop: spacing.lg,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  footerLink: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
});
