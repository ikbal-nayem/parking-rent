import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Vehicle } from '../../types';

export const MyVehiclesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const { currentUser, removeVehicle } = useAppStore();
  const vehicles = currentUser?.vehicles || [];

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Vehicle",
      "Are you sure you want to remove this vehicle?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => removeVehicle(id) }
      ]
    );
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleCard}>
      <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
        <Icon 
          name={item.type === 'motorcycle' ? 'bike' : 'car'} 
          size={30} 
          color={theme.primary} 
        />
      </View>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{item.make} {item.model}</Text>
        <Text style={styles.vehiclePlate}>{item.plateNumber} • {item.color}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Icon name="trash-can-outline" size={20} color={theme.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing.xl) }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={renderVehicle}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="car-off" size={64} color={theme.textTertiary} />
            <Text style={styles.emptyText}>No vehicles added yet</Text>
          </View>
        }
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.xl) }]}>
        <Button 
          title="Add New Vehicle" 
          onPress={() => {
            navigation.navigate('AddVehicle');
          }} 
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
    marginBottom: Spacing.xl,
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
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: theme.border,
    ...Shadows.sm,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: Fonts.sizes.base,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  vehiclePlate: {
    fontSize: Fonts.sizes.sm,
    color: theme.textSecondary,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: Fonts.sizes.base,
    color: theme.textSecondary,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
});
