import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { GlassCard } from '../components/GlassCard';

interface ProjectAnalyticsScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const { width } = Dimensions.get('window');

interface ProjectMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
}

interface ProjectData {
  id: string;
  name: string;
  completionRate: number;
  tasksCompleted: number;
  totalTasks: number;
  teamSize: number;
  budgetUsed: number;
  totalBudget: number;
  timelineProgress: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdate: string;
}

export const ProjectAnalyticsScreen: React.FC<ProjectAnalyticsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const projectMetrics: ProjectMetric[] = [
    {
      id: '1',
      name: 'Project Completion',
      value: 78,
      change: 12,
      trend: 'up',
      color: '#10B981',
      icon: 'checkmark-circle',
    },
    {
      id: '2',
      name: 'Team Productivity',
      value: 85,
      change: -3,
      trend: 'down',
      color: '#6366F1',
      icon: 'trending-up',
    },
    {
      id: '3',
      name: 'Budget Utilization',
      value: 67,
      change: 5,
      trend: 'up',
      color: '#F59E0B',
      icon: 'wallet',
    },
    {
      id: '4',
      name: 'Timeline Adherence',
      value: 92,
      change: 0,
      trend: 'stable',
      color: '#EC4899',
      icon: 'time',
    },
  ];

  const projectData: ProjectData[] = [
    {
      id: '1',
      name: 'BGFocus Mobile App',
      completionRate: 75,
      tasksCompleted: 45,
      totalTasks: 60,
      teamSize: 8,
      budgetUsed: 45000,
      totalBudget: 60000,
      timelineProgress: 80,
      riskLevel: 'low',
      lastUpdate: '2024-09-15',
    },
    {
      id: '2',
      name: 'Analytics Dashboard',
      completionRate: 45,
      tasksCompleted: 18,
      totalTasks: 40,
      teamSize: 5,
      budgetUsed: 25000,
      totalBudget: 50000,
      timelineProgress: 60,
      riskLevel: 'medium',
      lastUpdate: '2024-09-14',
    },
    {
      id: '3',
      name: 'User Authentication',
      completionRate: 100,
      tasksCompleted: 25,
      totalTasks: 25,
      teamSize: 3,
      budgetUsed: 15000,
      totalBudget: 20000,
      timelineProgress: 100,
      riskLevel: 'low',
      lastUpdate: '2024-09-10',
    },
    {
      id: '4',
      name: 'API Integration',
      completionRate: 15,
      tasksCompleted: 3,
      totalTasks: 20,
      teamSize: 4,
      budgetUsed: 8000,
      totalBudget: 30000,
      timelineProgress: 25,
      riskLevel: 'high',
      lastUpdate: '2024-09-12',
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return 'shield-checkmark';
      case 'medium': return 'warning';
      case 'high': return 'alert-circle';
      default: return 'help-circle';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      case 'stable': return 'remove';
      default: return 'remove';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      case 'stable': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      {/* Custom Header */}
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Project Analytics</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Track performance</Text>
        </View>
        
        <TouchableOpacity style={styles.timeframeButton}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            style={styles.timeframeButtonGradient}
          >
            <Ionicons name="calendar" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Key Metrics Overview */}
        <GlassCard style={styles.metricsCard} neumorphism glow>
          <View style={styles.metricsHeader}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.metricsIconGradient}
            >
              <Ionicons name="analytics" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.metricsContent}>
              <Text style={[styles.metricsTitle, { color: colors.text }]}>Key Performance Metrics</Text>
              <Text style={[styles.metricsSubtitle, { color: colors.textSecondary }]}>
                Last {selectedTimeframe}
              </Text>
            </View>
          </View>
          
          <View style={styles.metricsGrid}>
            {projectMetrics.map((metric) => (
              <View key={metric.id} style={styles.metricItem}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIconContainer, { backgroundColor: metric.color }]}>
                    <Ionicons name={metric.icon as any} size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.metricTrend}>
                    <Ionicons 
                      name={getTrendIcon(metric.trend) as any} 
                      size={12} 
                      color={getTrendColor(metric.trend)} 
                    />
                    <Text style={[styles.metricChange, { color: getTrendColor(metric.trend) }]}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </Text>
                  </View>
                </View>
                <Text style={[styles.metricValue, { color: colors.text }]}>{metric.value}%</Text>
                <Text style={[styles.metricName, { color: colors.textSecondary }]}>{metric.name}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Project Performance Chart */}
        <GlassCard style={styles.chartCard} neumorphism glow>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Project Performance</Text>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>Completion</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#6366F1' }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>Timeline</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            {projectData.map((project, index) => (
              <View key={project.id} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={[
                      styles.completionBar, 
                      { height: (project.completionRate / 100) * 100 }
                    ]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                  />
                  <LinearGradient
                    colors={['#6366F1', '#4F46E5']}
                    style={[
                      styles.timelineBar, 
                      { height: (project.timelineProgress / 100) * 100 }
                    ]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                  />
                  <Text style={[styles.barValue, { color: colors.text }]}>{project.completionRate}%</Text>
                </View>
                <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                  {project.name.split(' ')[0]}
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Project Details */}
        <View style={styles.projectsList}>
          {projectData.map((project) => (
            <GlassCard key={project.id} style={styles.projectCard} neumorphism>
              <View style={styles.projectContent}>
                <View style={styles.projectHeader}>
                  <View style={styles.projectLeft}>
                    <View style={[styles.projectIconContainer, { backgroundColor: getRiskColor(project.riskLevel) }]}>
                      <Ionicons name={getRiskIcon(project.riskLevel) as any} size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.projectInfo}>
                      <Text style={[styles.projectName, { color: colors.text }]}>{project.name}</Text>
                      <Text style={[styles.projectRisk, { color: getRiskColor(project.riskLevel) }]}>
                        {project.riskLevel.toUpperCase()} RISK
                      </Text>
                    </View>
                  </View>
                  <View style={styles.projectStatus}>
                    <Text style={[styles.completionRate, { color: colors.text }]}>{project.completionRate}%</Text>
                    <Text style={[styles.completionLabel, { color: colors.textSecondary }]}>Complete</Text>
                  </View>
                </View>

                <View style={styles.projectMetrics}>
                  <View style={styles.metricRow}>
                    <View style={styles.metricItem}>
                      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Tasks</Text>
                      <Text style={[styles.metricValue, { color: colors.text }]}>
                        {project.tasksCompleted}/{project.totalTasks}
                      </Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Team</Text>
                      <Text style={[styles.metricValue, { color: colors.text }]}>{project.teamSize}</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Timeline</Text>
                      <Text style={[styles.metricValue, { color: colors.text }]}>{project.timelineProgress}%</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.projectProgress}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Progress</Text>
                    <Text style={[styles.progressValue, { color: colors.text }]}>{project.completionRate}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={[getRiskColor(project.riskLevel), `${getRiskColor(project.riskLevel)}CC`]}
                      style={[styles.progressFill, { width: `${project.completionRate}%` }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                </View>

                <View style={styles.projectBudget}>
                  <View style={styles.budgetHeader}>
                    <Text style={[styles.budgetLabel, { color: colors.textSecondary }]}>Budget</Text>
                    <Text style={[styles.budgetValue, { color: colors.text }]}>
                      ${project.budgetUsed.toLocaleString()}/${project.totalBudget.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.budgetBar}>
                    <LinearGradient
                      colors={['#F59E0B', '#D97706']}
                      style={[styles.budgetFill, { width: `${(project.budgetUsed / project.totalBudget) * 100}%` }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                </View>

                <View style={styles.projectFooter}>
                  <View style={styles.projectDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        Updated {new Date(project.lastUpdate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.viewDetailsButton}>
                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Risk Analysis */}
        <GlassCard style={styles.riskCard} neumorphism glow>
          <View style={styles.riskHeader}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.riskIconGradient}
            >
              <Ionicons name="warning" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.riskContent}>
              <Text style={[styles.riskTitle, { color: colors.text }]}>Risk Analysis</Text>
              <Text style={[styles.riskSubtitle, { color: colors.textSecondary }]}>
                Project risk assessment
              </Text>
            </View>
          </View>
          
          <View style={styles.riskStats}>
            <View style={styles.riskStatItem}>
              <Text style={[styles.riskStatValue, { color: '#10B981' }]}>
                {projectData.filter(p => p.riskLevel === 'low').length}
              </Text>
              <Text style={[styles.riskStatLabel, { color: colors.textSecondary }]}>Low Risk</Text>
            </View>
            <View style={styles.riskStatItem}>
              <Text style={[styles.riskStatValue, { color: '#F59E0B' }]}>
                {projectData.filter(p => p.riskLevel === 'medium').length}
              </Text>
              <Text style={[styles.riskStatLabel, { color: colors.textSecondary }]}>Medium Risk</Text>
            </View>
            <View style={styles.riskStatItem}>
              <Text style={[styles.riskStatValue, { color: '#EF4444' }]}>
                {projectData.filter(p => p.riskLevel === 'high').length}
              </Text>
              <Text style={[styles.riskStatLabel, { color: colors.textSecondary }]}>High Risk</Text>
            </View>
          </View>
        </GlassCard>
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
  timeframeButton: {
    marginLeft: SPACING.md,
  },
  timeframeButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  metricsCard: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  metricsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  metricsIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  metricsContent: {
    flex: 1,
  },
  metricsTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  metricsSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metricIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricChange: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  metricValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  metricName: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    opacity: 0.7,
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
  },
  chartLegend: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 100,
    position: 'relative',
  },
  completionBar: {
    width: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  timelineBar: {
    width: 12,
    borderRadius: 6,
    position: 'absolute',
    right: 0,
  },
  barValue: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: 4,
  },
  barLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: 4,
    opacity: 0.7,
  },
  projectsList: {
    marginBottom: SPACING.lg,
  },
  projectCard: {
    marginBottom: SPACING.md,
  },
  projectContent: {
    padding: SPACING.lg,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  projectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  projectRisk: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  projectStatus: {
    alignItems: 'center',
  },
  completionRate: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  completionLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    opacity: 0.7,
  },
  projectMetrics: {
    marginBottom: SPACING.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  projectProgress: {
    marginBottom: SPACING.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  progressValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  projectBudget: {
    marginBottom: SPACING.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  budgetLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  budgetValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
  },
  budgetBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  budgetFill: {
    height: '100%',
    borderRadius: 3,
  },
  projectFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectDetails: {
    flexDirection: 'row',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  viewDetailsButton: {
    padding: SPACING.sm,
  },
  riskCard: {
    marginBottom: SPACING.xl,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  riskIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  riskContent: {
    flex: 1,
  },
  riskTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  riskSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  riskStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  riskStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  riskStatValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  riskStatLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
