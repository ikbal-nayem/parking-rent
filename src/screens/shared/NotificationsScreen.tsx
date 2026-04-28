import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

export const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const { notifications, markNotificationAsRead } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return 'calendar-check';
      case 'payment': return 'cash';
      case 'message': return 'message-text';
      case 'system': return 'cog';
      default: return 'bell';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'booking': return theme.primary;
      case 'payment': return theme.success;
      case 'message': return theme.accent;
      case 'system': return theme.textSecondary;
      default: return theme.primary;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing.xl) }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
            onPress={() => markNotificationAsRead(item.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) + '20' }]}>
              <Icon name={getIcon(item.type)} size={24} color={getIconColor(item.type)} />
            </View>
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={[styles.notifTitle, !item.isRead && styles.unreadText]}>{item.title}</Text>
                {!item.isRead && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
              <Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bell-off-outline" size={64} color={theme.surfaceHighlight} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>We'll notify you when something important happens.</Text>
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
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: theme.surface,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: theme.border,
  },
  unreadItem: {
    borderColor: theme.primary + '40',
    backgroundColor: theme.surfaceHighlight + '10',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: theme.textPrimary,
    flex: 1,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primary,
    marginLeft: 8,
  },
  message: {
    fontSize: Fonts.sizes.sm,
    color: theme.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  time: {
    fontSize: 10,
    color: theme.textTertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Fonts.sizes.base,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
