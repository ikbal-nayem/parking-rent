import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootNavigator } from './src/navigation/RootNavigator';

// import * as MapLibreGL from '@maplibre/maplibre-react-native';
// import { Protocol } from 'pmtiles';

// // Initialize the PMTiles protocol
// const protocol = new Protocol();
// MapLibreGL.addProtocol('pmtiles', (request) => {
//   return protocol.tile(request);
// });

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0F0F1A"
          animated={true}
          translucent={false}
        />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
