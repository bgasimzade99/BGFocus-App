export const COLORS = {
  dark: {
    // Premium dark theme
    background: '#0D0D0D',
    backgroundSecondary: '#1A1A1A',
    surface: '#1E1E1E',
    surfaceElevated: '#2A2A2A',
    surfaceHover: '#333333',
    
    // Premium accent colors
    primary: '#6366F1', // Indigo
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#EC4899', // Pink
    secondaryLight: '#F472B6',
    accent: '#10B981', // Emerald
    accentLight: '#34D399',
    
    // Text hierarchy
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    textMuted: '#52525B',
    
    // Borders and dividers
    border: '#27272A',
    borderLight: '#3F3F46',
    divider: '#18181B',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Glass and overlay
    glass: 'rgba(255, 255, 255, 0.05)',
    glassDark: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.8)',
    
    // Neumorphism shadows
    shadowLight: 'rgba(255, 255, 255, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.3)',
    
    // Premium gradients
    gradientStart: '#6366F1',
    gradientEnd: '#EC4899',
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

export const GRADIENTS = {
  // Premium gradients
  primary: ['#6366F1', '#EC4899'],
  secondary: ['#10B981', '#34D399'],
  accent: ['#3B82F6', '#8B5CF6'],
  background: ['#0D0D0D', '#1A1A1A'],
  surface: ['#1E1E1E', '#2A2A2A'],
  glass: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  
  // Neumorphism gradients
  neumorphism: ['#1E1E1E', '#2A2A2A'],
  neumorphismPressed: ['#1A1A1A', '#1E1E1E'],
  
  // Premium UI gradients
  card: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)'],
  button: ['#6366F1', '#4F46E5'],
  buttonHover: ['#818CF8', '#6366F1'],
};

export const SHADOWS = {
  // Neumorphism shadows
  neumorphism: {
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  neumorphismPressed: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Premium shadows
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  
  // Button shadows
  button: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonPressed: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
};