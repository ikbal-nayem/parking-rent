import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { SpotCard } from '../../components/map/SpotCard';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store';
import { DarkTheme, Fonts, Shadows, Spacing } from '../../theme';
import { ParkingSpot } from '../../types';

const INITIAL_REGION = {
  lat: 23.8103,
  lng: 90.4125,
};

export const MapSearchScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { spots, filterOptions } = useAppStore();

  const mapRef = useRef(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      // Search filter
      if (
        searchQuery &&
        !spot.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !spot.address.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Price filter
      if (
        spot.pricePerHour < filterOptions.priceRange[0] ||
        spot.pricePerHour > filterOptions.priceRange[1]
      ) {
        return false;
      }

      // Parking type filter
      if (
        filterOptions.parkingType &&
        !spot.availableTypes.includes(filterOptions.parkingType)
      ) {
        return false;
      }

      // Vehicle type filter
      if (
        filterOptions.vehicleType &&
        !spot.vehicleTypes.includes(filterOptions.vehicleType)
      ) {
        return false;
      }

      // Amenities filter
      if (filterOptions.isCovered && !spot.isCovered) return false;
      if (filterOptions.hasEVCharging && !spot.hasEVCharging) return false;
      if (filterOptions.hasSecurity && !spot.hasSecurity) return false;

      return true;
    });
  }, [spots, searchQuery, filterOptions]);

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['18%', '40%'], []);

  const handleSpotSelect = useCallback((spot: ParkingSpot) => {
    setSelectedSpot(spot);
    (mapRef.current as any)?.animateToRegion?.(
      {
        latitude: spot.latitude - 0.005,
        longitude: spot.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500,
    );
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleMapPress = useCallback(() => {
    setSelectedSpot(null);
    bottomSheetRef.current?.close();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
      </MapView>
      {/* <LeafletView
        mapCenterPosition={INITIAL_REGION}
        mapMarkers={[
          {
            position: INITIAL_REGION,
            icon: '📍',
            size: [32, 32],
          },
        ]}
      /> */}
      {/* <MapContainer
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <TileLayer
          urlTemplate={OSM_URL}
          attribution="&copy; OpenStreetMap contributors"
          zIndex={-1}
        />

        {filteredSpots.map(spot => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
          >
            <PriceMarker
              spot={spot}
              isSelected={selectedSpot?.id === spot.id}
              onPress={() => handleSpotSelect(spot)}
            />
          </Marker>
        ))}
      </MapContainer> */}

      {/* Top UI Overlay */}
      <View
        style={[
          styles.headerContainer,
          { top: Math.max(insets.top, Spacing.md) },
        ]}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIconContainer}>
            <Icon name="magnify" size={24} color={theme.primary} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search parking in Dhaka..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Icon name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => navigation.navigate('Filters')}
            >
              <Icon name="tune-variant" size={22} color={theme.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Floating Buttons */}
      <View style={styles.floatingButtonsContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="bell-badge-outline" size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingButton, styles.primaryFloatingButton]}
          onPress={() => {
            (mapRef.current as any)?.animateToRegion?.(INITIAL_REGION, 500);
          }}
        >
          <Icon name="crosshairs-gps" size={24} color={theme.white} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {selectedSpot ? (
            <SpotCard
              spot={selectedSpot}
              onPress={() => {
                navigation.navigate('SpotDetail', { spotId: selectedSpot.id });
              }}
              style={styles.spotCard}
            />
          ) : (
            <View style={styles.emptySheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Explore Parking</Text>
                <Text style={styles.sheetSubtitle}>
                  {filteredSpots.length} spots found nearby
                </Text>
              </View>
              <View style={styles.quickFilters}>
                <TouchableOpacity style={styles.quickFilterChip}>
                  <Icon name="lightning-bolt" size={16} color={theme.accent} />
                  <Text style={styles.quickFilterText}>EV Ready</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickFilterChip}>
                  <Icon name="warehouse" size={16} color={theme.primary} />
                  <Text style={styles.quickFilterText}>Covered</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickFilterChip}>
                  <Icon name="shield-check" size={16} color={theme.success} />
                  <Text style={styles.quickFilterText}>Secure</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const createStyles = (theme: typeof DarkTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    map: {
      ...StyleSheet.absoluteFill,
      backgroundColor: '#0D0D0D',
    },
    headerContainer: {
      position: 'absolute',
      left: Spacing.xl,
      right: Spacing.xl,
      zIndex: 10,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 20,
      paddingHorizontal: Spacing.sm,
      height: 60,
      ...Shadows.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 15,
      backgroundColor: theme.primary + '10',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 4,
    },
    searchInput: {
      flex: 1,
      marginLeft: Spacing.md,
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '500',
    },
    clearButton: {
      padding: Spacing.sm,
    },
    filterButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 4,
    },
    floatingButtonsContainer: {
      position: 'absolute',
      right: Spacing.xl,
      bottom: '22%',
      gap: Spacing.md,
      zIndex: 5,
    },
    floatingButton: {
      width: 54,
      height: 54,
      backgroundColor: theme.surface,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      ...Shadows.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    primaryFloatingButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    bottomSheetBackground: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      ...Shadows.lg,
    },
    bottomSheetIndicator: {
      backgroundColor: theme.surfaceHighlight,
      width: 50,
      height: 5,
    },
    bottomSheetContent: {
      padding: Spacing.xl,
    },
    spotCard: {
      margin: 0,
      borderWidth: 0,
      backgroundColor: theme.surface,
    },
    emptySheet: {
      gap: Spacing.xl,
    },
    sheetHeader: {
      marginBottom: Spacing.xs,
    },
    sheetTitle: {
      fontSize: Fonts.sizes.xl,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    sheetSubtitle: {
      fontSize: Fonts.sizes.sm,
      color: theme.textSecondary,
      marginTop: 4,
    },
    quickFilters: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    quickFilterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 6,
    },
    quickFilterText: {
      color: theme.textPrimary,
      fontSize: 12,
      fontWeight: '600',
    },
  });

export default MapSearchScreen;
