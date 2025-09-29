import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/spacing';
import { GRADIENTS, COLORS, SHADOWS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass' | 'bottomSheet';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  animationType?: 'slide' | 'fade' | 'scale';
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  variant = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
  animationType = 'scale',
}) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        animationType === 'scale' && Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 20,
        }),
        animationType === 'slide' && Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 300,
          friction: 20,
        }),
      ].filter(Boolean)).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  const getModalStyle = () => {
    const baseStyle = [styles.modalContent];
    
    switch (variant) {
      case 'bottomSheet':
        return [...baseStyle, styles.bottomSheet];
      case 'gradient':
        return [...baseStyle, styles.gradientModal];
      case 'glass':
        return [...baseStyle, styles.glassModal];
      default:
        return [...baseStyle, styles.defaultModal];
    }
  };

  const getTransformStyle = () => {
    switch (animationType) {
      case 'scale':
        return { transform: [{ scale: scaleAnim }] };
      case 'slide':
        return { transform: [{ translateY: slideAnim }] };
      default:
        return {};
    }
  };

  const ModalContent = () => {
    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={GRADIENTS.card as readonly [string, string]}
          style={getModalStyle()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <BlurView intensity={20} style={styles.blurContent}>
            {children}
          </BlurView>
        </LinearGradient>
      );
    }

    if (variant === 'glass') {
      return (
        <BlurView intensity={30} style={getModalStyle()}>
          {children}
        </BlurView>
      );
    }

    return (
      <View style={[getModalStyle(), { backgroundColor: colors.surface }]}>
        {children}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <Animated.View style={getTransformStyle()}>
          <ModalContent />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    borderRadius: BORDER_RADIUS.xl,
    margin: SPACING.lg,
    maxWidth: width - SPACING.xl,
    maxHeight: height * 0.8,
    ...SHADOWS.large,
  },
  defaultModal: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  gradientModal: {
    overflow: 'hidden',
  },
  glassModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    maxHeight: height * 0.9,
  },
  blurContent: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
  },
});
