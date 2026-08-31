// Mirrors SearchAutocomplete.tsx + pages/SearchResults.tsx on web.
// Debounced text input → filters TOURS by title/highlights/description.
// Tapping a result navigates to TourDetailScreen.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, X, MapPin, Clock } from 'lucide-react-native';
import { TOURS, type Tour } from '@/data/tours';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

const DEBOUNCE_MS = 300;

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Tour[]>([]);
  const [loading, setLoading] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = React.useCallback((q: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(() => {
      const lower = q.toLowerCase();
      const filtered = TOURS.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.highlights.some((h) => h.toLowerCase().includes(lower)) ||
          t.description.toLowerCase().includes(lower) ||
          t.category.toLowerCase().includes(lower),
      );
      setResults(filtered);
      setLoading(false);
    }, DEBOUNCE_MS);
  }, []);

  const handleChange = (text: string) => {
    setQuery(text);
    search(text);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
  };

  const handleSelect = (tour: Tour) => {
    navigation.navigate('TourDetail', { tourId: tour.id });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search bar */}
      <View style={styles.searchBarWrap}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={handleChange}
            placeholder="Search tours, destinations..."
            placeholderTextColor={colors.textSubtle}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clear} style={styles.clearBtn}>
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {query.trim().length === 0 ? (
        <View style={styles.emptyState}>
          <Search size={48} color={colors.border} />
          <Text style={styles.emptyTitle}>Find your experience</Text>
          <Text style={styles.emptyHint}>
            Search for tours by name, destination, or highlight
          </Text>
        </View>
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <MapPin size={48} color={colors.border} />
          <Text style={styles.emptyTitle}>No tours found</Text>
          <Text style={styles.emptyHint}>
            Try searching for "Chocolate Hills", "island hopping", or "dolphins"
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ResultRow tour={item} onSelect={handleSelect} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

function ResultRow({
  tour,
  onSelect,
}: {
  tour: Tour;
  onSelect: (t: Tour) => void;
}) {
  const [imgError, setImgError] = React.useState(false);
  const { Image } = require('react-native');

  return (
    <TouchableOpacity
      style={styles.resultRow}
      onPress={() => onSelect(tour)}
      activeOpacity={0.75}
    >
      <View style={styles.resultImage}>
        {imgError ? (
          <View style={styles.resultImagePlaceholder}>
            <Text style={styles.resultImagePlaceholderText}>{tour.title[0]}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: tour.image }}
            style={styles.resultImageImg}
            onError={() => setImgError(true)}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>{tour.title}</Text>
        <View style={styles.resultMeta}>
          <View style={styles.resultMetaItem}>
            <Clock size={12} color={colors.textMuted} />
            <Text style={styles.resultMetaText}>{tour.duration}</Text>
          </View>
          <Text style={styles.resultPrice}>
            PHP {tour.price.toLocaleString()}
          </Text>
        </View>
        <Text style={styles.resultCategory}>{tour.category.replace('-', ' ')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarWrap: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  emptyHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  resultImage: {
    width: 80,
    height: 80,
  },
  resultImageImg: {
    width: '100%',
    height: '100%',
  },
  resultImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultImagePlaceholderText: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    color: colors.border,
  },
  resultContent: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'center',
    gap: 4,
  },
  resultTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultMetaText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  resultPrice: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  resultCategory: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
});
