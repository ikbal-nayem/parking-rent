import { useAppStore } from '../store';
import { DarkTheme, LightTheme } from '../theme';

export const useTheme = () => {
  const theme = useAppStore((state) => state.theme);
  return theme === 'dark' ? DarkTheme : LightTheme;
};
