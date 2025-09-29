import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { colors, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon-outline',
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          type: 'toggle',
          value: true,
          onPress: toggleTheme,
        },
        {
          icon: 'color-palette-outline',
          title: 'Accent Color',
          subtitle: 'Choose your preferred color',
          type: 'navigate',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Focus Settings',
      items: [
        {
          icon: 'timer-outline',
          title: 'Focus Duration',
          subtitle: 'Default focus session length',
          type: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'cafe-outline',
          title: 'Break Duration',
          subtitle: 'Short and long break lengths',
          type: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'play-outline',
          title: 'Auto-start Breaks',
          subtitle: 'Automatically start break sessions',
          type: 'toggle',
          value: autoStartBreaks,
          onPress: setAutoStartBreaks,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Push Notifications',
          subtitle: 'Get notified about sessions',
          type: 'toggle',
          value: notifications,
          onPress: setNotifications,
        },
        {
          icon: 'volume-high-outline',
          title: 'Sound Alerts',
          subtitle: 'Play sounds for session changes',
          type: 'toggle',
          value: true,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'General',
      items: [
        {
          icon: 'vibrate-outline',
          title: 'Haptic Feedback',
          subtitle: 'Feel vibrations for interactions',
          type: 'toggle',
          value: hapticFeedback,
          onPress: setHapticFeedback,
        },
        {
          icon: 'cloud-outline',
          title: 'Data Sync',
          subtitle: 'Sync data across devices',
          type: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'help-circle-outline',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          type: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'information-circle-outline',
          title: 'About',
          subtitle: 'App version and info',
          type: 'navigate',
          onPress: () => {},
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    return (
      <TouchableOpacity
        key={item.title}
        style={styles.settingItem}
        onPress={item.type === 'navigate' ? item.onPress : undefined}
        activeOpacity={0.7}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}20` }]}>
            <Ionicons name={item.icon} size={20} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {item.subtitle}
            </Text>
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={item.value ? '#FFFFFF' : colors.textSecondary}
            />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      <PremiumNavbar 
        title="Settings"
        showBackButton
        onBackPress={() => navigation.goBack()}
        variant="gradient"
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, index) => (
          <GlassCard key={section.title} style={styles.sectionCard} neumorphism>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            {section.items.map(renderSettingItem)}
          </GlassCard>
        ))}

        {/* Account Actions */}
        <GlassCard style={styles.accountCard} neumorphism glow>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          
          <AnimatedButton
            title="Export Data"
            onPress={() => {}}
            variant="secondary"
            icon="download-outline"
            iconPosition="left"
            style={styles.accountButton}
          />
          
          <AnimatedButton
            title="Sign Out"
            onPress={() => {}}
            variant="ghost"
            icon="log-out-outline"
            iconPosition="left"
            style={styles.accountButton}
          />
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  sectionCard: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.sm,
  },
  settingRight: {
    marginLeft: SPACING.sm,
  },
  accountCard: {
    marginBottom: SPACING.xl,
  },
  accountButton: {
    marginBottom: SPACING.sm,
  },
});