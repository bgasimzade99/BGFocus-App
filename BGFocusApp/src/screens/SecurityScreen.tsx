import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';

interface SecurityScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export const SecurityScreen: React.FC<SecurityScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricLogin: true,
    sessionTimeout: true,
    loginNotifications: true,
    dataEncryption: true,
    auditLogging: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleToggle = (key: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }
    Alert.alert('Success', 'Password changed successfully.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  const securityFeatures = [
    {
      key: 'twoFactorAuth',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: 'shield-checkmark',
      color: '#10B981',
    },
    {
      key: 'biometricLogin',
      title: 'Biometric Login',
      description: 'Use fingerprint or face recognition',
      icon: 'finger-print',
      color: '#6366F1',
    },
    {
      key: 'sessionTimeout',
      title: 'Session Timeout',
      description: 'Automatically log out after inactivity',
      icon: 'time',
      color: '#F59E0B',
    },
    {
      key: 'loginNotifications',
      title: 'Login Notifications',
      description: 'Get notified of new login attempts',
      icon: 'notifications',
      color: '#EC4899',
    },
    {
      key: 'dataEncryption',
      title: 'Data Encryption',
      description: 'Encrypt all your data locally',
      icon: 'lock-closed',
      color: '#8B5CF6',
    },
    {
      key: 'auditLogging',
      title: 'Audit Logging',
      description: 'Track all account activities',
      icon: 'document-text',
      color: '#06B6D4',
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Security</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Protect your account</Text>
        </View>
        
        <View style={styles.headerRight}>
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.1)']}
            style={styles.headerIconGradient}
          >
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          </LinearGradient>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Security Overview */}
        <GlassCard style={styles.overviewCard} neumorphism glow>
          <View style={styles.overviewHeader}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.overviewIconGradient}
            >
              <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.overviewContent}>
              <Text style={[styles.overviewTitle, { color: colors.text }]}>Security Center</Text>
              <Text style={[styles.overviewSubtitle, { color: colors.textSecondary }]}>
                Your account is protected with advanced security features
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Password Management */}
        <GlassCard style={styles.settingsCard} neumorphism>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionTitleGradient}
            >
              <Text style={styles.sectionTitle}>Password Management</Text>
            </LinearGradient>
          </View>

          <TouchableOpacity
            style={styles.passwordItem}
            onPress={() => setShowPasswordForm(!showPasswordForm)}
            activeOpacity={0.7}
          >
            <View style={styles.passwordLeft}>
              <View style={[styles.passwordIconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                <Ionicons name="key" size={20} color="#6366F1" />
              </View>
              <View style={styles.passwordContent}>
                <Text style={[styles.passwordTitle, { color: colors.text }]}>Change Password</Text>
                <Text style={[styles.passwordDescription, { color: colors.textSecondary }]}>
                  Update your account password
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          {showPasswordForm && (
            <View style={styles.passwordForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Current Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={passwordData.currentPassword}
                    onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                    placeholder="Enter current password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={passwordData.newPassword}
                    onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                    placeholder="Enter new password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm New Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={passwordData.confirmPassword}
                    onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                    placeholder="Confirm new password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.passwordActions}>
                <AnimatedButton
                  title="Cancel"
                  onPress={() => setShowPasswordForm(false)}
                  variant="ghost"
                  style={styles.passwordActionButton}
                />
                <AnimatedButton
                  title="Change Password"
                  onPress={handleChangePassword}
                  variant="primary"
                  style={styles.passwordActionButton}
                />
              </View>
            </View>
          )}
        </GlassCard>

        {/* Security Features */}
        <GlassCard style={styles.settingsCard} neumorphism>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#EC4899', '#BE185D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionTitleGradient}
            >
              <Text style={styles.sectionTitle}>Security Features</Text>
            </LinearGradient>
          </View>

          {securityFeatures.map((feature) => (
            <View key={feature.key} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, { backgroundColor: `${feature.color}20` }]}>
                  <Ionicons name={feature.icon as any} size={20} color={feature.color} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{feature.title}</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={securitySettings[feature.key as keyof typeof securitySettings]}
                onValueChange={() => handleToggle(feature.key)}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: `${feature.color}40` }}
                thumbColor={securitySettings[feature.key as keyof typeof securitySettings] ? feature.color : 'rgba(255, 255, 255, 0.3)'}
                ios_backgroundColor="rgba(255, 255, 255, 0.1)"
              />
            </View>
          ))}
        </GlassCard>

        {/* Security Status */}
        <GlassCard style={styles.statusCard} neumorphism>
          <View style={styles.statusHeader}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.statusIconGradient}
            >
              <Ionicons name="shield" size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.statusContent}>
              <Text style={[styles.statusTitle, { color: colors.text }]}>Security Score</Text>
              <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
                Your account security level
              </Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreValue, { color: '#10B981' }]}>85%</Text>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Strong</Text>
            </View>
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <AnimatedButton
            title="Enable All Security"
            onPress={() => {
              const allEnabled = Object.keys(securitySettings).reduce((acc, key) => ({
                ...acc,
                [key]: true
              }), {});
              setSecuritySettings(allEnabled as typeof securitySettings);
            }}
            variant="primary"
            style={styles.quickActionButton}
          />
          <AnimatedButton
            title="Security Audit"
            onPress={() => Alert.alert('Security Audit', 'Your security settings have been reviewed. All settings are optimal.')}
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
  headerRight: {
    marginLeft: SPACING.md,
  },
  headerIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
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
    shadowColor: '#10B981',
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
  passwordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  passwordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  passwordIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  passwordContent: {
    flex: 1,
  },
  passwordTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: 2,
  },
  passwordDescription: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    opacity: 0.7,
  },
  passwordForm: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  passwordActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  passwordActionButton: {
    flex: 1,
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
  statusCard: {
    marginBottom: SPACING.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  statusIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  scoreLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
