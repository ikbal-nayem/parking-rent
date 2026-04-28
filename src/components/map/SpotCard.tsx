import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ParkingSpot } from '../../types';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../common/Badge';

interface SpotCardProps {
  spot: ParkingSpot;
  onPress: () => void;
  style?: ViewStyle;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, onPress, style }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress}
      style={[styles.container, style]}
    >
      <Image 
        source={{ uri: spot.images[0] }} 
        style={styles.image} 
      />
      
      <View style={styles.badgeContainer}>
        {spot.isCovered && <Badge label="Covered" variant="info" style={styles.badge} />}
        {spot.hasEVCharging && <Badge label="EV" variant="success" style={styles.badge} />}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{spot.title}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color={theme.warning} />
            <Text style={styles.rating}>{spot.rating}</Text>
          </View>
        </View>

        <Text style={styles.address} numberOfLines={1}>{spot.address}</Text>

        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>৳{spot.pricePerHour}</Text>
            <Text style={styles.priceUnit}>/hr</Text>
          </View>
          
          <View style={styles.distanceContainer}>
            <Icon name="walk" size={14} color={theme.textSecondary} />
            <Text style={styles.distance}>
              {spot.walkingTime || 5} min
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: typeof DarkTheme) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
    borderWidth: 1,
    borderColor: theme.border,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: theme.surfaceHighlight,
  },
  badgeContainer: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
  },
  badge: {
    marginRight: Spacing.xs,
  },
  content: {
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    flex: 1,
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceHighlight,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  rating: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
    marginLeft: 2,
  },
  address: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginBottom: Spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    color: theme.price,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
  },
  priceUnit: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginLeft: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginLeft: 4,
  },
});
