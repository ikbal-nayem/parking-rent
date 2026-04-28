import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface AvatarProps {
  url: string;
  size?: number;
  showOnlineIndicator?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  url, 
  size = 40, 
  showOnlineIndicator = false,
  style 
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image 
        source={{ uri: url }} 
        style={[
          styles.image, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            backgroundColor: theme.surfaceHighlight 
          }
        ]} 
      />
      {showOnlineIndicator && (
        <View style={[
          styles.indicator,
          { 
            width: size * 0.25, 
            height: size * 0.25, 
            borderRadius: size * 0.125,
            right: size * 0.05,
            bottom: size * 0.05,
            backgroundColor: theme.success,
            borderColor: theme.background,
          }
        ]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    // backgroundColor set dynamically via theme
  },
  indicator: {
    position: 'absolute',
    borderWidth: 2,
    // backgroundColor and borderColor set dynamically via theme
  },
});
