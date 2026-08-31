// Mirrors CartDrawer.tsx + PaymentElement.tsx on web.
// Guest info form + payment method selector + Stripe payment flow.
// Navigates to VoucherScreen on success.
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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, Users, CreditCard, Banknote, ChevronDown } from 'lucide-react-native';
import { supabase } from '@/core/services/supabaseClient';
import { fetchTourById } from '@/data/repositories/toursRepository';
import { createBooking, createPaymentIntent } from '@/data/repositories/bookingRepository';
import { Field } from '@/shared/components/Field';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

type RouteParams = { tourId?: string };
type PaymentMethod = 'stripe' | 'gcash' | 'cash';

export function BookingScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const tourId = (route.params as RouteParams)?.tourId;

  const [tour, setTour] = React.useState<any>(null);
  const [loadingTour, setLoadingTour] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  // Form state
  const [guestName, setGuestName] = React.useState('');
  const [guestEmail, setGuestEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [tourDate, setTourDate] = React.useState('');
  const [pax, setPax] = React.useState('1');
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('stripe');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!tourId) { setLoadingTour(false); return; }
    (async () => {
      const t = await fetchTourById(tourId);
      setTour(t);
      setLoadingTour(false);
    })();
  }, [tourId]);

  const totalCents = tour ? parseInt(pax) * tour.price * 100 : 0;
  const totalPHP = Math.round(totalCents / 100);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!guestName.trim()) e.guestName = 'Required';
    if (!guestEmail.trim() || !guestEmail.includes('@')) e.guestEmail = 'Valid email required';
    if (!phone.trim()) e.phone = 'Required';
    if (!tourDate.trim()) e.tourDate = 'Required (YYYY-MM-DD)';
    if (!pax || parseInt(pax) < 1) e.pax = 'At least 1 guest required';
    if (tour?.max_pax && parseInt(pax) > tour.max_pax) e.pax = `Max ${tour.max_pax} pax for this tour`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('Sign in required', 'Please sign in to complete your booking.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign in', onPress: () => navigation.navigate('Login') },
        ]);
        return;
      }

      if (paymentMethod === 'stripe') {
        // Create payment intent → Stripe SDK handles payment
        const clientSecret = await createPaymentIntent(totalCents, '');
        // TODO: wire Stripe SDK confirmPayment with clientSecret
        // For now, create the booking and redirect to Voucher
        const { bookingId } = await createBooking({
          tourId: tour.id,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          phone: phone.trim(),
          tourDate: tourDate.trim(),
          pax: parseInt(pax),
          paymentMethod: 'stripe',
          totalCents,
        }, session);
        navigation.reset({ routes: [{ name: 'Voucher', params: { bookingId } }] });
      } else {
        // Cash on pickup — skip payment, create booking directly
        const { bookingId } = await createBooking({
          tourId: tour.id,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          phone: phone.trim(),
          tourDate: tourDate.trim(),
          pax: parseInt(pax),
          paymentMethod,
          totalCents,
        }, session);
        navigation.reset({ routes: [{ name: 'Voucher', params: { bookingId } }] });
      }
    } catch (err: any) {
      Alert.alert('Booking failed', err?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingTour) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + 120,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Tour summary */}
        {tour && (
          <View style={styles.tourSummary}>
            <Text style={styles.tourTitle}>{tour.title}</Text>
            <View style={styles.tourMeta}>
              <Badge variant="category" size="sm">{tour.category.replace('-', ' ')}</Badge>
              <Text style={styles.tourPrice}>PHP {tour.price.toLocaleString()} / person</Text>
            </View>
          </View>
        )}

        {/* Guest info */}
        <Text style={styles.sectionTitle}>Guest Information</Text>
        <View style={styles.fields}>
          <Field
            label="Full name"
            value={guestName}
            onChangeText={setGuestName}
            placeholder="Juan dela Cruz"
            autoCapitalize="words"
            error={errors.guestName}
            required
          />
          <Field
            label="Email address"
            value={guestEmail}
            onChangeText={setGuestEmail}
            placeholder="juan@email.com"
            type="email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.guestEmail}
            required
          />
          <Field
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+63 900 000 0000"
            keyboardType="phone-pad"
            error={errors.phone}
            required
          />
        </View>

        {/* Tour details */}
        <Text style={styles.sectionTitle}>Tour Details</Text>
        <View style={styles.fields}>
          <Field
            label="Tour date"
            value={tourDate}
            onChangeText={setTourDate}
            placeholder="YYYY-MM-DD"
            error={errors.tourDate}
            required
          />
          <Field
            label="Number of guests"
            value={pax}
            onChangeText={setPax}
            placeholder="1"
            keyboardType="numeric"
            error={errors.pax}
            required
          />
        </View>

        {/* Payment method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethods}>
          <PaymentOption
            icon={CreditCard}
            title="Credit / Debit Card"
            subtitle="Visa, Mastercard, JCB, Amex"
            selected={paymentMethod === 'stripe'}
            onPress={() => setPaymentMethod('stripe')}
          />
          <PaymentOption
            icon={Banknote}
            title="GCash / Maya"
            subtitle="Pay with your e-wallet"
            selected={paymentMethod === 'gcash'}
            onPress={() => setPaymentMethod('gcash')}
          />
          <PaymentOption
            icon={Banknote}
            title="Cash on pickup"
            subtitle="Pay the driver directly on the day"
            selected={paymentMethod === 'cash'}
            onPress={() => setPaymentMethod('cash')}
          />
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.ctaTotal}>
          <Text style={styles.ctaTotalLabel}>Total ({pax} pax)</Text>
          <Text style={styles.ctaTotalValue}>PHP {totalPHP.toLocaleString()}</Text>
        </View>
        <Button
          title={paymentMethod === 'stripe' ? 'Pay with Stripe' : 'Confirm Booking'}
          onPress={handleSubmit}
          loading={submitting}
          size="lg"
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
}

function PaymentOption({
  icon: Icon,
  title,
  subtitle,
  selected,
  onPress,
}: {
  icon: any;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.paymentOption, selected && styles.paymentOptionSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.paymentOptionIcon}>
        <Icon size={20} color={selected ? colors.primary : colors.textMuted} />
      </View>
      <View style={styles.paymentOptionContent}>
        <Text style={[styles.paymentOptionTitle, selected && styles.paymentOptionTitleSelected]}>
          {title}
        </Text>
        <Text style={styles.paymentOptionSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.paymentOptionRadio, selected && styles.paymentOptionRadioSelected]}>
        {selected && <View style={styles.paymentOptionRadioInner} />}
      </View>
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
  tourSummary: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tourTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tourMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tourPrice: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  fields: {
    gap: spacing.md,
  },
  paymentMethods: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.infoBg,
  },
  paymentOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentOptionContent: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  paymentOptionTitleSelected: {
    color: colors.primary,
  },
  paymentOptionSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  paymentOptionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentOptionRadioSelected: {
    borderColor: colors.primary,
  },
  paymentOptionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  ctaTotal: {},
  ctaTotalLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  ctaTotalValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  ctaButton: {
    flex: 1,
  },
});
