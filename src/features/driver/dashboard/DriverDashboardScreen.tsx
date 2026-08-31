// Mirrors DriverDashboard.tsx on web — today's trips, earnings, notifications, chat.
// Tabbed: Overview | Trips | Earnings | Notifications | Chat
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Calendar, DollarSign, Bell, MessageSquare, Navigation,
  Phone, MapPin, CheckCircle, Clock, ArrowLeft, ChevronRight,
  TrendingUp, ShieldCheck, Car, Wallet, BarChart2, LocateIcon,
} from 'lucide-react-native';
import { supabase } from '@/core/services/supabaseClient';
import { fetchAssignedTrips } from '@/data/repositories/driverRepository';
import { Avatar } from '@/shared/components/Avatar';
import { Badge } from '@/shared/components/Badge';
import { EmptyState } from '@/shared/components/EmptyState';
import { Button } from '@/shared/components/Button';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

type Tab = 'overview' | 'trips' | 'earnings' | 'notifications' | 'chat';

// Trip type matching the database + joined booking
interface Trip {
  id: string;
  booking_id: string;
  driver_id: string;
  pickup_time: string;
  status: 'assigned' | 'in_progress' | 'completed';
  booking?: {
    id: string;
    tour_title: string;
    guest_name?: string;
    guest_email?: string;
    phone?: string;
    resort?: string;
    resort_lat?: number | null;
    resort_lng?: number | null;
    pax: number;
    tour_date?: string;
    pickup_time?: string;
    status: string;
    net_commission_amount?: number;
    supplier_amount?: number;
    driver_id?: string;
    driver_completed?: boolean;
    driver_status?: string;
    client_confirmed_arrival?: boolean;
    client_confirmed_payment?: boolean;
    payment_method?: string;
    addons?: { id: string; label: string; price_php: number }[];
  };
}

export function DriverDashboardScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState<Tab>('overview');
  const [loading, setLoading] = React.useState(true);
  const [driver, setDriver] = React.useState<any>(null);
  const [trips, setTrips] = React.useState<Trip[]>([]);
  const [notifications, setNotifications] = React.useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      const { data: d } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      setDriver(d);
      const tripsData = await fetchAssignedTrips(d?.id);
      setTrips(tripsData);
      setLoading(false);
    })();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayTrips = trips.filter((t) => t.booking?.tour_date === today);
  const upcomingTrips = trips.filter((t) => t.booking?.tour_date && t.booking.tour_date > today && t.status !== 'completed');
  const completedTrips = trips.filter((t) => t.status === 'completed');
  const totalEarnings = completedTrips.reduce((sum, t) => sum + (t.booking?.net_commission_amount || 0), 0);
  // Fixed: compare against booking.status === 'confirmed' instead of trip.status
  const pendingEarnings = trips
    .filter((t) => t.booking?.status === 'confirmed' && !t.booking?.driver_completed)
    .reduce((sum, t) => sum + (t.booking?.net_commission_amount || 0), 0);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!driver) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <EmptyState
          icon="truck"
          title="Driver not registered"
          message="Complete your driver registration to access the dashboard."
          actionLabel="Register"
          onAction={() => navigation.navigate('DriverRegister')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerLeft}>
          <Avatar name={driver.driver_name || 'Driver'} size="md" />
          <View>
            <Text style={styles.headerName}>{driver.driver_name}</Text>
            <Text style={styles.headerRole}>
              {driver.type === 'operator' ? 'Operator' : 'Driver'} • {driver.vehicle_type}
            </Text>
          </View>
        </View>
        <Badge variant={driver.status === 'approved' ? 'success' : 'warning'} size="sm">
          {driver.status}
        </Badge>
      </View>

      {/* Tab bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tabBtn, activeTab === t.id && styles.tabBtnActive]}
            onPress={() => setActiveTab(t.id)}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabBtnText, activeTab === t.id && styles.tabBtnTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab content */}
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Stats cards */}
            <View style={styles.statsRow}>
              <StatCard
                icon={Calendar}
                label="Today's Trips"
                value={todayTrips.length}
                color={colors.primary}
              />
              <StatCard
                icon={Wallet}
                label="Available"
                value={`PHP ${pendingEarnings.toLocaleString()}`}
                color={colors.success}
              />
              <StatCard
                icon={TrendingUp}
                label="Total Earned"
                value={`PHP ${totalEarnings.toLocaleString()}`}
                color={colors.accent}
              />
            </View>

            {/* Next trip countdown */}
            {todayTrips.length > 0 && (
              <View style={styles.nextTrip}>
                <Text style={styles.nextTripLabel}>Next Trip</Text>
                {todayTrips.map((trip) => (
                  <NextTripCard key={trip.id} trip={trip} onNavigate={() => navigation.navigate('Map')} />
                ))}
              </View>
            )}

            {/* Upcoming trips list */}
            {upcomingTrips.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                {upcomingTrips.slice(0, 3).map((trip) => (
                  <TripListItem key={trip.id} trip={trip} />
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'trips' && (
          <View style={styles.tabContent}>
            {trips.length === 0 ? (
              <EmptyState icon="calendar" title="No trips assigned" message="Trips will appear here once the admin assigns them to you." />
            ) : (
              <FlatList
                data={trips}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TripListItem trip={item} />}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        )}

        {activeTab === 'earnings' && (
          <View style={styles.tabContent}>
            <EarningsSummary
              available={pendingEarnings}
              total={totalEarnings}
              thisMonth={completedTrips
                .filter((t) => {
                  const d = new Date(t.booking?.tour_date || '');
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                })
                .reduce((s, t) => s + (t.booking?.net_commission_amount || 0), 0)
              }
            />
            <Text style={styles.sectionTitle}>Commission Breakdown</Text>
            <View style={styles.earningsList}>
              {completedTrips.map((trip) => (
                <EarningsRow key={trip.id} trip={trip} />
              ))}
            </View>
          </View>
        )}

        {activeTab === 'notifications' && (
          <View style={styles.tabContent}>
            {notifications.length === 0 ? (
              <EmptyState icon="bell" title="No notifications" message="Trip assignments and updates will appear here." />
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationItem notification={item} />}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        )}

        {activeTab === 'chat' && (
          <View style={styles.tabContent}>
            <EmptyState
              icon="chat"
              title="Chat not yet implemented"
              message="Real-time driver↔guest chat coming soon."
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: Calendar },
  { id: 'trips', label: 'Trips', icon: Calendar },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
];

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <View style={[styles.statCard, { borderColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function NextTripCard({ trip, onNavigate }: { trip: Trip; onNavigate: () => void }) {
  const booking = trip.booking;
  const pickupMs = booking?.tour_date && booking?.pickup_time
    ? new Date(`${booking.tour_date}T${booking.pickup_time}:00`).getTime()
    : null;
  const countdown = pickupMs ? Math.max(0, pickupMs - Date.now()) : null;
  const formatted = countdown ? formatCountdown(countdown) : 'Time TBD';

  return (
    <View style={styles.nextTripCard}>
      <View style={styles.nextTripMain}>
        <View>
          <Text style={styles.nextTripTitle}>{booking?.tour_title || 'Tour'}</Text>
          <Text style={styles.nextTripGuest}>{booking?.guest_name || 'Guest'} • {booking?.pax || 1} pax</Text>
        </View>
        <View style={styles.nextTripCountdown}>
          <Text style={styles.nextTripTime}>{formatted}</Text>
          <Text style={styles.nextTripTimeLabel}>until pickup</Text>
        </View>
      </View>
      <View style={styles.nextTripActions}>
        <TouchableOpacity style={styles.nextTripActionBtn} onPress={onNavigate} activeOpacity={0.75}>
          <MapPin size={16} color="#fff" />
          <Text style={styles.nextTripActionText}>Navigate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextTripActionBtnSecondary} onPress={() => Alert.alert('Call', `Call ${booking?.phone || 'guest'}?`)} activeOpacity={0.75}>
          <Phone size={16} color={colors.primary} />
          <Text style={styles.nextTripActionTextSecondary}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TripListItem({ trip }: { trip: Trip }) {
  const booking = trip.booking;
  const isToday = booking?.tour_date === new Date().toISOString().split('T')[0];
  return (
    <TouchableOpacity style={[styles.tripCard, isToday && styles.tripCardToday]} activeOpacity={0.75}>
      <View style={styles.tripCardHeader}>
        <Text style={styles.tripCardTitle}>{booking?.tour_title || 'Tour'}</Text>
        <Badge variant={trip.status === 'completed' ? 'success' : trip.status === 'assigned' ? 'info' : 'warning'} size="sm">
          {trip.status}
        </Badge>
      </View>
      <View style={styles.tripCardMeta}>
        <MetaRow icon={Calendar} text={booking?.tour_date ? formatDate(booking.tour_date) : 'TBD'} />
        <MetaRow icon={Clock} text={booking?.pickup_time || 'Time TBD'} />
        <MetaRow icon={MapPin} text={booking?.resort || 'Pickup TBD'} />
      </View>
      <View style={styles.tripCardFooter}>
        <Text style={styles.tripCardGuest}>{booking?.guest_name || 'Guest'} • {booking?.pax || 1} pax</Text>
        <Text style={styles.tripCardCommission}>
          PHP {(booking?.net_commission_amount || 0).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function EarningsSummary({ available, total, thisMonth }: { available: number; total: number; thisMonth: number }) {
  return (
    <View style={styles.earningsSummary}>
      <EarningsStat label="This Month" value={`PHP ${thisMonth.toLocaleString()}`} color={colors.primary} />
      <EarningsStat label="Available" value={`PHP ${available.toLocaleString()}`} color={colors.success} />
      <EarningsStat label="Total Earned" value={`PHP ${total.toLocaleString()}`} color={colors.accent} />
    </View>
  );
}

function EarningsStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.earningsStat}>
      <Text style={styles.earningsStatLabel}>{label}</Text>
      <Text style={[styles.earningsStatValue, { color }]}>{value}</Text>
    </View>
  );
}

function EarningsRow({ trip }: { trip: Trip }) {
  const booking = trip.booking;
  return (
    <View style={styles.earningsRow}>
      <View>
        <Text style={styles.earningsRowTitle}>{booking?.tour_title || 'Tour'}</Text>
        <Text style={styles.earningsRowDate}>{formatDate(booking?.tour_date || '')} • {booking?.guest_name || 'Guest'}</Text>
      </View>
      <View style={styles.earningsRowAmount}>
        <Text style={styles.earningsRowAmountLabel}>Commission</Text>
        <Text style={styles.earningsRowAmountValue}>
          PHP {(booking?.net_commission_amount || 0).toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

function NotificationItem({ notification }: { notification: any }) {
  return (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{notification.message}</Text>
      <Text style={styles.notificationTime}>
        {new Date(notification.created_at).toLocaleDateString()}
      </Text>
    </View>
  );
}

function MetaRow({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.metaRow}>
      <Icon size={14} color={colors.textMuted} />
      <Text style={styles.metaRowText}>{text}</Text>
    </View>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' });
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Now';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
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
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  headerRole: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  tabBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tabBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSunken,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
  },
  tabBtnTextActive: {
    color: '#fff',
  },
  tabContent: {
    gap: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  nextTrip: {
    marginTop: spacing.md,
  },
  nextTripLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  nextTripCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  nextTripMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextTripTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  nextTripGuest: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  nextTripCountdown: {
    alignItems: 'flex-end',
  },
  nextTripTime: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  nextTripTimeLabel: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  nextTripActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  nextTripActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  nextTripActionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  nextTripActionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  nextTripActionTextSecondary: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tripCardToday: {
    borderColor: colors.primary,
    backgroundColor: colors.infoBg,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tripCardTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  tripCardMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaRowText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  tripCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  tripCardGuest: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  tripCardCommission: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  earningsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  earningsStat: {
    flex: 1,
    alignItems: 'center',
  },
  earningsStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 2,
  },
  earningsStatValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  earningsList: {
    gap: spacing.sm,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  earningsRowTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  earningsRowDate: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  earningsRowAmount: {
    alignItems: 'flex-end',
  },
  earningsRowAmountLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  earningsRowAmountValue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  notificationItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  notificationMessage: {
    fontSize: fontSize.base,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
