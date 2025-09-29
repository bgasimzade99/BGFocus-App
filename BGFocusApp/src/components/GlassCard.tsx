import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SHADOWS, GRADIENTS } from '../constants/colors';
import { BORDER_RADIUS, SPACING } from '../constants/spacing';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  gradient?: boolean;
  glow?: boolean;
  delay?: number;
  animated?: boolean;
  neumorphism?: boolean;
  pressable?: boolean;
  onPress?: () => void;
  padding?: keyof typeof SPACING;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  intensity = 20,
  gradient = false,
  glow = false,
  delay = 0,
  animated = true,
  neumorphism = false,
  pressable = false,
  onPress,
  padding = 'md',
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      const startAnimation = () => {
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            delay,
            useNativeDriver: true,
          }),
          Animated.spring(translateYAnim, {
            toValue: 0,
            delay,
            useNativeDriver: true,
            tension: 300,
            friction: 20,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            delay,
            useNativeDriver: true,
            tension: 300,
            friction: 15,
          }),
        ]).start();
      };

      startAnimation();
    }
  }, [animated, delay]);

  const handlePressIn = () => {
    if (pressable) {
      Animated.spring(pressAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (pressable) {
      Animated.spring(pressAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const animatedStyle = {
    opacity: opacityAnim,
    transform: [
      { translateY: translateYAnim },
      { scale: scaleAnim },
      { scale: pressAnim },
    ],
  };

  const cardStyle = [
    neumorphism ? styles.neumorphismCard : styles.glassCard,
    glow && styles.glow,
    { padding: SPACING[padding] },
    style,
  ];

  const CardContent = () => {
    if (neumorphism) {
      return (
        <View style={cardStyle}>
          {children}
        </View>
      );
    }

    if (gradient) {
      return (
        <LinearGradient
          colors={GRADIENTS.card as readonly [string, string]}
          style={cardStyle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <BlurView intensity={intensity} style={styles.blurView}>
            <View style={styles.content}>
              {children}
            </View>
          </BlurView>
        </LinearGradient>
      );
    }

    return (
      <BlurView intensity={intensity} style={styles.blurView}>
        <View style={cardStyle}>
          {children}
        </View>
      </BlurView>
    );
  };

  if (pressable && onPress) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <CardContent />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <CardContent />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...SHADOWS.medium,
  },
  neumorphismCard: {
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: '#1E1E1E',
    ...SHADOWS.neumorphism,
  },
  blurView: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
  },
  content: {
    flex: 1,
  },
  glow: {
    ...SHADOWS.glow,
  },
});