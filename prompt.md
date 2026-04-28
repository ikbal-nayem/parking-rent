# React Native Mobile Application Prompt: Peer-to-Peer Parking Marketplace

## Project Overview

Develop a React Native (CLI, without Expo) mobile application for a peer-to-peer car parking marketplace. The application will connect individuals who have available parking spots (owners) with drivers seeking parking on an hourly, daily, or monthly basis. The design should be modern and intuitive, similar to ride-sharing applications like Uber or Bolt, with a strong emphasis on map-based interactions.

## Core Features

### 1. User Authentication and Profiles
- **User Roles**: Support both 
Driver" and "Owner" roles, allowing users to switch between them seamlessly.
- **Account Creation**: Email/password, Google, and Apple sign-in options.
- **User Profiles**: Comprehensive profiles for both drivers (vehicle details, payment methods) and owners (parking spot details, payout preferences).

### 2. Parking Spot Management (Owner)
- **Add Parking Spot**: Owners can list their parking spots with details such as:
    - Location (pin on map, address input)
    - Availability (hourly, daily, monthly rates)
    - Time slots (specific hours/days available)
    - Photos of the parking spot
    - Description and special instructions
- **Manage Listings**: Edit, activate/deactivate, and view booking history for their spots.
- **Earnings Dashboard**: Track income from rented spots.

### 3. Parking Search and Booking (Driver)
- **Map-Based Search**: A full-screen map displaying available parking spots with custom markers indicating price and availability.
- **Location Search**: Search by current location or by entering a specific address/area.
- **Filter Options**: Filter by price, availability (hourly/daily/monthly), time range, vehicle type, and amenities (e.g., covered, EV charging).
- **Spot Details**: Tapping a marker or listing reveals a bottom sheet with detailed information:
    - Multiple high-resolution images
    - Price and availability calendar
    - Owner rating and reviews
    - Distance and estimated walking time
    - "Book Now" button
- **Booking Flow**: Select desired time range, confirm details, advance payment, and receive booking confirmation.

### 4. Real-time Mapping and Navigation
- **OpenStreetMap Integration**: Utilize `react-native-maps` with `URLTile` for OpenStreetMap tiles. The tile URL should be configurable, e.g., `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`.
- **Custom Markers**: Visually distinct markers for available parking spots (e.g., price tags) and the user's current location.
- **In-app Navigation**: Provide turn-by-turn directions to the booked parking spot within the application.

### 5. Payment System
- **Advance Payment**: All payments are made in advance through the app.
- **Secure Transactions**: Integration with a secure payment gateway (e.g., Stripe, with mock implementation for prototype).
- **Payment History**: Users can view their transaction history.

## UI/UX Design Principles

- **Modern & Clean**: Inspired by Uber/Bolt, with a focus on minimalist design, clear typography, and intuitive iconography.
- **Map-Centric**: The map should be the primary interface for searching and discovering parking.
- **Bottom Sheets**: Utilize interactive bottom sheets for displaying parking spot details and booking options.
- **Visual Feedback**: Clear visual cues for available/unavailable spots, booking status, and navigation.
- **Accessibility**: Ensure the design is accessible to a wide range of users.

## Technical Requirements

- **React Native CLI**: The project must be initialized and developed using React Native CLI, not Expo.
- **State Management**: Implement a robust state management solution (e.g., Redux Toolkit, Zustand).
- **Navigation**: Use `react-navigation` for seamless app navigation (Stack, Tab, Drawer navigators as appropriate).
- **Styling**: Employ a modern styling solution (e.g., `styled-components`, `tailwind-rn`) for consistent and maintainable UI.
- **API Integration**: Mock API endpoints for user authentication, parking spot management, search, and booking.
- **Platform Specifics**: Ensure native module integration for maps and location services is handled correctly for both iOS and Android.

## Cool Ideas and Additional Features

- **Dynamic Pricing**: Implement an algorithm that suggests optimal pricing for owners based on demand, location, and time.
- **Real-time Occupancy Sensors (Mock)**: Simulate real-time updates on parking spot occupancy.
- **Smart Entry/Exit**: Integration with smart parking hardware (e.g., QR code scanners, automated gates) for seamless entry and exit (mock implementation).
- **Gamification**: Introduce badges (e.g., "Super Host," "Frequent Parker") and loyalty points for engaging user behavior.
- **Instant Chat**: An in-app messaging feature for owners and drivers to communicate regarding parking details or issues.
- **Multi-vehicle Management**: Allow drivers to add and manage multiple vehicles in their profile.
- **Favorite Spots**: Users can save preferred parking spots for quick access.
- **Parking Reminders**: Push notifications for upcoming bookings, expiring parking sessions, and payment reminders.
- **Community Features**: Ability to report issues with parking spots or users.

## Deliverables

The prompt should guide the generation of:
- A complete React Native CLI project structure.
- Key screens and components for user authentication, parking search, spot details, booking, and owner dashboard.
- Integration of `react-native-maps` with OpenStreetMap tiles.
- Basic navigation flow.
- Placeholder UI for payment and advanced features.
- Clear instructions for setting up and running the prototype.

This comprehensive prompt aims to provide a solid foundation for developing a feature-rich and user-friendly peer-to-peer parking application prototype.
