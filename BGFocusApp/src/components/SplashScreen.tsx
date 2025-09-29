import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  // const { colors } = useTheme();
  const colors = {
    primary: '#00D4FF',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
  };
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Logo entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Logo rotation animation
      Animated.loop(
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ).start();

      // Complete animation after 3 seconds
      setTimeout(() => {
        onAnimationComplete();
      }, 3000);
    };

    startAnimation();
  }, [fadeAnim, scaleAnim, glowAnim, logoRotateAnim, onAnimationComplete]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={GRADIENTS.background}
      style={styles.container}
    >
      {/* Animated background particles */}
      <View style={styles.particles}>
        {[...Array(20)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: fadeAnim,
                transform: [
                  {
                    scale: scaleAnim.interpolate({
                      inputRange: [0.8, 1],
                      outputRange: [0.5, Math.random() * 0.5 + 0.5],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Main logo container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
              transform: [{ rotate: logoRotation }],
            },
          ]}
        />

        {/* Logo icon */}
        <Animated.View
          style={[
            styles.logoIcon,
            {
              transform: [{ rotate: logoRotation }],
            },
          ]}
        >
          <Ionicons name="flash" size={80} color={colors.primary} />
        </Animated.View>

        {/* App name */}
        <Text style={[styles.logo, { color: colors.text }]}>BGFocus</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          AI-Powered Productivity
        </Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                width: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00D4FF',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#00D4FF',
    opacity: 0.3,
  },
  logoIcon: {
    marginBottom: SPACING.md,
  },
  logo: {
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textShadowColor: '#00D4FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: FONT_SIZES.lg,
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.medium,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    left: SPACING.xl,
    right: SPACING.xl,
  },
  loadingBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#00D4FF',
    borderRadius: 2,
  },
});