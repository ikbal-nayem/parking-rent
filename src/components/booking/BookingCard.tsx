import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Booking } from '../../types';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../common/Badge';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  isOwnerView?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onPress,
  isOwnerView = false
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const getStatusConfig = () => {
    switch (booking.status) {
      case 'active':
        return { variant: 'success' as const, label: 'Active Now' };
      case 'upcoming':
        return { variant: 'info' as const, label: 'Upcoming' };
      case 'completed':
        return { variant: 'default' as const, label: 'Completed' };
      case 'cancelled':
        return { variant: 'error' as const, label: 'Cancelled' };
      default:
        return { variant: 'default' as const, label: booking.status };
    }
  };

  const statusConfig = getStatusConfig();
  
  // Format dates manually for dummy data (in a real app, use date-fns or similar)
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  
  const dateString = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeString = `${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')} - ${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')}`;

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.header}>
        <Badge label={statusConfig.label} variant={statusConfig.variant} />
        <Text style={styles.price}>৳{booking.totalPrice.toFixed(0)}</Text>
      </View>

      <View style={styles.content}>
        <Image source={{ uri: booking.spotImage }} style={styles.image} />
        
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>{booking.spotTitle}</Text>
          <Text style={styles.address} numberOfLines={1}>{booking.spotAddress}</Text>
          
          <View style={styles.timeContainer}>
            <Icon name="calendar-clock" size={14} color={theme.textSecondary} />
            <Text style={styles.timeText}>{dateString} • {timeString}</Text>
          </View>
          
          <View style={styles.userContainer}>
            <Icon name={isOwnerView ? "car" : "account"} size={14} color={theme.textSecondary} />
            <Text style={styles.userText}>
              {isOwnerView ? booking.driverName : booking.ownerName}
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
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: theme.border,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  price: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
    backgroundColor: theme.surfaceHighlight,
    marginRight: Spacing.md,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginBottom: Spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.xs,
    marginLeft: 4,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.xs,
    marginLeft: 4,
  },
});
