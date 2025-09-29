import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';

const { width } = Dimensions.get('window');

interface AnalyticsScreenProps {
  navigation: any;
}

// Get current date and generate real months
const getCurrentMonths = () => {
  const now = new Date();
  const months = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const colors = ['#4CAF50', '#81C784', '#F48FB1', '#BA68C8', '#FF9800', '#2196F3', '#9C27B0', '#00BCD4'];
  
  // Get last 4 months including current month
  for (let i = 3; i >= 0; i--) {
    const monthIndex = (now.getMonth() - i + 12) % 12;
    months.push({
      month: monthNames[monthIndex],
      value: Math.floor(Math.random() * 30) + 70, // Random values between 70-100
      color: colors[i % colors.length]
    });
  }
  return months;
};

const mockAnalytics = {
  totalProjects: 22,
  ongoingProjects: 13,
  performance: 90,
  absence: 1,
  monthlyData: getCurrentMonths(),
  weeklyData: [
    { day: 'Mon', value: 85, color: '#4CAF50' },
    { day: 'Tue', value: 78, color: '#81C784' },
    { day: 'Wed', value: 92, color: '#F48FB1' },
    { day: 'Thu', value: 88, color: '#BA68C8' },
    { day: 'Fri', value: 95, color: '#FF9800' },
    { day: 'Sat', value: 72, color: '#2196F3' },
    { day: 'Sun', value: 68, color: '#9C27B0' },
  ],
  dailyData: [
    { hour: '9AM', value: 85, color: '#4CAF50' },
    { hour: '12PM', value: 92, color: '#81C784' },
    { hour: '3PM', value: 78, color: '#F48FB1' },
    { hour: '6PM', value: 88, color: '#BA68C8' },
  ],
};

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  const timePeriods = [
    { id: 'today', label: 'Today', icon: 'today' },
    { id: 'week', label: 'This Week', icon: 'calendar' },
    { id: 'month', label: 'This Month', icon: 'calendar-outline' },
    { id: 'year', label: 'This Year', icon: 'calendar-sharp' },
  ];

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'Today':
        return mockAnalytics.dailyData;
      case 'This Week':
        return mockAnalytics.weeklyData;
      case 'This Month':
        return mockAnalytics.monthlyData;
      default:
        return mockAnalytics.monthlyData;
    }
  };

  const getChartTitle = () => {
    switch (selectedPeriod) {
      case 'Today':
        return 'Daily Performance';
      case 'This Week':
        return 'Weekly Performance';
      case 'This Month':
        return 'Monthly Performance';
      default:
        return 'Monthly Performance';
    }
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setShowPeriodModal(false);
  };

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Performance Dashboard</Text>
          </View>
          <TouchableOpacity 
            style={styles.periodSelector}
            onPress={() => setShowPeriodModal(true)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.periodGradient}
            >
              <Text style={[styles.periodText, { color: colors.text }]}>{selectedPeriod}</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Enhanced Chart Section */}
        <GlassCard style={styles.chartCard} neumorphism glow>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>{getChartTitle()}</Text>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>Excellent</Text>
              </View>
            </View>
          </View>
          <View style={styles.chartContainer}>
            {getCurrentData().map((data, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <LinearGradient
                    colors={[data.color, `${data.color}CC`]}
                    style={[
                      styles.bar, 
                      { height: (data.value / 100) * 120 }
                    ]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                  />
                  <Text style={[styles.barValue, { color: colors.text }]}>{data.value}%</Text>
                </View>
                <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                  {data.month || data.day || data.hour}
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Enhanced KPIs Section */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiRow}>
            <GlassCard style={styles.kpiCard} neumorphism>
              <LinearGradient
                colors={['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.05)']}
                style={styles.kpiGradient}
              >
                <View style={styles.kpiIconContainer}>
                  <Ionicons name="folder" size={24} color="#6366F1" />
                </View>
                <Text style={[styles.kpiValue, { color: '#6366F1' }]}>{mockAnalytics.totalProjects}</Text>
                <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Total Projects</Text>
              </LinearGradient>
            </GlassCard>
            
            <GlassCard style={styles.kpiCard} neumorphism>
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                style={styles.kpiGradient}
              >
                <View style={styles.kpiIconContainer}>
                  <Ionicons name="trending-up" size={24} color="#10B981" />
                </View>
                <Text style={[styles.kpiValue, { color: '#10B981' }]}>{mockAnalytics.ongoingProjects}</Text>
                <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Active Projects</Text>
              </LinearGradient>
            </GlassCard>
          </View>
          
          <View style={styles.kpiRow}>
            <GlassCard style={styles.kpiCard} neumorphism>
              <LinearGradient
                colors={['rgba(236, 72, 153, 0.1)', 'rgba(236, 72, 153, 0.05)']}
                style={styles.kpiGradient}
              >
                <View style={styles.kpiIconContainer}>
                  <Ionicons name="analytics" size={24} color="#EC4899" />
                </View>
                <Text style={[styles.kpiValue, { color: '#EC4899' }]}>{mockAnalytics.performance}%</Text>
                <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Performance</Text>
              </LinearGradient>
            </GlassCard>
            
            <GlassCard style={styles.kpiCard} neumorphism>
              <LinearGradient
                colors={['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
                style={styles.kpiGradient}
              >
                <View style={styles.kpiIconContainer}>
                  <Ionicons name="calendar" size={24} color="#F59E0B" />
                </View>
                <Text style={[styles.kpiValue, { color: '#F59E0B' }]}>{mockAnalytics.absence}</Text>
                <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Absence</Text>
              </LinearGradient>
            </GlassCard>
          </View>
        </View>

        {/* Enhanced Account Settings */}
        <GlassCard style={styles.settingsCard} neumorphism glow>
          <View style={styles.settingsHeader}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.settingsTitleGradient}
            >
              <Text style={styles.settingsTitle}>Account Settings</Text>
            </LinearGradient>
          </View>
          {[
            { icon: 'person-circle', title: 'Personal Information', subtitle: 'Manage your profile', screen: 'PersonalInformation' },
            { icon: 'notifications', title: 'Notifications', subtitle: 'Configure alerts', screen: 'Notifications' },
            { icon: 'card', title: 'Subscription', subtitle: 'Manage your plan', screen: 'Subscription' },
            { icon: 'shield-checkmark', title: 'Security', subtitle: 'Privacy & security', screen: 'Security' },
          ].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.settingItem}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name={item.icon as any} size={20} color="#6366F1" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </GlassCard>

        {/* Enhanced Project Settings */}
        <GlassCard style={styles.settingsCard} neumorphism glow>
          <View style={styles.settingsHeader}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.settingsTitleGradient}
            >
              <Text style={styles.settingsTitle}>Project Management</Text>
            </LinearGradient>
          </View>
          {[
            { icon: 'folder-open', title: 'Manage Projects', subtitle: 'Organize your work', screen: 'ManageProjects' },
            { icon: 'people', title: 'Team Members', subtitle: 'Collaborate effectively', screen: 'TeamMembers' },
            { icon: 'analytics', title: 'Project Analytics', subtitle: 'Track performance', screen: 'ProjectAnalytics' },
            { icon: 'document', title: 'Project Files', subtitle: 'Manage documents', screen: 'ProjectFiles' },
          ].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.settingItem}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <Ionicons name={item.icon as any} size={20} color="#10B981" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </GlassCard>
      </ScrollView>

      {/* Time Period Selection Modal */}
      <Modal
        visible={showPeriodModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPeriodModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Time Period</Text>
              <TouchableOpacity 
                onPress={() => setShowPeriodModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.periodOptions}>
              {timePeriods.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  style={[
                    styles.periodOption,
                    selectedPeriod === period.label && styles.periodOptionSelected
                  ]}
                  onPress={() => handlePeriodSelect(period.label)}
                  activeOpacity={0.7}
                >
                  <View style={styles.periodOptionLeft}>
                    <View style={[
                      styles.periodIconContainer,
                      { backgroundColor: selectedPeriod === period.label ? '#6366F1' : 'rgba(255, 255, 255, 0.1)' }
                    ]}>
                      <Ionicons 
                        name={period.icon as any} 
                        size={20} 
                        color={selectedPeriod === period.label ? '#FFFFFF' : colors.textSecondary} 
                      />
                    </View>
                    <Text style={[
                      styles.periodOptionText,
                      { color: selectedPeriod === period.label ? '#6366F1' : colors.text }
                    ]}>
                      {period.label}
                    </Text>
                  </View>
                  {selectedPeriod === period.label && (
                    <Ionicons name="checkmark-circle" size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  periodSelector: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  periodText: {
    fontSize: FONT_SIZES.sm,
    marginRight: 6,
    fontWeight: FONT_WEIGHTS.medium,
  },
  chartCard: {
    marginBottom: SPACING.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  chartTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.3,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingVertical: SPACING.md,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  bar: {
    width: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  barValue: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: 4,
  },
  barLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kpiContainer: {
    marginBottom: SPACING.lg,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  kpiGradient: {
    padding: SPACING.md,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  kpiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  kpiValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  kpiLabel: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsCard: {
    marginBottom: SPACING.lg,
  },
  settingsHeader: {
    marginBottom: SPACING.lg,
  },
  settingsTitleGradient: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  settingsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
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
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
  settingSubtitle: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 20,
    padding: SPACING.lg,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  modalCloseButton: {
    padding: SPACING.sm,
  },
  periodOptions: {
    gap: SPACING.sm,
  },
  periodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodOptionSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: '#6366F1',
  },
  periodOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  periodOptionText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
});
