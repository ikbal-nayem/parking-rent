import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';

export const BookingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { spotId } = route.params || {};
  const { spots, currentUser, addBooking } = useAppStore();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const spot = spots.find(s => s.id === spotId);
  const vehicle = currentUser?.vehicles?.[0]; // Get primary vehicle
  
  // Mock state for booking details
  const [hours, setHours] = useState(2);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('14:00');

  if (!spot) return null;

  const totalPrice = spot.pricePerHour * hours;
  const serviceFee = totalPrice * 0.1; // 10% service fee
  const finalPrice = totalPrice + serviceFee;

  const handleConfirmBooking = () => {
    if (!currentUser || !vehicle) {
      Alert.alert('Error', 'Missing user or vehicle details');
      return;
    }

    // Create a mock booking
    const newBooking = {
      id: `b_${Date.now()}`,
      spotId: spot.id,
      spotTitle: spot.title,
      spotAddress: spot.address,
      spotImage: spot.images[0],
      driverId: currentUser.id,
      driverName: currentUser.name,
      ownerId: spot.ownerId,
      ownerName: spot.ownerName,
      startTime: new Date().toISOString(), // Mock time
      endTime: new Date(Date.now() + hours * 3600000).toISOString(),
      totalPrice: finalPrice,
      status: 'upcoming' as const,
      parkingType: 'hourly' as const,
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`,
      qrCode: `qr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);
    
    Alert.alert(
      'Booking Confirmed!',
      'Your parking spot has been reserved successfully.',
      [
        { text: 'View Booking', onPress: () => navigation.navigate('BookingDetail', { bookingId: newBooking.id }) },
        { text: 'Back to Home', onPress: () => navigation.navigate('Map') }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={styles.backButton} /> {/* Placeholder for balance */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Spot Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.spotCard}>
            <View style={styles.spotInfo}>
              <Text style={styles.spotTitle}>{spot.title}</Text>
              <Text style={styles.spotAddress}>{spot.address}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>${spot.pricePerHour}/hr</Text>
            </View>
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationSelector}>
            <TouchableOpacity 
              style={styles.durationButton}
              onPress={() => setHours(Math.max(1, hours - 1))}
            >
              <Icon name="minus" size={24} color={theme.primary} />
            </TouchableOpacity>
            
            <View style={styles.durationDisplay}>
              <Text style={styles.durationValue}>{hours}</Text>
              <Text style={styles.durationLabel}>Hours</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.durationButton}
              onPress={() => setHours(Math.min(24, hours + 1))}
            >
              <Icon name="plus" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Vehicle Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Vehicle</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleIconContainer}>
              <Icon name="car-side" size={24} color={theme.primary} />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle?.make} {vehicle?.model}</Text>
              <Text style={styles.vehiclePlate}>{vehicle?.plateNumber}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentCard}>
            <View style={styles.vehicleIconContainer}>
              <Icon name="credit-card-outline" size={24} color={theme.primary} />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>•••• •••• •••• 4242</Text>
              <Text style={styles.vehiclePlate}>Mastercard</Text>
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Parking (${spot.pricePerHour} × {hours}h)</Text>
            <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${finalPrice.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer Action */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
        <Button 
          title={`Pay $${finalPrice.toFixed(2)} & Book`} 
          onPress={handleConfirmBooking}
          style={styles.payButton}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  editText: {
    color: theme.primary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  spotCard: {
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  spotInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  spotTitle: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  spotAddress: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
  },
  priceTag: {
    backgroundColor: theme.primaryFaded,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  priceText: {
    color: theme.primaryLight,
    fontWeight: 'bold',
  },
  durationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: theme.border,
  },
  durationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationDisplay: {
    alignItems: 'center',
    marginHorizontal: Spacing.xxl,
  },
  durationValue: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.hero,
    fontWeight: 'bold',
  },
  durationLabel: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: theme.border,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: theme.border,
  },
  vehicleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: theme.primaryFaded,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  vehiclePlate: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.base,
  },
  priceValue: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
  },
  totalValue: {
    color: theme.price,
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.surface,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    ...Shadows.lg,
  },
  payButton: {
    width: '100%',
  },
});
