import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppStore } from '../store';

import DriverNavigator from './DriverNavigator';
import OwnerNavigator from './OwnerNavigator';
import { SpotDetailScreen } from '../screens/driver/SpotDetailScreen';
import { BookingScreen } from '../screens/driver/BookingScreen';
import { BookingDetailScreen } from '../screens/shared/BookingDetailScreen';
import { ChatScreen } from '../screens/shared/ChatScreen';
import { EditProfileScreen } from '../screens/shared/EditProfileScreen';
import { MyVehiclesScreen } from '../screens/shared/MyVehiclesScreen';
import { PaymentMethodsScreen } from '../screens/shared/PaymentMethodsScreen';
import { PayoutMethodsScreen } from '../screens/shared/PayoutMethodsScreen';
import { FiltersScreen } from '../screens/driver/FiltersScreen';
import { AddSpotScreen } from '../screens/owner/AddSpotScreen';
import { AddVehicleScreen } from '../screens/driver/AddVehicleScreen';

const Stack = createStackNavigator();

export const MainNavigator = () => {
  const { currentRole } = useAppStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {currentRole === 'driver' ? (
        <Stack.Screen name="DriverTabs" component={DriverNavigator} />
      ) : (
        <Stack.Screen name="OwnerTabs" component={OwnerNavigator} />
      )}
      
      {/* Shared Full-Screen Modals / Stack Screens */}
      <Stack.Screen 
        name="SpotDetail" 
        component={SpotDetailScreen} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="BookingFlow" component={BookingScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <Stack.Screen name="AddVehicle" component={AddVehicleScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="PayoutMethods" component={PayoutMethodsScreen} />
      <Stack.Screen name="Filters" component={FiltersScreen} />
      <Stack.Screen name="AddSpot" component={AddSpotScreen} />
    </Stack.Navigator>
  );
};
