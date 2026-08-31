// Mirrors PlaceDetailModal.tsx + data/places.ts on web.
// Grid of place cards. Tap a card to navigate to PlaceDetailScreen.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Compass } from 'lucide-react-native';
import { PLACES, type Place } from '@/data/places';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

export function PlacesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [loading, setLoading] = React.useState(true);
  const [places, setPlaces] = React.useState<Place[]>([]);

  React.useEffect(() => {
    (async () => {
      setPlaces(PLACES);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.heading}>Places</Text>
        <Text style={styles.subheading}>
          Iconic destinations across Bohol
        </Text>
      </View>

      <View style={styles.grid}>
        {places.map((p) => (
          <PlaceCard
            key={p.id}
            place={p}
            onPress={() => navigation.navigate('PlaceDetail', { placeId: p.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function PlaceCard({ place, onPress }: { place: Place; onPress: () => void }) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrap}>
        {imgError || !place.images[0] ? (
          <View style={styles.imagePlaceholder}>
            <Compass size={40} color={colors.border} />
          </View>
        ) : (
          <Image
            source={{ uri: place.images[0] }}
            style={styles.image}
            onError={() => setImgError(true)}
            resizeMode="cover"
          />
        )}
        <View style={styles.imageOverlay} />
        <Text style={styles.cardTitle} numberOfLines={2}>{place.name}</Text>
      </View>
      <Text style={styles.cardBlurb} numberOfLines={3}>{place.blurb}</Text>
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
  header: {
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  imageWrap: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: colors.surfaceSunken,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardTitle: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  cardBlurb: {
    padding: spacing.md,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
