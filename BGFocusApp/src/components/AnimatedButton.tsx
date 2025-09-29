import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SHADOWS, GRADIENTS, COLORS } from '../constants/colors';
import { BORDER_RADIUS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'glow' | 'neumorphism';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'right',
  disabled = false,
  style,
  textStyle,
  hapticFeedback = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 15,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 15,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (!disabled) {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: GRADIENTS.button,
          text: '#FFFFFF',
          border: '#6366F1',
          shadow: SHADOWS.button,
        };
      case 'secondary':
        return {
          background: ['#1E1E1E', '#2A2A2A'],
          text: '#FFFFFF',
          border: '#27272A',
          shadow: SHADOWS.small,
        };
      case 'accent':
        return {
          background: GRADIENTS.secondary,
          text: '#FFFFFF',
          border: '#10B981',
          shadow: SHADOWS.button,
        };
      case 'glow':
        return {
          background: GRADIENTS.primary,
          text: '#FFFFFF',
          border: '#6366F1',
          shadow: SHADOWS.glow,
        };
      case 'neumorphism':
        return {
          background: ['#1E1E1E', '#1E1E1E'],
          text: '#FFFFFF',
          border: 'transparent',
          shadow: SHADOWS.neumorphism,
        };
      case 'ghost':
        return {
          background: ['transparent', 'transparent'],
          text: '#6366F1',
          border: '#6366F1',
          shadow: {},
        };
      default:
        return {
          background: GRADIENTS.button,
          text: '#FFFFFF',
          border: '#6366F1',
          shadow: SHADOWS.button,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
          fontSize: FONT_SIZES.sm,
          borderRadius: BORDER_RADIUS.lg,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xl,
          fontSize: FONT_SIZES.lg,
          borderRadius: BORDER_RADIUS.xl,
          iconSize: 24,
        };
      default:
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          fontSize: FONT_SIZES.md,
          borderRadius: BORDER_RADIUS.lg,
          iconSize: 20,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const ButtonContent = () => (
    <>
      {icon && iconPosition === 'left' && (
        <Ionicons 
          name={icon} 
          size={sizeStyles.iconSize} 
          color={variantStyles.text} 
          style={styles.iconLeft} 
        />
      )}
      <Text style={[
        styles.text,
        { 
          color: variantStyles.text, 
          fontSize: sizeStyles.fontSize,
          fontWeight: variant === 'ghost' ? FONT_WEIGHTS.medium : FONT_WEIGHTS.semiBold,
        },
        textStyle,
      ]}>
        {title}
      </Text>
      {icon && iconPosition === 'right' && (
        <Ionicons 
          name={icon} 
          size={sizeStyles.iconSize} 
          color={variantStyles.text} 
          style={styles.iconRight} 
        />
      )}
    </>
  );

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {variant === 'glow' && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim,
              backgroundColor: variantStyles.border,
              borderRadius: sizeStyles.borderRadius,
            }
          ]}
        />
      )}
      
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {variant !== 'ghost' ? (
          <LinearGradient
            colors={variantStyles.background as readonly [string, string]}
            style={[
              styles.button,
              {
                paddingVertical: sizeStyles.paddingVertical,
                paddingHorizontal: sizeStyles.paddingHorizontal,
                borderRadius: sizeStyles.borderRadius,
                borderWidth: variant === 'ghost' ? 1 : 0,
                borderColor: variantStyles.border,
                ...variantStyles.shadow,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ButtonContent />
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.button,
              {
                paddingVertical: sizeStyles.paddingVertical,
                paddingHorizontal: sizeStyles.paddingHorizontal,
                borderRadius: sizeStyles.borderRadius,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: variantStyles.border,
                ...variantStyles.shadow,
              },
            ]}
          >
            <ButtonContent />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: BORDER_RADIUS.xl,
    opacity: 0.3,
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});