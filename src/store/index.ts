import { Platform } from 'react-native';
import { create } from 'zustand';
import { User, Booking, ParkingSpot, Vehicle, PaymentMethod, FilterOptions, Notification, ChatThread, ChatMessage } from '../types';
import { DUMMY_USERS, DUMMY_BOOKINGS, DUMMY_SPOTS, DUMMY_NOTIFICATIONS, DUMMY_THREADS, DUMMY_MESSAGES } from '../data/dummyData';

interface AppState {
  currentUser: User | null;
  currentRole: 'driver' | 'owner';
  spots: ParkingSpot[];
  bookings: Booking[];
  notifications: Notification[];
  chatThreads: ChatThread[];
  messages: ChatMessage[];
  theme: 'dark' | 'light';
  filterOptions: FilterOptions;
  locationPermissionGranted: boolean;
  locationPermissionStatus: string;
  userLocation: { latitude: number; longitude: number } | null;
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  toggleRole: () => void;
  toggleTheme: () => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  addSpot: (spot: ParkingSpot) => void;
  updateUser: (userData: Partial<User>) => void;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (vehicleId: string) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  setLocationPermission: (granted: boolean, status?: string) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  markNotificationAsRead: (id: string) => void;
  addMessage: (message: ChatMessage) => void;
}

const DEFAULT_FILTERS: FilterOptions = {
  priceRange: [0, 1000],
  parkingType: null,
  vehicleType: null,
  isCovered: null,
  hasEVCharging: null,
  hasSecurity: null,
  maxDistance: 10,
};

export const useAppStore = create<AppState>((set) => ({
  currentUser: DUMMY_USERS[0], // Default to driver Alice
  currentRole: 'driver',
  spots: DUMMY_SPOTS,
  bookings: DUMMY_BOOKINGS,
  notifications: DUMMY_NOTIFICATIONS,
  chatThreads: DUMMY_THREADS,
  messages: DUMMY_MESSAGES,
  theme: 'dark',
  filterOptions: DEFAULT_FILTERS,
  locationPermissionGranted: Platform.OS === 'ios',
  locationPermissionStatus: '',
  userLocation: null,

  login: (email) => {
    // Simple mock login
    const user = DUMMY_USERS.find(u => u.email === email) || DUMMY_USERS[0];
    set({ currentUser: user, currentRole: user.role });
  },

  logout: () => set({ currentUser: null }),

  toggleRole: () => set((state) => ({ 
    currentRole: state.currentRole === 'driver' ? 'owner' : 'driver' 
  })),
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'dark' ? 'light' : 'dark'
  })),

  addBooking: (booking) => set((state) => ({
    bookings: [booking, ...state.bookings]
  })),

  cancelBooking: (bookingId) => set((state) => ({
    bookings: state.bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    )
  })),

  addSpot: (spot) => set((state) => ({
    spots: [...state.spots, spot]
  })),

  updateUser: (userData) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...userData } : null
  })),
  
  addVehicle: (vehicle) => set((state) => ({
    currentUser: state.currentUser 
      ? { ...state.currentUser, vehicles: [...(state.currentUser.vehicles || []), vehicle] }
      : null
  })),

  removeVehicle: (vehicleId) => set((state) => ({
    currentUser: state.currentUser 
      ? { ...state.currentUser, vehicles: (state.currentUser.vehicles || []).filter(v => v.id !== vehicleId) }
      : null
  })),

  addPaymentMethod: (method) => {
    // Mock add
  },

  removePaymentMethod: (methodId) => {
    // Mock remove
  },

  updateFilters: (filters) => set((state) => ({
    filterOptions: { ...state.filterOptions, ...filters }
  })),

  resetFilters: () => set({ filterOptions: DEFAULT_FILTERS }),

  setLocationPermission: (granted, status = '') => set({
    locationPermissionGranted: granted,
    locationPermissionStatus: status,
  }),

  setUserLocation: (location) => set({ userLocation: location }),

  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
}));
