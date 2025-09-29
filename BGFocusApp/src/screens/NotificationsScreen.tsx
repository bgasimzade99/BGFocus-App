import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';

interface NotificationsScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    focusReminders: true,
    breakReminders: true,
    taskDeadlines: true,
    weeklyReports: false,
    achievementAlerts: true,
    teamUpdates: false,
  });

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    Alert.alert('Success', 'Your notification preferences have been updated successfully.');
  };

  const notificationSettings = [
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      icon: 'phone-portrait',
      color: '#6366F1',
    },
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Get updates via email',
      icon: 'mail',
      color: '#10B981',
    },
    {
      key: 'focusReminders',
      title: 'Focus Session Reminders',
      description: 'Reminders to start focus sessions',
      icon: 'time',
      color: '#F59E0B',
    },
    {
      key: 'breakReminders',
      title: 'Break Reminders',
      description: 'Notifications for break time',
      icon: 'cafe',
      color: '#EC4899',
    },
    {
      key: 'taskDeadlines',
      title: 'Task Deadlines',
      description: 'Alerts for upcoming task deadlines',
      icon: 'calendar',
      color: '#8B5CF6',
    },
    {
      key: 'weeklyReports',
      title: 'Weekly Reports',
      description: 'Summary of your weekly progress',
      icon: 'analytics',
      color: '#06B6D4',
    },
    {
      key: 'achievementAlerts',
      title: 'Achievement Alerts',
      description: 'Celebrate your accomplishments',
      icon: 'trophy',
      color: '#F97316',
    },
    {
      key: 'teamUpdates',
      title: 'Team Updates',
      description: 'Notifications from team members',
      icon: 'people',
      color: '#84CC16',
    },
  ];

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.backButtonGradient}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Configure your alert preferences</Text>
        </View>
        
        <TouchableOpacity onPress={handleSaveSettings} style={styles.saveButton}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.saveButtonGradient}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notification Overview */}
        <GlassCard style={styles.overviewCard} neumorphism glow>
          <View style={styles.overviewHeader}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.overviewIconGradient}
            >
              <Ionicons name="notifications" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.overviewContent}>
              <Text style={[styles.overviewTitle, { color: colors.text }]}>Notification Center</Text>
              <Text style={[styles.overviewSubtitle, { color: colors.textSecondary }]}>
                Manage how you receive updates and alerts
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* General Settings */}
        <GlassCard style={styles.settingsCard} neumorphism>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionTitleGradient}
            >
              <Text style={styles.sectionTitle}>General Settings</Text>
            </LinearGradient>
          </View>

          {notificationSettings.slice(0, 2).map((setting) => (
            <View key={setting.key} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, { backgroundColor: `${setting.color}20` }]}>
                  <Ionicons name={setting.icon as any} size={20} color={setting.color} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{setting.title}</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {setting.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications[setting.key as keyof typeof notifications]}
                onValueChange={() => handleToggle(setting.key)}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: `${setting.color}40` }}
                thumbColor={notifications[setting.key as keyof typeof notifications] ? setting.color : 'rgba(255, 255, 255, 0.3)'}
                ios_backgroundColor="rgba(255, 255, 255, 0.1)"
              />
            </View>
          ))}
        </GlassCard>

        {/* Focus & Productivity */}
        <GlassCard style={styles.settingsCard} neumorphism>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionTitleGradient}
            >
              <Text style={styles.sectionTitle}>Focus & Productivity</Text>
            </LinearGradient>
          </View>

          {notificationSettings.slice(2, 5).map((setting) => (
            <View key={setting.key} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, { backgroundColor: `${setting.color}20` }]}>
                  <Ionicons name={setting.icon as any} size={20} color={setting.color} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{setting.title}</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {setting.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications[setting.key as keyof typeof notifications]}
                onValueChange={() => handleToggle(setting.key)}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: `${setting.color}40` }}
                thumbColor={notifications[setting.key as keyof typeof notifications] ? setting.color : 'rgba(255, 255, 255, 0.3)'}
                ios_backgroundColor="rgba(255, 255, 255, 0.1)"
              />
            </View>
          ))}
        </GlassCard>

        {/* Reports & Updates */}
        <GlassCard style={styles.settingsCard} neumorphism>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#EC4899', '#BE185D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionTitleGradient}
            >
              <Text style={styles.sectionTitle}>Reports & Updates</Text>
            </LinearGradient>
          </View>

          {notificationSettings.slice(5).map((setting) => (
            <View key={setting.key} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, { backgroundColor: `${setting.color}20` }]}>
                  <Ionicons name={setting.icon as any} size={20} color={setting.color} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{setting.title}</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {setting.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications[setting.key as keyof typeof notifications]}
                onValueChange={() => handleToggle(setting.key)}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: `${setting.color}40` }}
                thumbColor={notifications[setting.key as keyof typeof notifications] ? setting.color : 'rgba(255, 255, 255, 0.3)'}
                ios_backgroundColor="rgba(255, 255, 255, 0.1)"
              />
            </View>
          ))}
        </GlassCard>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <AnimatedButton
            title="Enable All Notifications"
            onPress={() => {
              const allEnabled = Object.keys(notifications).reduce((acc, key) => ({
                ...acc,
                [key]: true
              }), {});
              setNotifications(allEnabled as typeof notifications);
            }}
            variant="primary"
            style={styles.quickActionButton}
          />
          <AnimatedButton
            title="Disable All Notifications"
            onPress={() => {
              const allDisabled = Object.keys(notifications).reduce((acc, key) => ({
                ...acc,
                [key]: false
              }), {});
              setNotifications(allDisabled as typeof notifications);
            }}
            variant="ghost"
            style={styles.quickActionButton}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: SPACING.md,
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: 2,
    opacity: 0.8,
  },
  saveButton: {
    marginLeft: SPACING.md,
  },
  saveButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  overviewCard: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  overviewIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  overviewContent: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  overviewSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  settingsCard: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    marginBottom: SPACING.lg,
  },
  sectionTitleGradient: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
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
  settingIconContainer: {
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
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  quickActionButton: {
    flex: 1,
  },
});
