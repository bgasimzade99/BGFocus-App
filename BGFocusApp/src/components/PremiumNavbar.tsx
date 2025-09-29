import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS, COLORS } from '../constants/colors';

interface PremiumNavbarProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass';
  showStatusBar?: boolean;
}

export const PremiumNavbar: React.FC<PremiumNavbarProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  variant = 'default',
  showStatusBar = true,
}) => {
  const { colors } = useTheme();

  const NavbarContent = () => (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
        hidden={!showStatusBar}
      />
      
      <View style={styles.content}>
        {/* Left side */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center */}
        <View style={styles.centerSection}>
          {title && (
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right side */}
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      </View>
    </View>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={GRADIENTS.primary as readonly [string, string]}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <NavbarContent />
      </LinearGradient>
    );
  }

  if (variant === 'glass') {
    return (
      <BlurView intensity={20} style={styles.glassContainer}>
        <NavbarContent />
      </BlurView>
    );
  }

  return (
    <View style={[styles.defaultContainer, { backgroundColor: colors.surface }]}>
      <NavbarContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: SPACING.md,
  },
  gradientContainer: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: SPACING.md,
  },
  glassContainer: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  defaultContainer: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    minHeight: 44,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  backButton: {
    padding: SPACING.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    textAlign: 'center',
    marginTop: 2,
  },
});
