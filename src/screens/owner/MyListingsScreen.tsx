import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../../components/common/Badge';

export const MyListingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { spots, currentUser } = useAppStore();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  // Get only spots owned by current user
  const mySpots = spots.filter(s => s.ownerId === currentUser?.id);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing.xl) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Listings</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('AddSpot');
          }}
        >
          <Icon name="plus" size={24} color={theme.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mySpots}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => {
              // Edit listing
            }}
          >
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <View style={styles.content}>
              <View style={styles.cardHeader}>
                <Text style={styles.spotTitle} numberOfLines={1}>{item.title}</Text>
                <Badge 
                  label={item.isActive ? 'Active' : 'Inactive'} 
                  variant={item.isActive ? 'success' : 'default'} 
                />
              </View>
              
              <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Icon name="cash" size={16} color={theme.textSecondary} />
                  <Text style={styles.statText}>৳{item.pricePerHour}/hr</Text>
                </View>
                <View style={styles.stat}>
                  <Icon name="car" size={16} color={theme.textSecondary} />
                  <Text style={styles.statText}>{item.totalBookings} Bookings</Text>
                </View>
                <View style={styles.stat}>
                  <Icon name="star" size={16} color={theme.warning} />
                  <Text style={styles.statText}>{item.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="home-city-outline" size={64} color={theme.surfaceHighlight} />
            <Text style={styles.emptyTitle}>No Listings Yet</Text>
            <Text style={styles.emptyText}>Add your first parking spot to start earning.</Text>
          </View>
        }
      />
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
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Fonts.sizes.title,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  listContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.xs,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: theme.border,
    ...Shadows.sm,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: theme.surfaceHighlight,
  },
  content: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  spotTitle: {
    flex: 1,
    color: theme.textPrimary,
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    marginRight: Spacing.sm,
  },
  address: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
    marginTop: 60,
  },
  emptyTitle: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.base,
    textAlign: 'center',
    lineHeight: 22,
  },
});
