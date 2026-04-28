import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';

const { width } = Dimensions.get('window');

export const SpotDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { spotId } = route.params || {};
  const { spots } = useAppStore();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const spot = spots.find(s => s.id === spotId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!spot) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Parking spot not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {spot.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.image} />
            ))}
          </ScrollView>
          
          {/* Header Action Buttons */}
          <View style={[styles.headerActions, { top: Math.max(insets.top, Spacing.md) }]}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color={theme.white} />
            </TouchableOpacity>
            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="share-variant" size={24} color={theme.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="heart-outline" size={24} color={theme.white} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Image Dots */}
          {spot.images.length > 1 && (
            <View style={styles.dotsContainer}>
              {spot.images.map((_, idx) => (
                <View 
                  key={idx} 
                  style={[styles.dot, activeImageIndex === idx && styles.activeDot]} 
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{spot.title}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={18} color={theme.warning} />
              <Text style={styles.rating}>{spot.rating}</Text>
              <Text style={styles.reviews}>({spot.totalReviews} reviews)</Text>
              <View style={styles.dotSeparator} />
              <Icon name="walk" size={16} color={theme.textSecondary} />
              <Text style={styles.distance}>{spot.walkingTime || 5} min walk</Text>
            </View>
            <Text style={styles.address}>{spot.address}</Text>
          </View>

          {/* Badges */}
          <View style={styles.badgesContainer}>
            {spot.isCovered && <Badge label="Covered" variant="info" style={styles.badge} />}
            {spot.hasEVCharging && <Badge label="EV Charging" variant="success" style={styles.badge} />}
            {spot.hasSecurity && <Badge label="Secure" variant="primary" style={styles.badge} />}
          </View>

          <View style={styles.divider} />

          {/* Owner Info */}
          <View style={styles.ownerCard}>
            <Avatar url={spot.ownerAvatar} size={50} />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{spot.ownerName}</Text>
              <View style={styles.ownerStatsRow}>
                <Icon name="star" size={14} color={theme.warning} />
                <Text style={styles.ownerStatsText}>{spot.ownerRating}</Text>
                <Text style={styles.ownerStatsLabel}> • Super Host</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="chat-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this spot</Text>
            <Text style={styles.description}>{spot.description}</Text>
          </View>

          <View style={styles.divider} />

          {/* Features/Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              {spot.amenities.map((item, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="check-circle" size={20} color={theme.success} style={styles.featureIcon} />
                  <Text style={styles.featureText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Spacer for bottom bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceValue}>${spot.pricePerHour}</Text>
          <Text style={styles.priceLabel}>/ hour</Text>
        </View>
        <Button 
          title="Book Now" 
          onPress={() => navigation.navigate('BookingFlow', { spotId: spot.id })}
          style={styles.bookButton}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: typeof DarkTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    color: theme.error,
    fontSize: Fonts.sizes.lg,
    marginBottom: Spacing.xl,
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  image: {
    width,
    height: 300,
    resizeMode: 'cover',
  },
  headerActions: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.mapOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: Spacing.md,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeDot: {
    backgroundColor: theme.white,
    width: 16,
  },
  content: {
    padding: Spacing.xl,
  },
  headerInfo: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rating: {
    color: theme.textPrimary,
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.textSecondary,
    marginHorizontal: Spacing.sm,
  },
  distance: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginLeft: 4,
  },
  address: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.base,
    lineHeight: 22,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  badge: {
    marginRight: 0,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: Spacing.xl,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  ownerName: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: '600',
    marginBottom: 2,
  },
  ownerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerStatsText: {
    color: theme.textPrimary,
    fontWeight: '600',
    fontSize: Fonts.sizes.sm,
    marginLeft: 4,
  },
  ownerStatsLabel: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
  },
  contactButton: {
    padding: Spacing.sm,
    backgroundColor: theme.primaryFaded,
    borderRadius: BorderRadius.md,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  description: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.base,
    lineHeight: 24,
  },
  featuresList: {
    gap: Spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: Spacing.md,
  },
  featureText: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    ...Shadows.lg,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.xxxl,
    fontWeight: 'bold',
  },
  priceLabel: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.base,
    marginLeft: 4,
  },
  bookButton: {
    minWidth: 150,
  },
});
