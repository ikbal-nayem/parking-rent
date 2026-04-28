import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { DUMMY_EARNINGS } from '../../data/dummyData';
import { BookingCard } from '../../components/booking/BookingCard';

const { width } = Dimensions.get('window');

export const OwnerDashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { bookings } = useAppStore();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  // Get recent bookings for owner view
  const recentBookings = bookings.slice(0, 3);

  // Mock chart height data based on dummy earnings
  const maxEarnings = Math.max(...DUMMY_EARNINGS.weekly);
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, Spacing.xl) }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.title}>ParkRant Owner</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="bell" size={24} color={theme.primary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Earnings Overview Card */}
      <LinearGradient
        colors={theme.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.earningsCard}
      >
        <View style={styles.earningsHeader}>
          <View style={styles.earningsTitleRow}>
            <Icon name="wallet" size={20} color="rgba(255,255,255,0.9)" style={{ marginRight: 8 }} />
            <Text style={styles.earningsTitle}>Total Balance</Text>
          </View>
          <View style={styles.timeRangeBadge}>
            <Text style={styles.timeRangeText}>Live Updates</Text>
          </View>
        </View>
        <Text style={styles.earningsAmount}>৳{DUMMY_EARNINGS.thisMonthEarnings.toLocaleString()}</Text>
        
        <View style={styles.chartContainer}>
          {DUMMY_EARNINGS.weekly.map((amount, index) => {
            const heightPercentage = (amount / maxEarnings) * 100;
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { height: `${heightPercentage}%` },
                      index === DUMMY_EARNINGS.weekly.length - 1 && styles.barActive
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>W{index + 1}</Text>
              </View>
            );
          })}
        </View>
        
        <TouchableOpacity 
          style={styles.withdrawButton}
          onPress={() => navigation.navigate('PayoutMethods')}
        >
          <Icon name="bank-transfer" size={20} color={theme.primary} style={{ marginRight: 8 }} />
          <Text style={styles.withdrawButtonText}>Withdraw to Bank</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => navigation.navigate('Listings')}
        >
          <View style={[styles.statIconContainer, { backgroundColor: theme.primary + '15' }]}>
            <Icon name="map-marker-multiple" size={26} color={theme.primary} />
          </View>
          <View>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Active Spots</Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.textTertiary} style={styles.statArrow} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => navigation.navigate('Messages')}
        >
          <View style={[styles.statIconContainer, { backgroundColor: theme.accent + '15' }]}>
            <Icon name="message-draw" size={26} color={theme.accent} />
          </View>
          <View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>New Inquiries</Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.textTertiary} style={styles.statArrow} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsRow}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => navigation.navigate('AddSpot')}
        >
          <LinearGradient
            colors={theme.gradientAccent}
            style={styles.quickActionIcon}
          >
            <Icon name="plus" size={24} color={theme.white} />
          </LinearGradient>
          <Text style={styles.quickActionText}>Add Spot</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: theme.surfaceHighlight }]}>
            <Icon name="chart-box" size={24} color={theme.textPrimary} />
          </View>
          <Text style={styles.quickActionText}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: theme.surfaceHighlight }]}>
            <Icon name="shield-account" size={24} color={theme.textPrimary} />
          </View>
          <Text style={styles.quickActionText}>Security</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: theme.surfaceHighlight }]}>
            <Icon name="cog" size={24} color={theme.textPrimary} />
          </View>
          <Text style={styles.quickActionText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
          <Text style={styles.seeAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {recentBookings.map((booking) => (
        <BookingCard 
          key={booking.id} 
          booking={booking} 
          isOwnerView
          onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
        />
      ))}
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const createStyles = (theme: typeof DarkTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  greeting: {
    fontSize: Fonts.sizes.sm,
    color: theme.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    ...Shadows.sm,
  },
  notificationDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.error,
    borderWidth: 2,
    borderColor: theme.surface,
  },
  earningsCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    marginBottom: Spacing.xxl,
    ...Shadows.lg,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  earningsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  timeRangeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  timeRangeText: {
    color: theme.white,
    fontSize: 10,
    fontWeight: '800',
  },
  earningsAmount: {
    color: theme.white,
    fontSize: Fonts.sizes.hero,
    fontWeight: 'bold',
    marginBottom: Spacing.xl,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: Spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
  barWrapper: {
    alignItems: 'center',
    width: 32,
  },
  barContainer: {
    height: 50,
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
  },
  barActive: {
    backgroundColor: theme.white,
    shadowColor: theme.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  barLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    marginTop: 6,
    fontWeight: 'bold',
  },
  withdrawButton: {
    backgroundColor: theme.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
  withdrawButtonText: {
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: Fonts.sizes.base,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: theme.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.md,
  },
  statIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  statValue: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  statLabel: {
    color: theme.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statArrow: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
    marginTop: Spacing.md,
  },
  quickAction: {
    alignItems: 'center',
    width: width / 4 - Spacing.xl,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Shadows.sm,
  },
  quickActionText: {
    color: theme.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
  },
  seeAll: {
    color: theme.primary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
  },
});
