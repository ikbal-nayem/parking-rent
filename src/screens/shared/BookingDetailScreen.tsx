import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

const { width } = Dimensions.get('window');

export const BookingDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingId } = route.params || {};
  
  const { bookings, currentRole, cancelBooking } = useAppStore();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) return null;

  const isOwnerView = currentRole === 'owner';
  
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const dateString = startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeString = `${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')} - ${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')}`;

  const getStatusConfig = () => {
    switch (booking.status) {
      case 'active':
        return { color: theme.success, bg: theme.successLight, icon: 'clock-check-outline' };
      case 'upcoming':
        return { color: theme.primary, bg: theme.primaryFaded, icon: 'calendar-clock' };
      case 'completed':
        return { color: theme.textSecondary, bg: theme.surfaceHighlight, icon: 'check-circle-outline' };
      case 'cancelled':
        return { color: theme.error, bg: theme.errorLight, icon: 'close-circle-outline' };
      default:
        return { color: theme.textSecondary, bg: theme.surfaceHighlight, icon: 'help-circle-outline' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.md) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="help-circle-outline" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Spot Info */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: booking.spotImage }} style={styles.spotImage} />
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Icon name={statusConfig.icon} size={16} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>{booking.status}</Text>
          </View>
        </View>

        <Text style={styles.spotTitle}>{booking.spotTitle}</Text>
        <Text style={styles.spotAddress}>{booking.spotAddress}</Text>

        {/* Time Info */}
        <View style={styles.dateBlock}>
          <Icon name="calendar-range" size={24} color={theme.primary} />
          <View style={styles.dateInfo}>
            <Text style={styles.dateText}>{dateString}</Text>
            <Text style={styles.timeText}>{timeString}</Text>
          </View>
        </View>

        {/* User / Vehicle Info */}
        <View style={[styles.card, styles.section]}>
          <View style={styles.userRow}>
            <View style={[styles.userIcon, { backgroundColor: theme.primaryFaded }]}>
              <Icon name={isOwnerView ? "car" : "account"} size={20} color={theme.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{isOwnerView ? booking.driverName : booking.vehicleName}</Text>
              <Text style={styles.userRole}>{isOwnerView ? 'Driver' : 'Vehicle'}</Text>
            </View>
            <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate('Chat', { userId: isOwnerView ? booking.driverId : booking.ownerId })}>
              <Icon name="chat" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Info */}
        {!isOwnerView && (
            <View style={[styles.card, styles.section]}>
                <View style={styles.infoRow}>
                    <View style={[styles.infoIcon, { backgroundColor: theme.surfaceHighlight }]}>
                        <Icon name="map-marker" size={24} color={theme.textPrimary} />
                    </View>
                    <View style={styles.infoText}>
                        <Text style={styles.infoLabel}>Navigation</Text>
                        <Text style={styles.infoValue}>Get Directions</Text>
                    </View>
                    <Icon name="chevron-right" size={24} color={theme.textSecondary} />
                </View>
            </View>
        )}

        {/* QR Code */}
        {(booking.status === 'upcoming' || booking.status === 'active') && !isOwnerView && (
          <View style={[styles.card, styles.qrCard, styles.section]}>
            <Text style={styles.qrTitle}>Scan to Enter/Exit</Text>
            <View style={styles.qrCode}>
              <Icon name="qrcode-scan" size={100} color={theme.textPrimary} />
            </View>
            <Text style={styles.qrText}>Hold near the scanner at the gate</Text>
          </View>
        )}

        {/* Price Info */}
        <View style={[styles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total Amount</Text>
            <Text style={styles.priceValue}>৳{booking.totalPrice.toFixed(0)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>৳{booking.totalPrice.toFixed(0)}</Text>
          </View>
        </View>

        {/* Actions */}
        {booking.status === 'upcoming' && !isOwnerView && (
          <Button 
            title="Cancel Booking" 
            variant="danger" 
            onPress={() => {
              cancelBooking(booking.id);
              navigation.goBack();
            }}
            style={styles.cancelButton}
          />
        )}

        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingId}>Booking ID: {booking.id}</Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
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
  content: {
    padding: Spacing.xl,
  },
  imageContainer: {
    height: 200,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  spotImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
  },
  statusText: {
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: Fonts.sizes.sm,
    textTransform: 'capitalize',
  },
  spotTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  spotAddress: {
    fontSize: Fonts.sizes.base,
    color: theme.textSecondary,
    marginBottom: Spacing.lg,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: Spacing.xl,
  },
  dateInfo: {
    marginLeft: Spacing.md,
  },
  dateText: {
    fontSize: Fonts.sizes.base,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  timeText: {
    fontSize: Fonts.sizes.sm,
    color: theme.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: theme.border,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Fonts.sizes.base,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  userRole: {
    fontSize: Fonts.sizes.sm,
    color: theme.textSecondary,
  },
  contactActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primaryFaded,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Fonts.sizes.sm,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: Fonts.sizes.base,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  qrCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  qrTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: Spacing.md,
  },
  qrCode: {
    width: 150,
    height: 150,
    backgroundColor: theme.background, // Should be white for proper QR rendering
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  qrText: {
    fontSize: Fonts.sizes.sm,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    fontSize: Fonts.sizes.base,
    color: theme.textSecondary,
  },
  priceValue: {
    fontSize: Fonts.sizes.base,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: Spacing.md,
  },
  totalLabel: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  totalValue: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: theme.price,
  },
  bookingIdContainer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },
  bookingId: {
    fontSize: Fonts.sizes.sm,
    color: theme.textTertiary,
  },
  cancelButton: {
    backgroundColor: theme.errorLight,
  },
});
