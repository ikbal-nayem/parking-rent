import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { Camera, Marker, Map, UserLocation } from '@maplibre/maplibre-react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { SpotCard } from '../../components/map/SpotCard';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store';
import { requestLocationPermission } from '../../services/locationPermission';
import { DarkTheme, Fonts, Shadows, Spacing } from '../../theme';
import { ParkingSpot } from '../../types';

export const MapSearchScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { spots, filterOptions, locationPermissionGranted, userLocation } = useAppStore();

  const mapRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackUserLocation, setTrackUserLocation] = useState<'default' | undefined>(undefined);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermissionGranted) {
      setTrackUserLocation('default');
    } else {
      setTrackUserLocation(undefined);
    }
  }, [locationPermissionGranted]);

  useEffect(() => {
    if (locationPermissionGranted && userLocation && trackUserLocation === 'default') {
      cameraRef.current?.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        duration: 500,
        zoom: 16,
      });
    }
  }, [locationPermissionGranted, userLocation, trackUserLocation]);

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
  const snapPoints = useMemo(() => ['35%', '90%'], []);

  const handleSpotSelect = useCallback((spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setTrackUserLocation(undefined);
    cameraRef.current?.flyTo({
      center: [spot.longitude, spot.latitude],
      duration: 500,
      zoom: 16,
    });
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleMapPress = useCallback(() => {
    setSelectedSpot(null);
    if (locationPermissionGranted) {
      setTrackUserLocation('default');
    }
    bottomSheetRef.current?.snapToIndex(1);
  }, [locationPermissionGranted]);

  const focusUserLocation = useCallback(async () => {
    if (!locationPermissionGranted) {
      const granted = await requestLocationPermission();
      if (!granted) {
        return;
      }
    }

    const { userLocation: latestLocation, locationPermissionGranted: latestGranted } = useAppStore.getState();
    if (!latestGranted || !latestLocation) {
      return;
    }

    setSelectedSpot(null);
    setTrackUserLocation('default');
    cameraRef.current?.jumpTo({
      center: [latestLocation.longitude, latestLocation.latitude],
    });
    bottomSheetRef.current?.snapToIndex(1);
  }, [locationPermissionGranted]);

  return (
    <View style={styles.container}>
      <Map
        style={StyleSheet.absoluteFill}
        mapStyle="https://dvqzqqsuwfrmcuahsvao.supabase.co/storage/v1/object/public/map-tiles/map-stype.json"
        onPress={handleMapPress}
        ref={mapRef}
      >
        <Camera
          ref={cameraRef}
          zoom={16}
          initialViewState={{
            center: [userLocation?.longitude ?? 90.4125, userLocation?.latitude ?? 23.8103],
            zoom: 12,
          }}
          trackUserLocation={trackUserLocation}
        />
        {locationPermissionGranted && <UserLocation animated heading />}

        {filteredSpots.map(spot => (
          <Marker
            key={spot.id}
            id={spot.id}
            lngLat={[spot.longitude, spot.latitude]}
            onPress={() => handleSpotSelect(spot)}
          >
            <View style={[
              styles.markerContainer,
              selectedSpot?.id === spot.id && styles.markerSelected,
            ]}>
              <Text style={[
                styles.markerText,
                selectedSpot?.id === spot.id && styles.markerTextSelected,
              ]}>
                ৳{spot.pricePerHour}
              </Text>
              <View style={[
                styles.markerTriangle,
                selectedSpot?.id === spot.id && styles.markerTriangleSelected,
              ]} />
            </View>
          </Marker>
        ))}
      </Map>

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
          onPress={focusUserLocation}
        >
          <Icon name="crosshairs-gps" size={24} color={theme.white} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        style={styles.bottomSheet}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {selectedSpot ? (
            <View style={styles.selectedSpotHeader}>
              <TouchableOpacity
                style={styles.backToListButton}
                onPress={() => {
                  setSelectedSpot(null);
                  if (locationPermissionGranted) {
                    setTrackUserLocation('default');
                  }
                  bottomSheetRef.current?.snapToIndex(1);
                }}
              >
                <Icon name="arrow-left" size={18} color={theme.textPrimary} />
                <Text style={styles.backToListText}>Back to list</Text>
              </TouchableOpacity>
              <SpotCard
                spot={selectedSpot}
                onPress={() => {
                  navigation.navigate('SpotDetail', { spotId: selectedSpot.id });
                }}
                style={styles.spotCard}
              />
            </View>
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
              <BottomSheetScrollView
                style={styles.spotList}
                contentContainerStyle={styles.spotListContent}
                showsVerticalScrollIndicator={false}
              >
                {filteredSpots.map(spot => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    onPress={() => handleSpotSelect(spot)}
                    style={styles.spotListItem}
                  />
                ))}
              </BottomSheetScrollView>
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
    markerContainer: {
      backgroundColor: theme.surface,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      ...Shadows.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    markerSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primaryDark,
      transform: [{ scale: 1.05 }],
    },
    markerText: {
      color: theme.textPrimary,
      fontSize: Fonts.sizes.xs,
      fontWeight: '700',
    },
    markerTextSelected: {
      color: theme.white,
    },
    markerTriangle: {
      marginTop: 4,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderTopWidth: 6,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: theme.surface,
    },
    markerTriangleSelected: {
      borderTopColor: theme.primary,
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
    bottomSheet: {
      flex: 1,
    },
    bottomSheetContent: {
      flex: 1,
      padding: Spacing.xl,
    },
    spotCard: {
      margin: 0,
      borderWidth: 0,
      backgroundColor: theme.surface,
    },
    spotList: {
      marginTop: Spacing.lg,
      flex: 1,
    },
    spotListContent: {
      paddingBottom: Spacing.xl,
      flexGrow: 1,
    },
    spotListItem: {
      marginBottom: Spacing.lg,
    },
    selectedSpotHeader: {
      gap: Spacing.sm,
      flex: 1,
    },
    backToListButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      paddingVertical: Spacing.sm,
    },
    backToListText: {
      color: theme.textPrimary,
      fontSize: Fonts.sizes.sm,
      fontWeight: '600',
    },
    emptySheet: {
      flex: 1,
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
