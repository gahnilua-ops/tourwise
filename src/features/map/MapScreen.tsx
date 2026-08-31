// Mirrors LiveMapWidget.tsx on web (Leaflet → react-native-maps).
// Shows Bohol region with place markers. Tap marker → PlaceDetailScreen.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { PLACES, type Place } from '@/data/places';
import { MapPin, Compass, MyLocation } from 'lucide-react-native';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

const { width, height } = Dimensions.get('window');

export function MapScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [region, setRegion] = React.useState({
    latitude: 9.8500,
    longitude: 124.1435,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [markers, setMarkers] = React.useState<Place[]>([]);
  const [selectedMarker, setSelectedMarker] = React.useState<Place | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setMarkers(PLACES.filter((p) => p.latitude && p.longitude));
    setLoading(false);
  }, []);

  const handleMarkerPress = (place: Place) => {
    setSelectedMarker(place);
  };

  const handleCalloutPress = (place: Place) => {
    navigation.navigate('PlaceDetail', { placeId: place.id });
  };

  const handleMyLocation = () => {
    setRegion((prev) => ({
      ...prev,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          minZoomLevel={7}
          maxZoomLevel={16}
        >
          {markers.map((place) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.latitude!,
                longitude: place.longitude!,
              }}
              onPress={() => handleMarkerPress(place)}
            >
              <Callout
                onPress={() => handleCalloutPress(place)}
                style={styles.callout}
              >
                <View style={styles.calloutContent}>
                  <Text style={styles.calloutTitle}>{place.name}</Text>
                  <Text style={styles.calloutBlurb} numberOfLines={2}>
                    {place.blurb}
                  </Text>
                  <TouchableOpacity style={styles.calloutBtn}>
                    <Text style={styles.calloutBtnText}>View details</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      {/* Selected marker bottom sheet */}
      {selectedMarker && (
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetImage}>
              <Image
                source={{ uri: selectedMarker.images[0] }}
                style={styles.bottomSheetImageImg}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.bottomSheetTitle}>{selectedMarker.name}</Text>
            <Text style={styles.bottomSheetBlurb}>{selectedMarker.blurb}</Text>
            <TouchableOpacity
              style={styles.bottomSheetBtn}
              onPress={() => handleCalloutPress(selectedMarker)}
              activeOpacity={0.8}
            >
              <Text style={styles.bottomSheetBtnText}>View details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomSheetClose}
              onPress={() => setSelectedMarker(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.bottomSheetCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* My location button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleMyLocation}
        activeOpacity={0.8}
      >
        <MyLocation size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Tap a pin to explore</Text>
      </View>
    </View>
  );
}

// Image component for bottom sheet (avoid require cycle)
const { Image } = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
    width: width,
    height: height,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callout: {
    width: 240,
  },
  calloutContent: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  calloutTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  calloutBlurb: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  calloutBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  calloutBtnText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: spacing.sm,
  },
  bottomSheetContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg + 20,
    gap: spacing.md,
  },
  bottomSheetImage: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  bottomSheetImageImg: {
    width: '100%',
    height: '100%',
  },
  bottomSheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  bottomSheetBlurb: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  bottomSheetBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  bottomSheetBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  bottomSheetClose: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  bottomSheetCloseText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 180,
    right: spacing.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...{
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
  },
  legend: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  legendTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
