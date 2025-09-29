import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { ProductivityStats, AIInsight } from '../types';

const { width } = Dimensions.get('window');

interface InsightsScreenProps {
  navigation: any;
}

const mockStats: ProductivityStats = {
  tasksCompleted: 45,
  tasksCompletedToday: 8,
  focusTimeToday: 240,
  focusTimeWeek: 1800,
  streak: 12,
  weeklyGoal: 300,
  achievements: ['Early Bird', 'Focus Master', 'Task Champion', 'Productivity Pro'],
  productivityScore: 92,
  averageSessionLength: 24,
  bestStreak: 15,
};

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'productivity',
    title: 'Peak Performance Time',
    description: 'You\'re most productive between 9-11 AM. Schedule your most important tasks during this window.',
    actionable: true,
    priority: 'high',
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'focus',
    title: 'Optimal Session Length',
    description: 'Your focus sessions average 24 minutes. Consider adjusting to 25-minute Pomodoros for better results.',
    actionable: true,
    priority: 'medium',
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'wellness',
    title: 'Break Pattern Analysis',
    description: 'You take breaks every 45 minutes on average. This is excellent for maintaining focus!',
    actionable: false,
    priority: 'low',
    timestamp: new Date(),
  },
];

const weeklyData = [
  { day: 'Mon', focus: 120, tasks: 6 },
  { day: 'Tue', focus: 180, tasks: 8 },
  { day: 'Wed', focus: 90, tasks: 4 },
  { day: 'Thu', focus: 210, tasks: 9 },
  { day: 'Fri', focus: 150, tasks: 7 },
  { day: 'Sat', focus: 60, tasks: 3 },
  { day: 'Sun', focus: 30, tasks: 2 },
];

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [stats] = useState<ProductivityStats>(mockStats);
  const [insights] = useState<AIInsight[]>(mockInsights);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProductivityGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: colors.success };
    if (score >= 80) return { grade: 'A', color: colors.primary };
    if (score >= 70) return { grade: 'B', color: colors.warning };
    return { grade: 'C', color: colors.error };
  };

  const getInsightIcon = (type: string) => {
    const icons = {
      productivity: 'trending-up',
      focus: 'timer',
      task: 'checkmark-circle',
      schedule: 'calendar',
      wellness: 'heart',
    };
    return icons[type as keyof typeof icons] || 'bulb';
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.primary;
    }
  };

  const renderChart = () => (
    <View style={styles.chartContainer}>
      <Text style={[styles.chartTitle, { color: colors.text }]}>Weekly Activity</Text>
      <View style={styles.chart}>
        {weeklyData.map((data, index) => (
          <View key={data.day} style={styles.chartBar}>
            <View style={styles.chartValues}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { 
                    height: (data.focus / 240) * 100,
                    backgroundColor: colors.primary,
                  }
                ]} 
              />
            </View>
            <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>{data.day}</Text>
            <Text style={[styles.chartValue, { color: colors.textSecondary }]}>{data.tasks}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderInsight = (insight: AIInsight) => (
    <GlassCard key={insight.id} style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <View style={[styles.insightIcon, { backgroundColor: `${getInsightColor(insight.priority)}20` }]}>
          <Ionicons 
            name={getInsightIcon(insight.type) as any} 
            size={20} 
            color={getInsightColor(insight.priority)} 
          />
        </View>
        <View style={styles.insightContent}>
          <Text style={[styles.insightTitle, { color: colors.text }]}>{insight.title}</Text>
          <Text style={[styles.insightDescription, { color: colors.textSecondary }]}>
            {insight.description}
          </Text>
        </View>
      </View>
      {insight.actionable && (
        <AnimatedButton
          title="Apply Suggestion"
          onPress={() => {}}
          variant="primary"
          size="small"
          icon="arrow-forward"
          iconPosition="right"
        />
      )}
    </GlassCard>
  );

  const productivityGrade = getProductivityGrade(stats.productivityScore);

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Insights</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Productivity Score */}
        <GlassCard style={styles.scoreCard} glow>
          <View style={styles.scoreHeader}>
            <Text style={[styles.scoreTitle, { color: colors.text }]}>Productivity Score</Text>
            <View style={[styles.scoreGrade, { backgroundColor: productivityGrade.color }]}>
              <Text style={[styles.scoreGradeText, { color: colors.text }]}>{productivityGrade.grade}</Text>
            </View>
          </View>
          <Text style={[styles.scoreValue, { color: colors.text }]}>{stats.productivityScore}/100</Text>
          <Text style={[styles.scoreDescription, { color: colors.textSecondary }]}>
            Excellent work! You're performing above average this week.
          </Text>
        </GlassCard>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                { backgroundColor: colors.glass },
                selectedPeriod === period && { backgroundColor: `${colors.primary}20` },
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                { color: colors.textSecondary },
                selectedPeriod === period && { color: colors.primary, fontWeight: FONT_WEIGHTS.semiBold },
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        {renderChart()}

        {/* Key Metrics */}
        <GlassCard style={styles.metricsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{stats.tasksCompleted}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Tasks Completed</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.secondary }]}>{formatTime(stats.focusTimeWeek)}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Focus Time</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.accent }]}>{stats.streak}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Day Streak</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.success }]}>{stats.averageSessionLength}m</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Avg Session</Text>
            </View>
          </View>
        </GlassCard>

        {/* Achievements */}
        <GlassCard style={styles.achievementsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Achievements</Text>
          <View style={styles.achievementsList}>
            {stats.achievements.map((achievement, index) => (
              <View key={index} style={[styles.achievementItem, { backgroundColor: colors.glass }]}>
                <Ionicons name="trophy" size={20} color={colors.secondary} />
                <Text style={[styles.achievementText, { color: colors.text }]}>{achievement}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* AI Insights */}
        <View style={styles.insightsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Insights</Text>
          {insights.map(renderInsight)}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <AnimatedButton
            title="Export Report"
            onPress={() => {}}
            variant="secondary"
            icon="download"
            iconPosition="left"
          />
          <AnimatedButton
            title="Share Progress"
            onPress={() => {}}
            variant="primary"
            icon="share"
            iconPosition="left"
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  settingsButton: {
    padding: SPACING.sm,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  scoreCard: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.md,
  },
  scoreTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  scoreGrade: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreGradeText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.sm,
  },
  scoreDescription: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  periodButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodText: {
    fontSize: FONT_SIZES.sm,
  },
  chartContainer: {
    marginBottom: SPACING.lg,
  },
  chartTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: SPACING.sm,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  chartValues: {
    height: 80,
    justifyContent: 'flex-end',
    width: 20,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 2,
  },
  chartLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.sm,
  },
  chartValue: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  metricsCard: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  metricValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  achievementsCard: {
    marginBottom: SPACING.lg,
  },
  achievementsList: {
    gap: SPACING.sm,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  achievementText: {
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  insightsSection: {
    marginBottom: SPACING.lg,
  },
  insightCard: {
    marginBottom: SPACING.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
});
