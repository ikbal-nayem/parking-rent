import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, Shadows, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const { currentUser, currentRole, toggleRole, logout, toggleTheme } = useAppStore();

  if (!currentUser) return null;

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
        <Text style={styles.title}>Account</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Icon name="cog-outline" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <Avatar url={currentUser.avatar} size={85} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
              <Icon name="shield-check" size={14} color={theme.primary} />
              <Text style={[styles.badgeText, { color: theme.primary }]}>Verified</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.accent + '20' }]}>
              <Icon name="star" size={14} color={theme.accent} />
              <Text style={[styles.badgeText, { color: theme.accent }]}>{currentUser.rating}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Icon name="pencil" size={20} color={theme.white} />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={currentRole === 'owner' ? theme.gradientAccent : theme.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.roleCard}
      >
        <View style={styles.roleInfo}>
          <View style={styles.roleIconContainer}>
            <Icon 
              name={currentRole === 'owner' ? "home-city" : "car-steering"} 
              size={28} 
              color={theme.white} 
            />
          </View>
          <View style={styles.roleTextContainer}>
            <Text style={styles.roleTitle}>
              {currentRole === 'owner' ? 'Owner Mode' : 'Driver Mode'}
            </Text>
            <Text style={styles.roleDesc}>
              {currentRole === 'owner' ? 'Tap to switch to finding parking' : 'Tap to switch to managing spots'}
            </Text>
          </View>
        </View>
        <Switch
          value={currentRole === 'owner'}
          onValueChange={toggleRole}
          trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.3)' }}
          thumbColor={theme.white}
        />
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Management</Text>
        
        {currentRole === 'driver' && (
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyVehicles')}
          >
            <View style={[styles.menuIcon, { backgroundColor: theme.primary + '15' }]}>
              <Icon name="car-multiple" size={22} color={theme.primary} />
            </View>
            <Text style={styles.menuText}>My Vehicles</Text>
            <Icon name="chevron-right" size={24} color={theme.textTertiary} />
          </TouchableOpacity>
        )}

        {currentRole === 'owner' && (
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('PayoutMethods')}
          >
            <View style={[styles.menuIcon, { backgroundColor: theme.accent + '15' }]}>
              <Icon name="bank-outline" size={22} color={theme.accent} />
            </View>
            <Text style={styles.menuText}>Payout Methods</Text>
            <Icon name="chevron-right" size={24} color={theme.textTertiary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('PaymentMethods')}
        >
          <View style={[styles.menuIcon, { backgroundColor: theme.info + '15' }]}>
            <Icon name="credit-card-outline" size={22} color={theme.info} />
          </View>
          <Text style={styles.menuText}>Payment Methods</Text>
          <Icon name="chevron-right" size={24} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
          <View style={[styles.menuIcon, { backgroundColor: theme.error + '15' }]}>
            <Icon name="bell-ring-outline" size={22} color={theme.error} />
          </View>
          <Text style={styles.menuText}>Notifications</Text>
          <Icon name="chevron-right" size={24} color={theme.textTertiary} />
        </TouchableOpacity>

        <View style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: theme.surfaceHighlight }]}>
            <Icon name={theme.background === '#0D0D0D' ? "moon-waning-crescent" : "white-balance-sunny"} size={22} color={theme.textPrimary} />
          </View>
          <Text style={styles.menuText}>Dark Mode</Text>
          <Switch
            value={theme.background === '#0D0D0D'}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.surfaceHighlight, true: theme.primary }}
            thumbColor={theme.white}
          />
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: theme.surfaceHighlight }]}>
            <Icon name="translate" size={22} color={theme.textPrimary} />
          </View>
          <Text style={styles.menuText}>Language</Text>
          <Text style={styles.menuValue}>English</Text>
          <Icon name="chevron-right" size={24} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal & About</Text>
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: theme.surfaceHighlight }]}>
            <Icon name="information-outline" size={22} color={theme.textPrimary} />
          </View>
          <Text style={styles.menuText}>About ParkRant</Text>
          <Icon name="chevron-right" size={24} color={theme.textTertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: theme.surfaceHighlight }]}>
            <Icon name="file-document-outline" size={22} color={theme.textPrimary} />
          </View>
          <Text style={styles.menuText}>Terms of Service</Text>
          <Icon name="chevron-right" size={24} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>

      <Button 
        title="Log Out" 
        variant="outline" 
        onPress={logout}
        style={styles.logoutButton}
        icon={<Icon name="logout" size={20} color={theme.error} style={{ marginRight: 8 }} />}
        textStyle={{ color: theme.error }}
      />
      
      <Text style={styles.version}>Version 1.2.4 (Premium)</Text>
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
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Fonts.sizes.title,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: theme.border,
    ...Shadows.md,
  },
  avatar: {
    marginRight: Spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  email: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginBottom: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.xxxl,
    ...Shadows.md,
  },
  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  roleTitle: {
    color: theme.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
  },
  roleDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
    color: theme.textPrimary,
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
  },
  menuValue: {
    color: theme.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginRight: 4,
  },
  logoutButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    borderColor: theme.error + '40',
  },
  version: {
    color: theme.textTertiary,
    fontSize: Fonts.sizes.xs,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
