import React, { createContext, useContext, useEffect, useState } from 'react';
import useUserSettings from '../hooks/useUserSettings.tsx';
import useAuth from '../hooks/useAuth.tsx';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { settings, updateSetting } = useUserSettings(user?.email);
  const [theme, setThemeState] = useState<Theme>('auto');
  const [isDark, setIsDark] = useState(false);

  // Update theme when settings change
  useEffect(() => {
    if (settings.appearance?.theme) {
      setThemeState(settings.appearance.theme);
    }
  }, [settings.appearance?.theme]);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      let effectiveTheme: 'light' | 'dark' = 'light';
      
      if (theme === 'auto') {
        // Check system preference
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        effectiveTheme = theme;
      }

      setIsDark(effectiveTheme === 'dark');
      
      // Apply theme classes to document
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(effectiveTheme);
      
      // Set CSS custom properties for theme colors
      if (effectiveTheme === 'dark') {
        document.documentElement.style.setProperty('--bg-primary', '#1f2937');
        document.documentElement.style.setProperty('--bg-secondary', '#374151');
        document.documentElement.style.setProperty('--text-primary', '#f9fafb');
        document.documentElement.style.setProperty('--text-secondary', '#d1d5db');
      } else {
        document.documentElement.style.setProperty('--bg-primary', '#ffffff');
        document.documentElement.style.setProperty('--bg-secondary', '#f3f4f6');
        document.documentElement.style.setProperty('--text-primary', '#111827');
        document.documentElement.style.setProperty('--text-secondary', '#6b7280');
      }
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    updateSetting('appearance', 'theme', newTheme);
  };

  const value: ThemeContextType = {
    theme,
    isDark,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 