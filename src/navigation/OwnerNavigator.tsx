import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/useTheme';

import { OwnerDashboardScreen } from '../screens/owner/OwnerDashboardScreen';
import { MyListingsScreen } from '../screens/owner/MyListingsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { ChatListScreen } from '../screens/shared/ChatListScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';

const Tab = createBottomTabNavigator();

const OwnerNavigator = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.accent, 
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: -4,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={OwnerDashboardScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "view-dashboard" : "view-dashboard-outline"} color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Listings" 
        component={MyListingsScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "format-list-bulleted" : "format-list-bulleted-type"} color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Messages" 
        component={ChatListScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "message-text" : "message-text-outline"} color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "bell" : "bell-outline"} color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "account" : "account-outline"} color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default OwnerNavigator;
