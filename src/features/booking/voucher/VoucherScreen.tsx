// Mirrors lib/voucher.tsx on web — booking summary + QR + confirm actions.
// Uses react-native-qrcode-svg (already in deps).
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
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Calendar, Users, MapPin, Check, CreditCard, Share2 } from 'lucide-react-native';
import { supabase } from '@/core/services/supabaseClient';
import { fetchBookingById, confirmBookingField } from '@/data/repositories/bookingRepository';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

type RouteParams = { bookingId: string };

export function VoucherScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { bookingId } = route.params as RouteParams;

  const [loading, setLoading] = React.useState(true);
  const [booking, setBooking] = React.useState<any>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState<{ arrival?: boolean; payment?: boolean }>({});

  React.useEffect(() => {
    (async () => {
      const b = await fetchBookingById(bookingId);
      setBooking(b);
      setLoading(false);
    })();
  }, [bookingId]);

  const handleConfirm = async (field: 'arrival' | 'payment') => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      Alert.alert('Sign in required', 'Please sign in to confirm.');
      return;
    }
    setBusy(bookingId + field);
    try {
      await confirmBookingField(bookingId, field, session);
      setConfirmed((c) => ({ ...c, [field]: true }));
    } catch (err: any) {
      Alert.alert('Confirmation failed', err?.message || 'Please try again.');
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Booking not found</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }} />
      </View>
    );
  }

  const isOnline = ['stripe', 'gcash', 'card', 'online'].includes((booking.payment_method || '').toLowerCase());
  const totalPHP = booking.total_php || 0;
  const code = (booking.id || '').slice(0, 8).toUpperCase();
  const arrivalDone = confirmed.arrival || booking.client_confirmed_arrival;
  const paymentDone = confirmed.payment || booking.client_confirmed_payment;
  const status = booking.status || 'pending';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: insets.bottom + 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Success banner */}
      <View style={styles.successBanner}>
        <Check size={32} color="#fff" />
        <Text style={styles.successTitle}>Booking Confirmed</Text>
        <Text style={styles.successCode}>Ref: {code}</Text>
      </View>

      {/* Voucher card */}
      <View style={styles.voucher}>
        {/* QR */}
        <View style={styles.qrSection}>
          <QRCode
            value={`tourwise://booking/${bookingId}`}
            size={160}
            backgroundColor="white"
            color={colors.text}
          />
          <Text style={styles.qrHint}>Show this to your driver</Text>
        </View>

        {/* Tour info */}
        <View style={styles.section}>
          <Text style={styles.tourTitle}>{booking.tour_title || 'Tour'}</Text>
          <View style={styles.metaList}>
            <MetaItem icon={Calendar} label="Date" value={booking.tour_date || 'TBD'} />
            <MetaItem icon={Users} label="Guests" value={`${booking.pax || 1} pax`} />
            {booking.resort && <MetaItem icon={MapPin} label="Pickup" value={booking.resort} />}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Payment status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>
              {booking.payment_method === 'cash' ? 'Cash on pickup' : 'Card / Wallet'}
            </Text>
            <Badge variant={booking.payment_status === 'paid' ? 'success' : 'warning'} size="sm">
              {booking.payment_status === 'paid' ? 'Paid' : 'Due'}
            </Badge>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>PHP {totalPHP.toLocaleString()}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Confirmations (shown after the tour) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>After your tour</Text>
          <Text style={styles.confirmHelp}>
            Once your tour is complete, please confirm below to release your driver's payment.
          </Text>

          <ConfirmButton
            label="Driver arrived"
            done={arrivalDone}
            loading={busy === bookingId + 'arrival'}
            onPress={() => handleConfirm('arrival')}
            disabled={status === 'cancelled'}
          />
          {!isOnline && (
            <ConfirmButton
              label="Payment handed (cash)"
              done={paymentDone}
              loading={busy === bookingId + 'payment'}
              onPress={() => handleConfirm('payment')}
              disabled={status === 'cancelled'}
            />
          )}
        </View>

        <View style={styles.divider} />

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {/* share sheet */}}
            activeOpacity={0.75}
          >
            <Share2 size={18} color={colors.primary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.reset({ routes: [{ name: 'TouristShell' }] })}
        activeOpacity={0.75}
      >
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MetaItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <View style={styles.metaItemIcon}>
        <Icon size={16} color={colors.accent} />
      </View>
      <View>
        <Text style={styles.metaItemLabel}>{label}</Text>
        <Text style={styles.metaItemValue}>{value}</Text>
      </View>
    </View>
  );
}

function ConfirmButton({
  label, done, loading, onPress, disabled,
}: {
  label: string;
  done: boolean;
  loading: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.confirmBtn,
        done && styles.confirmBtnDone,
        disabled && !done && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={done || loading || disabled}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator size="small" color={done ? colors.success : colors.textInverse} />
      ) : (
        <>
          {done && <Check size={16} color={colors.success} />}
          <Text style={[
            styles.confirmBtnText,
            done && styles.confirmBtnTextDone,
          ]}>
            {done ? '✓ ' + label : label}
          </Text>
        </>
      )}
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
  errorText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  successBanner: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: '#fff',
    marginTop: spacing.sm,
  },
  successCode: {
    fontSize: fontSize.sm,
    color: '#fff',
    opacity: 0.85,
    marginTop: 2,
  },
  voucher: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  qrSection: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  qrHint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  section: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  tourTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  metaList: {
    gap: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaItemLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  metaItemValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentLabel: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    color: colors.accent,
  },
  confirmHelp: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 18,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  confirmBtnDone: {
    backgroundColor: colors.successBg,
  },
  confirmBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  confirmBtnTextDone: {
    color: colors.success,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  homeBtn: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  homeBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textMuted,
  },
});
