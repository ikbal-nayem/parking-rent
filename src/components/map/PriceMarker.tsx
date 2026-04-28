import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { ParkingSpot } from '../../types';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface PriceMarkerProps {
  spot: ParkingSpot;
  isSelected?: boolean;
  onPress: () => void;
}

export const PriceMarker: React.FC<PriceMarkerProps> = ({ 
  spot, 
  isSelected = false,
  onPress 
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <Marker
      coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
      onPress={onPress}
      tracksViewChanges={false} // Optimization for React Native Maps
    >
      <View style={[
        styles.container,
        isSelected && styles.containerSelected
      ]}>
        <Text style={[
          styles.text,
          isSelected && styles.textSelected
        ]}>
          ৳{spot.pricePerHour}/h
        </Text>
        <View style={[
          styles.triangle,
          isSelected && styles.triangleSelected
        ]} />
      </View>
    </Marker>
  );
};

const createStyles = (theme: typeof DarkTheme) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: theme.border,
    ...Shadows.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primaryDark,
    ...Shadows.glow(theme.primary),
    transform: [{ scale: 1.1 }],
  },
  text: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
  },
  textSelected: {
    color: theme.white,
  },
  triangle: {
    position: 'absolute',
    bottom: -6,
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
  triangleSelected: {
    borderTopColor: theme.primary,
  },
});
