// ==========================================
// ParkRant - Type Definitions
// ==========================================

export type UserRole = 'driver' | 'owner';

export type BookingStatus =
  | 'upcoming'
  | 'active'
  | 'completed'
  | 'cancelled';

export type ParkingType = 'hourly' | 'daily' | 'monthly';

export type VehicleType = 'sedan' | 'suv' | 'truck' | 'motorcycle' | 'compact';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  rating: number;
  totalReviews: number;
  joinedDate: string;
  vehicles?: Vehicle[];
  badges?: Badge[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  type: VehicleType;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
}

export interface ParkingSpot {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  availableTypes: ParkingType[];
  amenities: string[];
  vehicleTypes: VehicleType[];
  isActive: boolean;
  isCovered: boolean;
  hasEVCharging: boolean;
  hasSecurity: boolean;
  rating: number;
  totalBookings: number;
  totalReviews: number;
  reviews: Review[];
  availableFrom: string;
  availableTo: string;
  distance?: number;
  walkingTime?: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  spotId: string;
  spotTitle: string;
  spotAddress: string;
  spotImage: string;
  driverId: string;
  driverName: string;
  ownerId: string;
  ownerName: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  parkingType: ParkingType;
  vehicleId: string;
  vehicleName: string;
  qrCode: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface EarningsData {
  daily: number[];
  weekly: number[];
  monthly: number[];
  totalEarnings: number;
  thisMonthEarnings: number;
  thisWeekEarnings: number;
  pendingPayout: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bkash' | 'nagad';
  last4?: string;
  expiry?: string;
  brand?: string;
  accountNumber?: string;
  isDefault: boolean;
}

export interface FilterOptions {
  priceRange: [number, number];
  parkingType: ParkingType | null;
  vehicleType: VehicleType | null;
  isCovered: boolean | null;
  hasEVCharging: boolean | null;
  hasSecurity: boolean | null;
  maxDistance: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'payment' | 'system' | 'message';
  isRead: boolean;
}
