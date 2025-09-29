import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/spacing';
import { GRADIENTS, COLORS, SHADOWS } from '../constants/colors';

const { width } = Dimensions.get('window');

interface TabItem {
  id: string;
  label: string;
  icon: string;
  activeIcon?: string;
}

interface PremiumTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  variant?: 'default' | 'gradient' | 'glass' | 'neumorphism';
  showLabels?: boolean;
  centerButton?: {
    icon: string;
    onPress: () => void;
    gradient?: boolean;
  };
}

export const PremiumTabBar: React.FC<PremiumTabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  variant = 'default',
  showLabels = true,
  centerButton,
}) => {
  const { colors } = useTheme();
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const indicatorPosition = (width / tabs.length) * activeIndex + (width / tabs.length / 2);
    
    Animated.spring(indicatorAnim, {
      toValue: indicatorPosition,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  }, [activeTab]);

  const handleTabPress = (tabId: string) => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
    
    onTabPress(tabId);
  };

  const getTabBarStyle = () => {
    const baseStyle = [styles.tabBar];
    
    switch (variant) {
      case 'gradient':
        return [...baseStyle, styles.gradientTabBar];
      case 'glass':
        return [...baseStyle, styles.glassTabBar];
      case 'neumorphism':
        return [...baseStyle, styles.neumorphismTabBar];
      default:
        return [...baseStyle, styles.defaultTabBar];
    }
  };

  const TabBarContent = () => {
    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={GRADIENTS.surface as readonly [string, string]}
          style={getTabBarStyle()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <BlurView intensity={20} style={styles.blurContent}>
            <TabContent />
          </BlurView>
        </LinearGradient>
      );
    }

    if (variant === 'glass') {
      return (
        <BlurView intensity={30} style={getTabBarStyle()}>
          <TabContent />
        </BlurView>
      );
    }

    return (
      <View style={[getTabBarStyle(), { backgroundColor: colors.surface }]}>
        <TabContent />
      </View>
    );
  };

  const TabContent = () => (
    <>
      {/* Active indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [{ translateX: indicatorAnim }],
            backgroundColor: colors.primary,
          },
        ]}
      />

      {/* Tab items */}
      <View style={styles.tabItems}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const iconName = isActive && tab.activeIcon ? tab.activeIcon : tab.icon;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.tabIconContainer,
                  {
                    transform: [{ scale: isActive ? 1.1 : 1 }],
                  },
                ]}
              >
                <Ionicons
                  name={iconName as any}
                  size={24}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
              </Animated.View>
              
              {showLabels && (
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? colors.primary : colors.textSecondary,
                      fontWeight: isActive ? FONT_WEIGHTS.semiBold : FONT_WEIGHTS.medium,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Center button */}
      {centerButton && (
        <TouchableOpacity
          style={styles.centerButton}
          onPress={centerButton.onPress}
          activeOpacity={0.8}
        >
          {centerButton.gradient ? (
            <LinearGradient
              colors={GRADIENTS.primary as readonly [string, string]}
              style={styles.centerButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={centerButton.icon as any} size={28} color="#FFFFFF" />
            </LinearGradient>
          ) : (
            <View style={[styles.centerButtonDefault, { backgroundColor: colors.primary }]}>
              <Ionicons name={centerButton.icon as any} size={28} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TabBarContent />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  defaultTabBar: {
    backgroundColor: '#1E1E1E',
  },
  gradientTabBar: {
    overflow: 'hidden',
  },
  glassTabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  neumorphismTabBar: {
    backgroundColor: '#1E1E1E',
    ...SHADOWS.neumorphism,
  },
  blurContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    top: SPACING.sm,
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: -2,
  },
  tabItems: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  tabIconContainer: {
    marginBottom: SPACING.xs,
  },
  tabLabel: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
  },
  centerButton: {
    position: 'absolute',
    top: -20,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    ...SHADOWS.button,
  },
  centerButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonDefault: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
