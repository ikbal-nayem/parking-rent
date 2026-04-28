import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Fonts, Spacing, BorderRadius } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  label, 
  variant = 'default',
  style 
}) => {
  const theme = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { bg: theme.primaryFaded, text: theme.primaryLight };
      case 'success':
        return { bg: theme.successLight, text: theme.success };
      case 'warning':
        return { bg: theme.warningLight, text: theme.warning };
      case 'error':
        return { bg: theme.errorLight, text: theme.error };
      case 'info':
        return { bg: theme.infoLight, text: theme.info };
      default:
        return { bg: theme.surfaceHighlight, text: theme.textSecondary };
    }
  };

  const colors = getVariantStyles();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
