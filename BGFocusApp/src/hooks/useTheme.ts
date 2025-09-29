import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME } from '../constants/theme';
import { COLORS } from '../constants/colors';

// Fallback colors in case COLORS import fails
const FALLBACK_COLORS = {
  dark: {
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceElevated: '#2A2A2A',
    primary: '#00D4FF',
    secondary: '#4CAF50',
    accent: '#40E0D0',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    border: '#2A2A2A',
    borderLight: '#3A3A3A',
    success: '#4CAF50',
    warning: '#FFB800',
    error: '#FF4444',
    info: '#00D4FF',
    overlay: 'rgba(0, 0, 0, 0.8)',
    glass: 'rgba(255, 255, 255, 0.1)',
    glassDark: 'rgba(0, 0, 0, 0.3)',
    green: '#4CAF50',
    lightBlue: '#81C784',
    pink: '#F48FB1',
    purple: '#BA68C8',
  },
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceElevated: '#FFFFFF',
    primary: '#007AFF',
    secondary: '#FF9500',
    accent: '#30D158',
    text: '#000000',
    textSecondary: '#6D6D70',
    textTertiary: '#AEAEB2',
    border: '#E5E5EA',
    borderLight: '#F2F2F7',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    glass: 'rgba(255, 255, 255, 0.8)',
    glassDark: 'rgba(0, 0, 0, 0.1)',
  },
};

export const useTheme = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme as 'dark' | 'light');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Use fallback colors if COLORS is undefined
  const colors = theme === 'dark' ? 
    (COLORS?.dark || FALLBACK_COLORS.dark) : 
    (COLORS?.light || FALLBACK_COLORS.light);
  const currentTheme = { ...THEME, colors };

  return {
    theme,
    colors,
    currentTheme,
    toggleTheme,
    isLoading,
  };
};
