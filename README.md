# ParkRant — Peer-to-Peer Parking Marketplace

A React Native CLI application connecting individuals who have available parking spots (owners) with drivers seeking parking. Built as a prototype with a modern, dark-themed UI and hardcoded dummy data.

## Features

*   **Role Switching**: Seamlessly toggle between "Driver Mode" and "Owner Mode" in the Profile screen.
*   **Map-Based Search (OpenStreetMap)**: View parking spots on a map using `react-native-maps` with `UrlTile` for OpenStreetMap tiles.
*   **Detailed Bottom Sheets**: Tap a price marker to preview the spot, and swipe up/tap for full details using `@gorhom/bottom-sheet`.
*   **Booking Flow**: Select duration, view price breakdown, and mock payment.
*   **Owner Dashboard**: Track mock earnings with a weekly bar chart and view key metrics.
*   **Navigation**: Complex nested navigation using `@react-navigation/stack` and `@react-navigation/bottom-tabs`.

## Prerequisites

Since this is a **React Native CLI** project (not Expo), you must have the React Native environment set up for your target platform:
*   [React Native CLI Setup Guide](https://reactnative.dev/docs/environment-setup)
*   **Node.js** (v20+ recommended)
*   **Java SDK** and **Android Studio** (for Android)
*   **Xcode** and **CocoaPods** (for iOS - Mac only)

## Installation

1.  **Clone / Download the project**
2.  **Install Node Modules**
    ```bash
    npm install
    ```
3.  **Install iOS Pods (Mac only)**
    ```bash
    cd ios
    pod install
    cd ..
    ```

## Running the App

### Start the Metro Bundler
You must start the bundler in a separate terminal:
```bash
npm run start
```

### Run on Android
```bash
npm run android
```

### Run on iOS (Mac only)
```bash
npm run ios
```

## Architecture & Tech Stack

*   **Framework**: React Native CLI (`0.85.1`)
*   **Language**: TypeScript
*   **State Management**: Zustand
*   **Navigation**: React Navigation v7
*   **Maps**: `react-native-maps`
*   **UI Components**: `@gorhom/bottom-sheet`, `react-native-vector-icons`, `react-native-linear-gradient`

## Project Structure

*   `src/data/dummyData.ts`: Contains all the hardcoded mock users, parking spots, and bookings.
*   `src/store/index.ts`: Global Zustand state handling the dummy data and role switching.
*   `src/theme/index.ts`: Centralized design system (Colors, Spacing, Fonts).
*   `src/navigation/`: Nested navigators (Root, Auth, Main, Driver, Owner).
*   `src/screens/`: Divided into `auth/`, `driver/`, `owner/`, and `shared/`.
*   `src/components/`: Reusable UI components.

## Notes

*   **Maps on Android**: The `MapSearchScreen` requires Google Play Services if you run on an emulator, though it uses OpenStreetMap tiles. Ensure your Android emulator has Play Services installed.
*   **Dummy Data**: This is a frontend prototype. All data is reset when the app restarts. You can log in using any email (it defaults to the `Alice Driver` profile).
