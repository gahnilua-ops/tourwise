// Mirrors TourCard.tsx on web (lucide-react → lucide-react-native, CSS → StyleSheet).
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Star, Clock } from 'lucide-react-native';
import type { Tour } from '@/data/tours';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;
const IMAGE_HEIGHT = 140;

interface Props {
  tour: Tour;
  isWishlisted?: boolean;
  onWishlist?: (id: string) => void;
  isPackage?: boolean;
}

export function TourCard({ tour, isWishlisted, onWishlist, isPackage }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [imgError, setImgError] = React.useState(false);

  const handlePress = () => {
    navigation.navigate('TourDetail', { tourId: tour.id });
  };

  const handleWishlist = (e: any) => {
    e.stopPropagation();
    onWishlist?.(tour.id);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.card, isPackage && styles.cardPackage]}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {imgError ? (
          <View style={[styles.imagePlaceholder, { height: IMAGE_HEIGHT }]}>
            <Text style={styles.imagePlaceholderText}>{tour.title[0]}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: tour.image }}
            style={[styles.image, { height: IMAGE_HEIGHT }]}
            onError={() => setImgError(true)}
            resizeMode="cover"
          />
        )}

        {/* Duration pill */}
        <View style={styles.durationBadge}>
          <Clock size={10} color="#fff" />
          <Text style={styles.durationText}>{tour.duration}</Text>
        </View>

        {/* Top-right badge */}
        {tour.bestseller ? (
          <View style={styles.topBadge}>
            <Badge variant="bestseller" size="sm">
              <Star size={10} color="#2c3400" style={{ marginRight: 3 }} />
              Bestseller
            </Badge>
          </View>
        ) : tour.featured && !isPackage ? (
          <View style={styles.topBadge}>
            <Badge variant="featured" size="sm">
              Featured
            </Badge>
          </View>
        ) : isPackage ? (
          <View style={styles.topBadge}>
            <Badge variant="package" size="sm">
              Package
            </Badge>
          </View>
        ) : null}

        {/* Wishlist heart */}
        <TouchableOpacity
          onPress={handleWishlist}
          style={styles.wishlistBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Heart
            size={20}
            color={isWishlisted ? colors.error : '#fff'}
            fill={isWishlisted ? colors.error : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{tour.title}</Text>
        <Text style={styles.price}>
          PHP {tour.price.toLocaleString()}{' '}
          <Text style={styles.pricePer}>per person</Text>
        </Text>

        {/* Highlights */}
        <View style={styles.highlights}>
          {tour.highlights.slice(0, 2).map((h, i) => (
            <View key={i} style={styles.highlightItem}>
              <View style={styles.highlightDot} />
              <Text style={styles.highlightText} numberOfLines={1}>{h}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity onPress={handlePress} style={styles.cta}>
          <Text style={styles.ctaText}>Book this experience</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    width: CARD_WIDTH,
    marginBottom: spacing.md,
  },
  cardPackage: {
    borderColor: colors.primaryLight,
    borderWidth: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 40,
    fontWeight: fontWeight.bold,
    color: colors.border,
  },
  durationBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(42,38,24,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  durationText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  wishlistBtn: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    lineHeight: 20,
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    color: colors.accent,
  },
  pricePer: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    color: colors.textMuted,
  },
  highlights: {
    gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    flexShrink: 0,
  },
  highlightText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    flex: 1,
  },
  cta: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ctaText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
});
