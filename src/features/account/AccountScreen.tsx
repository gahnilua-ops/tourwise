// Mirrors ClientPortal.tsx on web (post-login state).
// Profile header + sectioned list: My Bookings, Wishlist, Driver Dashboard (if role=driver), Support, Legal, Sign out.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User, Calendar, Heart, Car, MessageSquare, FileText, Bell,
  LogOut, ChevronRight, Star,
} from 'lucide-react-native';
import { supabase } from '@/core/services/supabaseClient';
import { Avatar } from '@/shared/components/Avatar';
import { Badge } from '@/shared/components/Badge';
import { EmptyState } from '@/shared/components/EmptyState';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

export function AccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [session, setSession] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<{ full_name?: string; role?: string } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session) {
        const { data: p } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', data.session.user.id)
          .single();
        setProfile(p);
      }
      setLoading(false);
    })();
  }, []);

  const handleSignOut = async () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.unauthenticatedWrap}>
          <EmptyState
            icon="user"
            title="Sign in to continue"
            message="Access your bookings, wishlist, and driver dashboard."
            actionLabel="Sign in"
            onAction={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    );
  }

  const user = session.user;
  const fullName = profile?.full_name || user.email?.split('@')[0] || 'Guest';
  const role = profile?.role || 'tourist';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <Avatar name={fullName} size="xl" />
        <View style={styles.profileInfo}>
          <View style={styles.profileNameRow}>
            <Text style={styles.profileName}>{fullName}</Text>
            <Badge variant={role === 'driver' ? 'info' : 'success'} size="sm">
              {role === 'driver' ? 'Driver' : 'Tourist'}
            </Badge>
          </View>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
      </View>

      {/* Menu sections */}
      <View style={styles.menu}>
        {/* Bookings & Wishlist */}
        <MenuSection title="My Trips">
          <MenuItem
            icon={Calendar}
            title="My Bookings"
            subtitle="View and manage your reservations"
            onPress={() => navigation.navigate('Booking')}
          />
          <MenuItem
            icon={Heart}
            title="Wishlist"
            subtitle="Your saved tours"
            onPress={() => navigation.navigate('Wishlist')}
          />
          <MenuItem
            icon={Star}
            title="Reviews"
            subtitle="Rate your past tours"
            onPress={() => {/* future */}}
          />
        </MenuSection>

        {/* Driver section */}
        {role === 'driver' && (
          <MenuSection title="Driver">
            <MenuItem
              icon={Car}
              title="Driver Dashboard"
              subtitle="Trips, earnings, and schedule"
              onPress={() => navigation.navigate('DriverShell')}
            />
            <MenuItem
              icon={FileText}
              title="My Documents"
              subtitle="License, permit, vehicle photos"
              onPress={() => {/* future */}}
            />
          </MenuSection>
        )}

        {/* Support */}
        <MenuSection title="Support">
          <MenuItem
            icon={MessageSquare}
            title="Chat with us"
            subtitle="Real-time help"
            onPress={() => navigation.navigate('Chat')}
          />
          <MenuItem
            icon={Bell}
            title="Notifications"
            subtitle="Alerts and updates"
            onPress={() => navigation.navigate('Notifications')}
          />
          <MenuItem
            icon={FileText}
            title="FAQ"
            subtitle="Common questions and answers"
            onPress={() => navigation.navigate('Faq')}
          />
        </MenuSection>

        {/* Legal */}
        <MenuSection title="Legal">
          <MenuItem
            icon={FileText}
            title="Terms of Service"
            onPress={() => navigation.navigate('Legal', { type: 'terms' })}
          />
          <MenuItem
            icon={FileText}
            title="Privacy Policy"
            onPress={() => navigation.navigate('Legal', { type: 'privacy' })}
          />
          <MenuItem
            icon={FileText}
            title="Cancellation Policy"
            onPress={() => navigation.navigate('Legal', { type: 'cancellation' })}
          />
        </MenuSection>

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOut}
          onPress={handleSignOut}
          activeOpacity={0.75}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>{title}</Text>
      <View style={styles.menuSectionContent}>{children}</View>
    </View>
  );
}

function MenuItem({
  icon: Icon,
  title,
  subtitle,
  onPress,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.menuItemIcon}>
        <Icon size={20} color={colors.primary} />
      </View>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unauthenticatedWrap: {
    flex: 1,
    paddingTop: 100,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginBottom: spacing.lg,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  profileName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  profileEmail: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  menu: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  menuSection: {
    gap: spacing.sm,
  },
  menuSectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.sm,
  },
  menuSectionContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  menuItemSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    justifyContent: 'center',
  },
  signOutText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.error,
  },
});
