// ==========================================
// ParkRant - Theme Configuration
// ==========================================

const CommonColors = {
  primary: '#3A86FF', // Vivid Blue
  primaryLight: '#5B9AFF',
  primaryDark: '#2D6BCC',
  accent: '#FFBE0B', // Amber/Yellow
  accentLight: '#FFCD3C',
  accentDark: '#CC9809',
  success: '#06D6A0', // Emerald Green
  warning: '#FF9F1C',
  error: '#EF476F', // Bright Rose
  info: '#118AB2',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const DarkTheme = {
  ...CommonColors,
  background: '#0D0D0D', // Deep Black
  backgroundLight: '#121212',
  surface: '#1A1A1A', // Dark Grey Surface
  surfaceLight: '#242424',
  surfaceHighlight: '#2D2D2D',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#606060',
  textInverse: '#0D0D0D',
  border: '#2D2D2D',
  divider: '#1F1F1F',
  primaryFaded: 'rgba(58, 134, 255, 0.15)',
  accentFaded: 'rgba(255, 190, 11, 0.15)',
  gradientPrimary: ['#3A86FF', '#8338EC'], // Blue to Purple
  gradientAccent: ['#FFBE0B', '#FB5607'], // Amber to Orange
  gradientDark: ['#1A1A1A', '#0D0D0D'],
  gradientCard: ['#1F1F1F', '#161616'],
};

export const LightTheme = {
  ...CommonColors,
  background: '#F8F9FA',
  backgroundLight: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceLight: '#F1F3F5',
  surfaceHighlight: '#E9ECEF',
  textPrimary: '#121212',
  textSecondary: '#495057',
  textTertiary: '#ADB5BD',
  textInverse: '#FFFFFF',
  border: '#DEE2E6',
  divider: '#E9ECEF',
  primaryFaded: 'rgba(58, 134, 255, 0.1)',
  accentFaded: 'rgba(255, 190, 11, 0.1)',
  gradientPrimary: ['#3A86FF', '#5B9AFF'],
  gradientAccent: ['#FFBE0B', '#FFCD3C'],
  gradientDark: ['#F8F9FA', '#E9ECEF'],
  gradientCard: ['#FFFFFF', '#F8F9FA'],
};

// Default export for legacy support
export const Colors = DarkTheme;

export const Fonts = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    title: 32,
    hero: 40,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
};
