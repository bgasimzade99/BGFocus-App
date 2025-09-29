import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import { useTheme } from '../hooks/useTheme';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, ICON_SIZES } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { AnimatedButton } from '../components/AnimatedButton';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to BGFocus',
    subtitle: 'AI-Powered Productivity Assistant',
    description: 'Transform your productivity with intelligent task management, smart focus sessions, and personalized insights.',
    icon: 'rocket-outline',
    gradient: GRADIENTS.primary,
    color: '#00D4FF',
  },
  {
    id: 2,
    title: 'Smart Focus Timer',
    subtitle: 'Pomodoro Technique Enhanced',
    description: 'Stay focused with AI-optimized work sessions, intelligent break reminders, and productivity analytics.',
    icon: 'timer-outline',
    gradient: GRADIENTS.secondary,
    color: '#FFD700',
  },
  {
    id: 3,
    title: 'AI Insights & Analytics',
    subtitle: 'Your Productivity Dashboard',
    description: 'Get personalized insights, track your progress, and receive AI-powered recommendations to boost efficiency.',
    icon: 'analytics-outline',
    gradient: GRADIENTS.accent,
    color: '#40E0D0',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  // const { colors } = useTheme();
  const colors = {
    primary: '#00D4FF',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
  };
  const [currentPage, setCurrentPage] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      Animated.spring(translateX, {
        toValue: -nextPage * width,
        damping: 20,
        stiffness: 100,
        useNativeDriver: true,
      }).start();
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      Animated.spring(translateX, {
        toValue: -prevPage * width,
        damping: 20,
        stiffness: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentData = onboardingData[currentPage];

  const animatedStyle = {
    transform: [{ translateX: translateX }],
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={currentData.gradient as readonly [string, string]}
        style={styles.background}
      />

      {/* Content container */}
      <Animated.View style={[styles.contentContainer, animatedStyle]}>
        {onboardingData.map((item, index) => (
          <View key={item.id} style={[styles.page, { width }]}>
            <View style={styles.content}>
              {/* Icon container with glow effect */}
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                <Ionicons 
                  name={item.icon as any} 
                  size={ICON_SIZES.xxxl} 
                  color={item.color} 
                />
              </View>
              
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {item.subtitle}
              </Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Bottom controls */}
      <View style={styles.bottomContainer}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentPage ? colors.primary : colors.textSecondary,
                width: index === currentPage ? 24 : 8,
                opacity: index === currentPage ? 1 : 0.5,
              },
            ]}
          />
        ))}
        </View>

        {/* Navigation buttons */}
        <View style={styles.buttonContainer}>
          {currentPage > 0 && (
            <AnimatedButton
              title="Previous"
              onPress={handlePrevious}
              variant="ghost"
              size="medium"
              icon="arrow-back"
              iconPosition="left"
              style={styles.previousButton}
            />
          )}

          <View style={styles.skipButton}>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
            </TouchableOpacity>
          </View>

          <AnimatedButton
            title={currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="large"
            icon={currentPage === onboardingData.length - 1 ? 'checkmark' : 'arrow-forward'}
            iconPosition="right"
            gradient={true}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semiBold,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  bottomContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    height: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previousButton: {
    flex: 1,
    marginRight: SPACING.md,
  },
  skipButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  skipText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
});