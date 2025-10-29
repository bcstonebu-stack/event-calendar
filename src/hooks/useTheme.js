import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, THEMES } from '../utils/constants';

/**
 * Custom hook for managing theme state
 * @returns {[string, Function]} - [theme, toggleTheme]
 */
export function useTheme() {
  // Get system preference
  const getSystemTheme = () => {
    if (typeof window === 'undefined') return THEMES.LIGHT;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? THEMES.DARK : THEMES.LIGHT;
  };

  // Initialize with system preference if no stored value
  const [theme, setTheme] = useLocalStorage(
    STORAGE_KEYS.THEME,
    getSystemTheme()
  );

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === THEMES.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme =>
      prevTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    );
  };

  return [theme, toggleTheme];
}
