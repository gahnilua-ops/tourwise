// Mirrors components/LegalPages.tsx on web.
// Three sections: Terms of Service, Privacy Policy, Cancellation Policy.
// All content is inline (no markdown parser) to keep deps minimal.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { colors, spacing, fontSize, fontWeight } from '@/app/theme';

type RouteParams = { type: 'terms' | 'privacy' | 'cancellation' };

const CONTENT: Record<RouteParams['type'], { title: string; sections: { heading: string; body: string }[] }> = {
  terms: {
    title: 'Terms of Service',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: 'By using TourWise, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.',
      },
      {
        heading: 'Booking and Payment',
        body: 'Tour bookings are confirmed upon successful payment. Cash bookings are confirmed by the driver on the day of the tour. We reserve the right to decline bookings that violate our policies.',
      },
      {
        heading: 'Cancellation and Refunds',
        body: 'Cancellations made at least 24 hours before the tour start time are eligible for a full refund. See our Cancellation Policy for details.',
      },
      {
        heading: 'Conduct and Safety',
        body: 'Guests are expected to behave respectfully toward guides, drivers, and other tourists. We reserve the right to terminate a tour for unsafe or inappropriate behavior without refund.',
      },
      {
        heading: 'Liability',
        body: 'TourWise acts as an intermediary between guests and tour operators. We are not liable for injuries, losses, or damages incurred during tours, except as required by law.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Information We Collect',
        body: 'We collect your name, email, phone number, and payment information to process bookings. We also collect location data when you use our map features.',
      },
      {
        heading: 'How We Use Your Information',
        body: 'We use your information to process bookings, send confirmations and updates, and improve our service. We never sell your data to third parties.',
      },
      {
        heading: 'Data Security',
        body: 'Payment processing is handled by Stripe, a PCI-DSS Level 1 service provider. We use encryption and secure storage to protect your data.',
      },
      {
        heading: 'Your Rights',
        body: 'You may request access, correction, or deletion of your data at any time by contacting support@itravelbohol.com.',
      },
    ],
  },
  cancellation: {
    title: 'Cancellation Policy',
    sections: [
      {
        heading: 'Day Tours',
        body: 'Free cancellation up to 24 hours before the tour start time. Cancellations within 24 hours may be subject to a 50% charge. No-shows are non-refundable.',
      },
      {
        heading: 'Multi-Day Packages',
        body: 'Free cancellation up to 48 hours before the first tour date. Cancellations within 48 hours may be subject to a 50% charge.',
      },
      {
        heading: 'Weather and Force Majeure',
        body: 'In the event of severe weather or other force majeure events, we will reschedule your tour or issue a full refund at our discretion.',
      },
      {
        heading: 'How to Cancel',
        body: 'You may cancel your booking from the My Bookings section of the app, or by contacting support@itravelbohol.com.',
      },
    ],
  },
};

export function LegalScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const type = (route.params as RouteParams)?.type || 'terms';
  const content = CONTENT[type];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{content.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {content.sections.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
        <Text style={styles.lastUpdated}>Last updated: August 2026</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionBody: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    lineHeight: 22,
  },
  lastUpdated: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
