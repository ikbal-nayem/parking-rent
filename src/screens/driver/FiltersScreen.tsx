import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { ParkingType, VehicleType } from '../../types';

const { width } = Dimensions.get('window');

export const FiltersScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const { filterOptions, updateFilters, resetFilters } = useAppStore();
  
  const [localFilters, setLocalFilters] = useState(filterOptions);

  const toggleParkingType = (type: ParkingType) => {
    setLocalFilters(prev => ({
      ...prev,
      parkingType: prev.parkingType === type ? null : type
    }));
  };

  const toggleVehicleType = (type: VehicleType) => {
    setLocalFilters(prev => ({
      ...prev,
      vehicleType: prev.vehicleType === type ? null : type
    }));
  };

  const toggleAmenity = (key: 'isCovered' | 'hasEVCharging' | 'hasSecurity') => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const applyFilters = () => {
    updateFilters(localFilters);
    navigation.goBack();
  };

  const handleReset = () => {
    resetFilters();
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing.xl) }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Icon name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range (৳/hr)</Text>
          <View style={styles.sliderContainer}>
            <MultiSlider
              values={localFilters.priceRange}
              sliderLength={width - Spacing.xl * 2}
              onValuesChange={(values) => setLocalFilters(prev => ({ ...prev, priceRange: values as [number, number] }))}
              min={0}
              max={500}
              step={10}
              allowOverlap={false}
              snapped
              selectedStyle={{ backgroundColor: theme.primary }}
              unselectedStyle={{ backgroundColor: theme.surfaceHighlight }}
              markerStyle={styles.sliderMarker}
            />
            <View style={styles.priceLabels}>
              <Text style={styles.priceText}>৳{localFilters.priceRange[0]}</Text>
              <Text style={styles.priceText}>৳{localFilters.priceRange[1]}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parking Type</Text>
          <View style={styles.chipContainer}>
            {(['hourly', 'daily', 'monthly'] as ParkingType[]).map(type => (
              <TouchableOpacity 
                key={type}
                style={[
                  styles.chip, 
                  localFilters.parkingType === type && styles.chipSelected
                ]}
                onPress={() => toggleParkingType(type)}
              >
                <Text style={[
                  styles.chipText,
                  localFilters.parkingType === type && styles.chipTextSelected
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Support</Text>
          <View style={styles.chipContainer}>
            {(['sedan', 'suv', 'motorcycle', 'compact'] as VehicleType[]).map(type => (
              <TouchableOpacity 
                key={type}
                style={[
                  styles.chip, 
                  localFilters.vehicleType === type && styles.chipSelected
                ]}
                onPress={() => toggleVehicleType(type)}
              >
                <Text style={[
                  styles.chipText,
                  localFilters.vehicleType === type && styles.chipTextSelected
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <TouchableOpacity 
            style={styles.amenityRow} 
            onPress={() => toggleAmenity('isCovered')}
          >
            <View style={styles.amenityInfo}>
              <Icon name="warehouse" size={24} color={theme.textPrimary} />
              <Text style={styles.amenityText}>Covered Parking</Text>
            </View>
            <Icon 
              name={localFilters.isCovered ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={localFilters.isCovered ? theme.primary : theme.textTertiary} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.amenityRow}
            onPress={() => toggleAmenity('hasEVCharging')}
          >
            <View style={styles.amenityInfo}>
              <Icon name="ev-station" size={24} color={theme.textPrimary} />
              <Text style={styles.amenityText}>EV Charging</Text>
            </View>
            <Icon 
              name={localFilters.hasEVCharging ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={localFilters.hasEVCharging ? theme.primary : theme.textTertiary} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.amenityRow}
            onPress={() => toggleAmenity('hasSecurity')}
          >
            <View style={styles.amenityInfo}>
              <Icon name="shield-check" size={24} color={theme.textPrimary} />
              <Text style={styles.amenityText}>24/7 Security</Text>
            </View>
            <Icon 
              name={localFilters.hasSecurity ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={localFilters.hasSecurity ? theme.primary : theme.textTertiary} 
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.xl) }]}>
        <Button title="Apply Filters" onPress={applyFilters} />
      </View>
    </View>
  );
};

const createStyles = (theme: typeof DarkTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  resetText: {
    color: theme.error,
    fontWeight: '600',
    fontSize: Fonts.sizes.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  section: {
    marginBottom: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: Spacing.lg,
  },
  sliderContainer: {
    alignItems: 'center',
  },
  sliderMarker: {
    backgroundColor: theme.white,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.primary,
    ...Shadows.sm,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Spacing.sm,
  },
  priceText: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  chipSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  chipText: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: theme.white,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  amenityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  amenityText: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
  },
  footer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
});
