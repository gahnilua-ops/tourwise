// Mirrors ClientPortal.tsx on web — magic-link sign-in via Supabase.
// On success: navigates to RoleGate which routes to TouristShell or DriverShell.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react-native';
import { supabase } from '@/core/services/supabaseClient';
import { Field } from '@/shared/components/Field';
import { Button } from '@/shared/components/Button';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSendLink = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: 'tourwise://auth-callback' },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.inner}>
        {/* Logo / heading */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>TW</Text>
          </View>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>
            Sign in with the email you used to book your tour.
          </Text>
        </View>

        {!sent ? (
          <>
            <Field
              label="Email address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              type="email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={error}
              required
            />
            <Button
              title="Send magic link"
              onPress={handleSendLink}
              disabled={!email.trim()}
              loading={loading}
              size="lg"
              fullWidth
              iconRight={<ArrowRight size={20} color="#fff" />}
            />
            <Text style={styles.hint}>
              We'll email you a secure, instant sign-in link — no password needed.
            </Text>
          </>
        ) : (
          <View style={styles.successWrap}>
            <CheckCircle size={56} color={colors.success} />
            <Text style={styles.successTitle}>Check your email</Text>
            <Text style={styles.successBody}>
              We sent a sign-in link to{' '}
              <Text style={styles.successEmail}>{email}</Text>.
              {'\n'}Tap the link in the email to sign in.
            </Text>
            <TouchableOpacity onPress={() => { setSent(false); setEmail(''); }}>
              <Text style={styles.resendLink}>Didn't get it? Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: fontWeight.extrabold,
    color: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
    textAlign: 'center',
  },
  subheading: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
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
  resendLink: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textAlign: 'center',
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
