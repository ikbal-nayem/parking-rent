import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { useAppStore } from '../store';

const setLocationPermission = (granted: boolean, status = '') => {
  useAppStore.getState().setLocationPermission(granted, status);
};

const setUserLocation = (location: { latitude: number; longitude: number } | null) => {
  useAppStore.getState().setUserLocation(location);
};

const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number }> => {
  const geolocation = (globalThis as any)?.navigator?.geolocation;

  if (!geolocation?.getCurrentPosition) {
    throw new Error('Geolocation is not available');
  }

  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(
      (position: any) => {
        const { latitude, longitude } = position.coords || {};
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          reject(new Error('Invalid coordinates')); 
          return;
        }
        resolve({ latitude, longitude });
      },
      (error: any) => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
};

export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    setLocationPermission(true, 'granted');
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
    } catch {
      setUserLocation(null);
    }
    return true;
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      const hasPermission =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED;

      setLocationPermission(
        hasPermission,
        hasPermission ? 'granted' : 'denied',
      );

      if (hasPermission) {
        try {
          const location = await getCurrentLocation();
          setUserLocation(location);
        } catch {
          setUserLocation(null);
        }
      } else {
        setUserLocation(null);
        Alert.alert(
          'Location Permission Required',
          'Allow location access to view your current position on the map.',
          [
            { text: 'Not now', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }

      return hasPermission;
    } catch (error) {
      setLocationPermission(false, 'request_failed');
      return false;
    }
  }

  setLocationPermission(false, 'unsupported_platform');
  return false;
};
