// Mirrors the Tours section of the web app landing page.
// Features a "Featured" horizontal carousel at the top, category filter chips,
// and a 2-column grid of TourCards below.
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
import { TourCard } from './TourCard';
import { TOURS, type Tour, type TourCategory } from '@/data/tours';
import { addToWishlist, getWishlist, removeFromWishlist } from '@/data/repositories/toursRepository';
import { Badge } from '@/shared/components/Badge';
import { Search } from 'lucide-react-native';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

const CATEGORIES: { value: TourCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'day-tour', label: 'Day Tour' },
  { value: 'island-hopping', label: 'Island Hopping' },
  { value: 'package', label: 'Packages' },
];

export function ToursScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(true);
  const [tours, setTours] = React.useState<Tour[]>([]);
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  const [activeCategory, setActiveCategory] = React.useState<TourCategory | 'all'>('all');

  React.useEffect(() => {
    (async () => {
      try {
        const [list, wl] = await Promise.all([Promise.resolve(TOURS), getWishlist()]);
        setTours(list);
        setWishlist(wl);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featured = tours.filter((t) => t.featured || t.bestseller);
  const filtered = activeCategory === 'all'
    ? tours
    : tours.filter((t) => t.category === activeCategory);

  const toggleWishlist = async (tourId: string) => {
    const isIn = wishlist.includes(tourId);
    const updated = isIn ? await removeFromWishlist(tourId) : await addToWishlist(tourId);
    setWishlist(updated);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View>
          <Text style={styles.heading}>Tours</Text>
          <Text style={styles.subheading}>
            Curated experiences across Bohol
          </Text>
        </View>
        <TouchableOpacity style={styles.searchBtn} activeOpacity={0.7}>
          <Search size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Featured carousel */}
      {featured.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <Text style={styles.sectionHint}>Top picks for you</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featured.map((t) => (
              <FeaturedCard key={t.id} tour={t} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.value}
            onPress={() => setActiveCategory(c.value)}
            style={[
              styles.chip,
              activeCategory === c.value && styles.chipActive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                activeCategory === c.value && styles.chipTextActive,
              ]}
            >
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tour grid */}
      <View style={styles.gridSection}>
        <Text style={styles.resultsCount}>
          {filtered.length} {filtered.length === 1 ? 'tour' : 'tours'}
        </Text>
        <View style={styles.grid}>
          {filtered.map((t) => (
            <TourCard
              key={t.id}
              tour={t}
              isWishlisted={wishlist.includes(t.id)}
              onWishlist={toggleWishlist}
              isPackage={t.category === 'package'}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// Large horizontal featured card
function FeaturedCard({ tour }: { tour: Tour }) {
  return (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => {/* navigation.navigate('TourDetail', { tourId: tour.id }) */}}
      activeOpacity={0.85}
    >
      <ScrollViewImage uri={tour.image} />
      <View style={styles.featuredOverlay}>
        <View style={styles.featuredBadgeRow}>
          {tour.bestseller && (
            <Badge variant="bestseller" size="sm">★ Bestseller</Badge>
          )}
          {tour.featured && !tour.bestseller && (
            <Badge variant="featured" size="sm">Featured</Badge>
          )}
        </View>
        <View style={styles.featuredFooter}>
          <Text style={styles.featuredTitle} numberOfLines={2}>{tour.title}</Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredDuration}>{tour.duration}</Text>
            <Text style={styles.featuredPrice}>
              PHP {tour.price.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ScrollViewImage({ uri }: { uri: string }) {
  const [error, setError] = React.useState(false);
  const { Image } = require('react-native');
  if (error) {
    return (
      <View style={[styles.featuredImage, styles.featuredImagePlaceholder]}>
        <Text style={styles.placeholderText}>{uri ? 'No image' : ''}</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={styles.featuredImage}
      onError={() => setError(true)}
      resizeMode="cover"
    />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  heading: {
    fontSize: 32,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
  },
  subheading: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  sectionHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  featuredScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  featuredCard: {
    width: 280,
    height: 180,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSunken,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredImagePlaceholder: {
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  featuredFooter: {
    gap: spacing.xs,
  },
  featuredTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredDuration: {
    fontSize: fontSize.xs,
    color: '#fff',
    opacity: 0.9,
  },
  featuredPrice: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  chipsScroll: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  chipTextActive: {
    color: '#fff',
  },
  gridSection: {
    paddingHorizontal: spacing.lg,
  },
  resultsCount: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
