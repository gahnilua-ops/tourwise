// Mirrors TourDetail.tsx on web. Sticky bottom CTA "Book Now".
// Receives { tourId } as a route param from TourCard or FeaturedCard.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Heart, Clock, MapPin, Check, X, ChevronLeft, Star, Users, Hotel } from 'lucide-react-native';
import type { Tour, ItineraryStop } from '@/data/tours';
import { fetchTourById, addToWishlist, getWishlist, removeFromWishlist } from '@/data/repositories/toursRepository';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

type RouteParams = { tourId: string };

export function TourDetailScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { tourId } = route.params as RouteParams;

  const [loading, setLoading] = React.useState(true);
  const [tour, setTour] = React.useState<Tour | null>(null);
  const [wishlisted, setWishlisted] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const [t, wl] = await Promise.all([
          fetchTourById(tourId),
          getWishlist(),
        ]);
        setTour(t);
        setWishlisted(wl.includes(tourId));
      } finally {
        setLoading(false);
      }
    })();
  }, [tourId]);

  const toggleWishlist = async () => {
    if (!tour) return;
    const next = wishlisted
      ? await removeFromWishlist(tour.id)
      : await addToWishlist(tour.id);
    setWishlisted(next.includes(tour.id));
  };

  const handleBook = () => {
    if (!tour) return;
    navigation.navigate('Booking', { tourId: tour.id });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!tour) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Tour not found</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={styles.hero}>
          {imgError ? (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Text style={styles.heroPlaceholderText}>{tour.title[0]}</Text>
            </View>
          ) : (
            <Image
              source={{ uri: tour.image }}
              style={styles.heroImage}
              onError={() => setImgError(true)}
              resizeMode="cover"
            />
          )}
          <View style={styles.heroOverlay} />

          {/* Top buttons */}
          <View style={[styles.heroTopRow, { paddingTop: insets.top + spacing.md }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <ChevronLeft size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleWishlist}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Heart
                size={20}
                color={wishlisted ? colors.error : '#fff'}
                fill={wishlisted ? colors.error : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          {/* Title overlay */}
          <View style={styles.heroTitleWrap}>
            <View style={styles.heroBadgeRow}>
              {tour.bestseller && <Badge variant="bestseller" size="sm">★ Bestseller</Badge>}
              {tour.featured && !tour.bestseller && <Badge variant="featured" size="sm">Featured</Badge>}
              {tour.category === 'package' && <Badge variant="package" size="sm">Package</Badge>}
            </View>
            <Text style={styles.heroTitle}>{tour.title}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <Clock size={14} color="#fff" />
                <Text style={styles.heroMetaText}>{tour.duration}</Text>
              </View>
              {tour.min_pax && tour.max_pax && (
                <View style={styles.heroMetaItem}>
                  <Users size={14} color="#fff" />
                  <Text style={styles.heroMetaText}>
                    {tour.min_pax}–{tour.max_pax} pax
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Price */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>From</Text>
              <Text style={styles.priceValue}>
                PHP {tour.price.toLocaleString()}{' '}
                <Text style={styles.pricePer}>per person</Text>
              </Text>
            </View>
            {tour.rating && (
              <View style={styles.ratingRow}>
                <Star size={16} color={colors.yellow} fill={colors.yellow} />
                <Text style={styles.ratingText}>{tour.rating}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.description}>{tour.description}</Text>

          {/* Hotel note (if any) */}
          {tour.hotel_name && (
            <View style={styles.hotelNote}>
              <Hotel size={18} color={colors.accent} />
              <Text style={styles.hotelText}>
                Includes: {tour.hotel_name}
                {tour.room_type ? ` — ${tour.room_type}` : ''}
              </Text>
            </View>
          )}

          {/* Highlights */}
          <Section title="Highlights">
            {tour.highlights.map((h, i) => (
              <View key={i} style={styles.listItem}>
                <View style={styles.checkDot}>
                  <Check size={12} color={colors.accent} />
                </View>
                <Text style={styles.listItemText}>{h}</Text>
              </View>
            ))}
          </Section>

          {/* Itinerary */}
          {tour.itinerary_stops && tour.itinerary_stops.length > 0 && (
            <Section title="Itinerary">
              {tour.itinerary_stops.map((s, i) => (
                <ItineraryRow key={i} stop={s} last={i === tour.itinerary_stops!.length - 1} />
              ))}
            </Section>
          )}

          {/* Included / Excluded */}
          {(tour.included || tour.excluded) && (
            <View style={styles.twoCol}>
              {tour.included && tour.included.length > 0 && (
                <View style={styles.colBox}>
                  <Text style={[styles.colTitle, { color: colors.success }]}>
                    What's Included
                  </Text>
                  {tour.included.map((item, i) => (
                    <View key={i} style={styles.smallListItem}>
                      <Check size={12} color={colors.success} />
                      <Text style={styles.smallListText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
              {tour.excluded && tour.excluded.length > 0 && (
                <View style={styles.colBox}>
                  <Text style={[styles.colTitle, { color: colors.error }]}>
                    Not Included
                  </Text>
                  {tour.excluded.map((item, i) => (
                    <View key={i} style={styles.smallListItem}>
                      <X size={12} color={colors.error} />
                      <Text style={styles.smallListText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Meeting point */}
          {tour.meeting_point && (
            <Section title="Meeting Point">
              <View style={styles.meetingPointRow}>
                <MapPin size={18} color={colors.accent} />
                <Text style={styles.meetingPointText}>{tour.meeting_point}</Text>
              </View>
            </Section>
          )}

          {/* Cancellation */}
          {tour.cancellation_policy && (
            <Section title="Cancellation Policy">
              <View style={styles.policyBox}>
                <Text style={styles.policyText}>{tour.cancellation_policy}</Text>
              </View>
            </Section>
          )}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.ctaPrice}>
          <Text style={styles.ctaPriceLabel}>Total from</Text>
          <Text style={styles.ctaPriceValue}>
            PHP {tour.price.toLocaleString()}
          </Text>
        </View>
        <Button
          title="Book Now"
          onPress={handleBook}
          size="lg"
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function ItineraryRow({ stop, last }: { stop: ItineraryStop; last: boolean }) {
  return (
    <View style={styles.itineraryRow}>
      <View style={styles.itineraryDotCol}>
        <View style={styles.itineraryDot} />
        {!last && <View style={styles.itineraryLine} />}
      </View>
      <View style={styles.itineraryContent}>
        <Text style={styles.itineraryTime}>{stop.time}</Text>
        <Text style={styles.itineraryTitle}>{stop.title}</Text>
        {stop.description && (
          <Text style={styles.itineraryDesc}>{stop.description}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  hero: {
    height: 360,
    position: 'relative',
    backgroundColor: colors.surfaceSunken,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderText: {
    fontSize: 80,
    color: colors.border,
    fontWeight: fontWeight.bold,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroTopRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitleWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: fontWeight.extrabold,
    color: '#fff',
    lineHeight: 34,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroMetaText: {
    fontSize: fontSize.xs,
    color: '#fff',
  },
  body: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: fontWeight.extrabold,
    color: colors.accent,
  },
  pricePer: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    color: colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  description: {
    fontSize: fontSize.base,
    color: colors.text,
    lineHeight: 22,
  },
  hotelNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accentLight,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  hotelText: {
    fontSize: fontSize.sm,
    color: colors.text,
    flex: 1,
  },
  section: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionContent: {
    gap: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  listItemText: {
    fontSize: fontSize.base,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  itineraryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  itineraryDotCol: {
    alignItems: 'center',
    width: 12,
  },
  itineraryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  itineraryLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 2,
  },
  itineraryContent: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  itineraryTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  itineraryTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  itineraryDesc: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 20,
  },
  twoCol: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  colBox: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  colTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  smallListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  smallListText: {
    fontSize: fontSize.xs,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  meetingPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  meetingPointText: {
    fontSize: fontSize.sm,
    color: colors.text,
    flex: 1,
  },
  policyBox: {
    backgroundColor: colors.warningBg,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#F2DBA0',
  },
  policyText: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 20,
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
  ctaPrice: {
    flex: 1,
  },
  ctaPriceLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  ctaPriceValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  ctaButton: {
    paddingHorizontal: spacing.xl,
  },
});
