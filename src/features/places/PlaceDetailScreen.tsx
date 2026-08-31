// Mirrors PlaceDetailModal.tsx on web.
// Full-screen place detail with image gallery, blurb, and "See tours that visit this place".
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ChevronLeft, MapPin, ArrowRight } from 'lucide-react-native';
import { PLACES, type Place } from '@/data/places';
import { TOURS, type Tour } from '@/data/tours';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

type RouteParams = { placeId: string };

export function PlaceDetailScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { placeId } = route.params as RouteParams;

  const [loading, setLoading] = React.useState(true);
  const [place, setPlace] = React.useState<Place | null>(null);
  const [currentImage, setCurrentImage] = React.useState(0);

  React.useEffect(() => {
    const p = PLACES.find((x) => x.id === placeId) ?? null;
    setPlace(p);
    setLoading(false);
    setCurrentImage(0);
  }, [placeId]);

  const toursHere = place?.tourIds
    ?.map((id) => TOURS.find((t) => t.id === id))
    .filter((t): t is Tour => t !== undefined) ?? [];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Place not found</Text>
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
        {/* Image gallery */}
        <View style={styles.gallery}>
          {place.images.map((uri, i) => (
            <View key={i} style={styles.gallerySlide}>
              <Image
                source={{ uri }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            </View>
          ))}
          <View style={styles.galleryIndicators}>
            {place.images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicator,
                  i === currentImage && styles.indicatorActive,
                ]}
              />
            ))}
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { top: insets.top + spacing.md }]}
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{place.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.accent} />
            <Text style={styles.locationText}>
              {place.latitude?.toFixed(4)}, {place.longitude?.toFixed(4)}
            </Text>
          </View>
          <Text style={styles.blurb}>{place.blurb}</Text>

          {/* Related tours */}
          {toursHere.length > 0 && (
            <View style={styles.toursSection}>
              <Text style={styles.toursTitle}>
                Tours that visit {place.name}
              </Text>
              <FlatList
                data={toursHere}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <RelatedTourCard tour={item} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.toursList}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function RelatedTourCard({ tour }: { tour: Tour }) {
  const [imgError, setImgError] = React.useState(false);
  const { Image } = require('react-native');
  const { TouchableOpacity } = require('react-native');

  return (
    <TouchableOpacity
      style={styles.relatedCard}
      onPress={() => {/* navigation.navigate('TourDetail', { tourId: tour.id }) */}}
      activeOpacity={0.85}
    >
      {imgError ? (
        <View style={styles.relatedImagePlaceholder}>
          <Text style={styles.relatedImagePlaceholderText}>{tour.title[0]}</Text>
        </View>
      ) : (
        <Image
          source={{ uri: tour.image }}
          style={styles.relatedImage}
          onError={() => setImgError(true)}
          resizeMode="cover"
        />
      )}
      <View style={styles.relatedOverlay} />
      <View style={styles.relatedContent}>
        <Text style={styles.relatedTitle} numberOfLines={2}>{tour.title}</Text>
        <Text style={styles.relatedPrice}>PHP {tour.price.toLocaleString()}</Text>
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
  errorText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  gallery: {
    height: 300,
    position: 'relative',
    backgroundColor: colors.surfaceSunken,
  },
  gallerySlide: {
    width: '100%',
    height: '100%',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryIndicators: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  indicatorActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  backBtn: {
    position: 'absolute',
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  name: {
    fontSize: 28,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  blurb: {
    fontSize: fontSize.base,
    color: colors.text,
    lineHeight: 22,
  },
  toursSection: {
    marginTop: spacing.md,
  },
  toursTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  toursList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  relatedCard: {
    width: 220,
    height: 160,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSunken,
  },
  relatedImage: {
    width: '100%',
    height: '100%',
  },
  relatedImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedImagePlaceholderText: {
    fontSize: 40,
    fontWeight: fontWeight.bold,
    color: colors.border,
  },
  relatedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  relatedContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    gap: 2,
  },
  relatedTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  relatedPrice: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
});
