import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { VehicleType } from '../../types';

export const AddVehicleScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const { addVehicle } = useAppStore();

  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    plateNumber: '',
    type: 'sedan' as VehicleType,
  });

  const handleSave = () => {
    if (!form.make || !form.model || !form.plateNumber) {
      alert('Please fill in required fields');
      return;
    }

    const newVehicle = {
      id: Math.random().toString(36).substr(2, 9),
      make: form.make,
      model: form.model,
      year: parseInt(form.year) || 2024,
      color: form.color,
      plateNumber: form.plateNumber,
      type: form.type,
    };

    addVehicle(newVehicle);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing.xl) }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Vehicle</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Make (e.g., Toyota)"
            placeholderTextColor={theme.textTertiary}
            value={form.make}
            onChangeText={(text) => setForm({ ...form, make: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Model (e.g., Corolla)"
            placeholderTextColor={theme.textTertiary}
            value={form.model}
            onChangeText={(text) => setForm({ ...form, model: text })}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: Spacing.md }]}
              placeholder="Year"
              placeholderTextColor={theme.textTertiary}
              value={form.year}
              onChangeText={(text) => setForm({ ...form, year: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Color"
              placeholderTextColor={theme.textTertiary}
              value={form.color}
              onChangeText={(text) => setForm({ ...form, color: text })}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Plate Number (e.g., Dhaka Metro-GA-1234)"
            placeholderTextColor={theme.textTertiary}
            value={form.plateNumber}
            onChangeText={(text) => setForm({ ...form, plateNumber: text })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Type</Text>
          <View style={styles.chipContainer}>
            {(['sedan', 'suv', 'motorcycle', 'compact', 'truck'] as VehicleType[]).map(type => (
              <TouchableOpacity 
                key={type}
                style={[
                  styles.chip, 
                  form.type === type && styles.chipSelected
                ]}
                onPress={() => setForm({ ...form, type })}
              >
                <Text style={[
                  styles.chipText,
                  form.type === type && styles.chipTextSelected
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button 
          title="Save Vehicle" 
          onPress={handleSave}
          style={{ marginTop: Spacing.xl }} 
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
  row: {
    flexDirection: 'row',
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
});
