import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  setTheme: (theme: ThemeMode) => void;
  colors: {
    background: string;
    text: string;
    card: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Determine if dark mode should be active
  useEffect(() => {
    let shouldBeDark = false;
    
    if (theme === 'system') {
      shouldBeDark = systemColorScheme === 'dark';
    } else {
      shouldBeDark = theme === 'dark';
    }
    
    setIsDarkMode(shouldBeDark);
  }, [theme, systemColorScheme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  // Define colors based on theme
  const colors = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    card: isDarkMode ? '#1E1E1E' : '#F5F5F5',
    border: isDarkMode ? '#333333' : '#E0E0E0',
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        setTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};