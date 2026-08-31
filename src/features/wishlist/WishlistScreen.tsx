// Mirrors WishlistView.tsx on web.
// Wishlist is stored in AsyncStorage via toursRepository.
// Tapping a tour navigates to TourDetailScreen.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Trash2 } from 'lucide-react-native';
import { TOURS, type Tour } from '@/data/tours';
import { getWishlist, removeFromWishlist } from '@/data/repositories/toursRepository';
import { EmptyState } from '@/shared/components/EmptyState';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

export function WishlistScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(true);
  const [wishlist, setWishlist] = React.useState<string[]>([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const list = await getWishlist();
      setWishlist(list);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const tours = wishlist
    .map((id) => TOURS.find((t) => t.id === id))
    .filter((t): t is Tour => t !== undefined);

  const handleRemove = async (tourId: string) => {
    const updated = await removeFromWishlist(tourId);
    setWishlist(updated);
  };

  const handleTourPress = (tour: Tour) => {
    navigation.navigate('TourDetail', { tourId: tour.id });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (tours.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.heading}>Wishlist</Text>
        </View>
        <EmptyState
          icon="heart"
          title="Your wishlist is empty"
          message="Save tours you love by tapping the heart icon."
          actionLabel="Browse tours"
          onAction={() => navigation.navigate('Tours')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.heading}>Wishlist</Text>
        <Text style={styles.count}>{tours.length} saved</Text>
      </View>
      <FlatList
        data={tours}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WishlistRow tour={item} onRemove={handleRemove} onPress={handleTourPress} />
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function WishlistRow({
  tour,
  onRemove,
  onPress,
}: {
  tour: Tour;
  onRemove: (id: string) => void;
  onPress: (t: Tour) => void;
}) {
  const [imgError, setImgError] = React.useState(false);
  const { Image } = require('react-native');

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress(tour)}
      activeOpacity={0.75}
    >
      <View style={styles.rowImage}>
        {imgError ? (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>{tour.title[0]}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: tour.image }}
            style={styles.rowImageImg}
            onError={() => setImgError(true)}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowTitle} numberOfLines={2}>{tour.title}</Text>
        <Text style={styles.rowDuration}>{tour.duration}</Text>
        <Text style={styles.rowPrice}>PHP {tour.price.toLocaleString()}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onRemove(tour.id)}
        style={styles.removeBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Trash2 size={20} color={colors.error} />
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  heading: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
  },
  count: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  rowImage: {
    width: 90,
    height: 90,
  },
  rowImageImg: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    color: colors.border,
  },
  rowContent: {
    flex: 1,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    gap: 3,
  },
  rowTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    lineHeight: 20,
  },
  rowDuration: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  rowPrice: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  removeBtn: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
});
