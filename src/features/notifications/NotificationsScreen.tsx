// Mirrors NotificationBell.tsx + lib/useNotifications.ts on web.
// In-app list of notifications.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Bell, BellOff, ArrowLeft, Calendar, DollarSign, Star } from 'lucide-react-native';
import { supabase } from '@/core/services/supabaseClient';
import { EmptyState } from '@/shared/components/EmptyState';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

interface Notification {
  id: string;
  type: string;
  message: string;
  read_at: string | null;
  created_at: string;
  booking_id?: string;
}

const ICON_MAP: Record<string, any> = {
  booking: Calendar,
  payment: DollarSign,
  review: Star,
  system: Bell,
};

export function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      setNotifications((data as Notification[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const handleMarkRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {notifications.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No notifications yet"
          message="You'll see booking updates, payment confirmations, and trip reminders here."
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onPress={() => handleMarkRead(n.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function NotificationRow({
  notification, onPress,
}: { notification: Notification; onPress: () => void }) {
  const Icon = ICON_MAP[notification.type] || Bell;
  const isUnread = !notification.read_at;
  const timeAgo = getTimeAgo(notification.created_at);

  return (
    <TouchableOpacity
      style={[styles.row, isUnread && styles.rowUnread]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.rowIcon}>
        <Icon size={20} color={isUnread ? colors.primary : colors.textMuted} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowMessage, isUnread && styles.rowMessageUnread]}>
          {notification.message}
        </Text>
        <Text style={styles.rowTime}>{timeAgo}</Text>
      </View>
      {isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  rowUnread: {
    backgroundColor: colors.infoBg,
    borderColor: colors.primary,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
  },
  rowMessage: {
    fontSize: fontSize.base,
    color: colors.text,
  },
  rowMessageUnread: {
    fontWeight: fontWeight.medium,
  },
  rowTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
