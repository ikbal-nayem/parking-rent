import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts, Spacing, BorderRadius, DarkTheme } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const getButtonStyles = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'danger':
        return styles.danger;
      default:
        return styles.primary; // For gradient, we use transparent background
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textTertiary;
    switch (variant) {
      case 'outline':
        return theme.primary;
      case 'secondary':
        return theme.textPrimary;
      default:
        return theme.white;
    }
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator color={getTextColor()} style={styles.icon} />
      ) : icon ? (
        <React.Fragment>{icon}</React.Fragment>
      ) : null}
      <Text 
        style={[
          styles.text, 
          { color: getTextColor() },
          size === 'small' && { fontSize: Fonts.sizes.sm },
          size === 'large' && { fontSize: Fonts.sizes.lg },
          textStyle
        ]}
      >
        {title}
      </Text>
    </>
  );

  const containerStyles = [
    styles.container,
    getButtonStyles(),
    getVariantStyles(),
    disabled && styles.disabled,
    style
  ];

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
        <LinearGradient
          colors={theme.gradientPrimary}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.container, getButtonStyles(), styles.primary]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={containerStyles}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const createStyles = (theme: typeof DarkTheme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  text: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    marginRight: Spacing.sm,
  },
  small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  medium: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  large: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  primary: {
    // Gradient background handled in component
  },
  secondary: {
    backgroundColor: theme.surfaceHighlight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  danger: {
    backgroundColor: theme.error,
  },
  disabled: {
    backgroundColor: theme.surfaceHighlight,
    borderColor: theme.surfaceHighlight,
  },
});
