import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '../../store';
import { Fonts, Spacing, BorderRadius, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

export const ChatListScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const { chatThreads } = useAppStore();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing.xl) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <FlatList
        data={chatThreads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.threadItem}
            onPress={() => navigation.navigate('Chat', { threadId: item.id, title: item.participantName })}
          >
            <Image source={{ uri: item.participantAvatar }} style={styles.avatar} />
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.participantName}</Text>
                <Text style={styles.time}>{new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="message-text-outline" size={64} color={theme.surfaceHighlight} />
            <Text style={styles.emptyTitle}>No Messages</Text>
            <Text style={styles.emptyText}>When you contact a driver or owner, messages will appear here.</Text>
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
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Fonts.sizes.title,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
  },
  threadItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.surfaceHighlight,
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
  name: {
    fontSize: Fonts.sizes.base,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  time: {
    fontSize: 12,
    color: theme.textTertiary,
  },
  lastMessage: {
    fontSize: Fonts.sizes.sm,
    color: theme.textSecondary,
    flex: 1,
    marginRight: Spacing.md,
  },
  unreadBadge: {
    backgroundColor: theme.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: theme.white,
    fontSize: 10,
    fontWeight: 'bold',
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
