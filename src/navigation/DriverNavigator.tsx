import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/useTheme';

import { MapSearchScreen } from '../screens/driver/MapSearchScreen';
import { BookingsScreen } from '../screens/shared/BookingsScreen';
import { ChatListScreen } from '../screens/shared/ChatListScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';

const Tab = createBottomTabNavigator();

const DriverNavigator = () => {
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
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: -4,
        },
      }}
    >
      <Tab.Screen
        name="Explore"
        component={MapSearchScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "map-marker-radius" : "map-marker-radius-outline"} color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "calendar-clock" : "calendar-blank"} color={color} size={26} />
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
export default DriverNavigator;
