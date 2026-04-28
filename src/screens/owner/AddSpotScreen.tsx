import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Switch,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, DarkTheme, Shadows } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { ParkingType, VehicleType } from '../../types';

const { width } = Dimensions.get('window');

export const AddSpotScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const { addSpot, currentUser } = useAppStore();

  const [form, setForm] = useState({
    title: '',
    address: '',
    description: '',
    pricePerHour: '',
    pricePerDay: '',
    pricePerMonth: '',
    isCovered: false,
    hasEVCharging: false,
    hasSecurity: false,
    availableTypes: [] as ParkingType[],
    vehicleTypes: [] as VehicleType[],
  });

  const toggleParkingType = (type: ParkingType) => {
    setForm(prev => ({
      ...prev,
      availableTypes: prev.availableTypes.includes(type)
        ? prev.availableTypes.filter(t => t !== type)
        : [...prev.availableTypes, type]
    }));
  };

  const toggleVehicleType = (type: VehicleType) => {
    setForm(prev => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter(t => t !== type)
        : [...prev.vehicleTypes, type]
    }));
  };

  const handleSave = () => {
    if (!form.title || !form.address || !form.pricePerHour) {
      alert('Please fill in required fields');
      return;
    }

    const newSpot = {
      id: Math.random().toString(36).substr(2, 9),
      ownerId: currentUser?.id || 'u2',
      ownerName: currentUser?.name || 'Bob Owner',
      ownerAvatar: currentUser?.avatar || '',
      ownerRating: currentUser?.rating || 5.0,
      title: form.title,
      description: form.description,
      address: form.address,
      latitude: 23.7949, // Mock Dhaka coordinates
      longitude: 90.4143,
      images: ['https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&w=1000&q=80'],
      pricePerHour: parseFloat(form.pricePerHour),
      pricePerDay: parseFloat(form.pricePerDay) || 0,
      pricePerMonth: parseFloat(form.pricePerMonth) || 0,
      availableTypes: form.availableTypes,
      amenities: [],
      vehicleTypes: form.vehicleTypes,
      isActive: true,
      isCovered: form.isCovered,
      hasEVCharging: form.hasEVCharging,
      hasSecurity: form.hasSecurity,
      rating: 0,
      totalBookings: 0,
      totalReviews: 0,
      reviews: [],
      availableFrom: '00:00',
      availableTo: '23:59',
    };

    addSpot(newSpot);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing.xl) }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>List New Parking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Listing Title (e.g., Secure Garage Gulshan)"
            placeholderTextColor={theme.textTertiary}
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Full Address in Bangladesh"
            placeholderTextColor={theme.textTertiary}
            value={form.address}
            onChangeText={(text) => setForm({ ...form, address: text })}
            multiline
            numberOfLines={3}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (Optional)"
            placeholderTextColor={theme.textTertiary}
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing (৳)</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceInputContainer}>
              <Text style={styles.label}>Hourly</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={theme.textTertiary}
                value={form.pricePerHour}
                onChangeText={(text) => setForm({ ...form, pricePerHour: text })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.priceInputContainer}>
              <Text style={styles.label}>Daily</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={theme.textTertiary}
                value={form.pricePerDay}
                onChangeText={(text) => setForm({ ...form, pricePerDay: text })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.priceInputContainer}>
              <Text style={styles.label}>Monthly</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={theme.textTertiary}
                value={form.pricePerMonth}
                onChangeText={(text) => setForm({ ...form, pricePerMonth: text })}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features & Amenities</Text>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Icon name="warehouse" size={24} color={theme.textPrimary} />
              <Text style={styles.switchText}>Covered Parking</Text>
            </View>
            <Switch
              value={form.isCovered}
              onValueChange={(val) => setForm({ ...form, isCovered: val })}
              trackColor={{ false: theme.surfaceHighlight, true: theme.primary }}
            />
          </View>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Icon name="ev-station" size={24} color={theme.textPrimary} />
              <Text style={styles.switchText}>EV Charging Available</Text>
            </View>
            <Switch
              value={form.hasEVCharging}
              onValueChange={(val) => setForm({ ...form, hasEVCharging: val })}
              trackColor={{ false: theme.surfaceHighlight, true: theme.primary }}
            />
          </View>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Icon name="shield-check" size={24} color={theme.textPrimary} />
              <Text style={styles.switchText}>24/7 Security/CCTV</Text>
            </View>
            <Switch
              value={form.hasSecurity}
              onValueChange={(val) => setForm({ ...form, hasSecurity: val })}
              trackColor={{ false: theme.surfaceHighlight, true: theme.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supported Vehicles</Text>
          <View style={styles.chipContainer}>
            {(['sedan', 'suv', 'motorcycle', 'compact'] as VehicleType[]).map(type => (
              <TouchableOpacity 
                key={type}
                style={[
                  styles.chip, 
                  form.vehicleTypes.includes(type) && styles.chipSelected
                ]}
                onPress={() => toggleVehicleType(type)}
              >
                <Text style={[
                  styles.chipText,
                  form.vehicleTypes.includes(type) && styles.chipTextSelected
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Icon name="camera-plus" size={32} color={theme.textSecondary} />
            <Text style={styles.uploadText}>Add Photos</Text>
          </TouchableOpacity>
        </View>

        <Button 
          title="List Parking Spot" 
          onPress={handleSave}
          style={{ marginTop: Spacing.xl, marginBottom: Spacing.xxxl }} 
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: Spacing.md,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priceRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  priceInputContainer: {
    flex: 1,
  },
  label: {
    color: theme.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  switchText: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
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
  uploadBox: {
    width: '100%',
    height: 120,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surface,
  },
  uploadText: {
    color: theme.textSecondary,
    marginTop: Spacing.sm,
    fontSize: Fonts.sizes.sm,
  },
});
