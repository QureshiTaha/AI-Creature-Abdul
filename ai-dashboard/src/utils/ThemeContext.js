import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'app_theme_preference';

export const ThemeContext = createContext({
  toggleTheme: () => {},
  isDark: true,
  mode: 'dark',
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try {
      // 1. Check for saved preference in localStorage
      const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode) return savedMode;

      // 2. Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
      }

      // 3. Default to dark mode
      return 'dark';
    } catch (error) {
      console.error('Error accessing theme preference:', error);
      return 'dark';
    }
  });

  // Update localStorage when mode changes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [mode]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      // Only change if user hasn't set a preference
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const themeConfig = useMemo(() => ({
    toggleTheme: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
    isDark: mode === 'dark',
    mode, // Expose the current mode as well
  }), [mode]);

  return (
    <ThemeContext.Provider value={themeConfig}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};