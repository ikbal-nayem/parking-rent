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
import { PaymentMethod } from '../../types';

const DUMMY_PAYMENTS: PaymentMethod[] = [
  { id: 'p1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true, expiry: '12/25' },
  { id: 'p2', type: 'bkash', accountNumber: '017****5678', isDefault: false },
  { id: 'p3', type: 'nagad', accountNumber: '018****1234', isDefault: false },
];

export const PaymentMethodsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const [methods, setMethods] = useState<PaymentMethod[]>(DUMMY_PAYMENTS);

  const getIcon = (type: string) => {
    switch (type) {
      case 'card': return 'credit-card';
      case 'bkash': return 'wallet';
      case 'nagad': return 'wallet-outline';
      default: return 'credit-card';
    }
  };

  const renderItem = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: theme.surfaceHighlight }]}>
        <Icon name={getIcon(item.type)} size={24} color={theme.textPrimary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>
          {item.type === 'card' ? `${item.brand} •••• ${item.last4}` : `${item.type.toUpperCase()}`}
        </Text>
        <Text style={styles.subtitle}>
          {item.type === 'card' ? `Expires ${item.expiry}` : item.accountNumber}
        </Text>
      </View>
      {item.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultText}>Default</Text>
        </View>
      )}
      <Icon name="chevron-right" size={24} color={theme.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing.xl) }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={methods}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.xl) }]}>
        <Button 
          title="Add Payment Method" 
          onPress={() => Alert.alert("Add Payment", "Integration with SSLCommerz/Stripe coming soon!")} 
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
  },
  card: {
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
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: Fonts.sizes.base,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Fonts.sizes.sm,
    color: theme.textSecondary,
  },
  defaultBadge: {
    backgroundColor: theme.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  defaultText: {
    fontSize: 10,
    color: theme.success,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
});
