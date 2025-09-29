import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, Alert, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { Task, ProductivityStats } from '../types';
import { Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const mockStats: ProductivityStats = {
  tasksCompleted: 12,
  tasksCompletedToday: 5,
  focusTimeToday: 180,
  focusTimeWeek: 1200,
  streak: 7,
  weeklyGoal: 300,
  achievements: ['Early Bird', 'Focus Master', 'Task Champion'],
  productivityScore: 85,
  averageSessionLength: 22,
  bestStreak: 12,
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review project proposal',
    description: 'Analyze the Q4 budget proposal',
    completed: false,
    priority: 'high',
    category: 'Work',
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    aiSuggested: true,
    estimatedDuration: 30,
  },
  {
    id: '2',
    title: 'Team standup meeting',
    description: 'Daily sync with development team',
    completed: true,
    priority: 'medium',
    category: 'Work',
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDuration: 15,
  },
  {
    id: '3',
    title: 'Gym workout',
    description: '30-minute cardio session',
    completed: false,
    priority: 'medium',
    category: 'Health',
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDuration: 30,
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [stats] = useState<ProductivityStats>(mockStats);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'Work',
    estimatedDuration: 30,
  });

  // Professional Animation System
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  useEffect(() => {
    startProfessionalAnimations();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startProfessionalAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    const hapticType = type === 'light' ? Haptics.ImpactFeedbackStyle.Light :
                      type === 'medium' ? Haptics.ImpactFeedbackStyle.Medium :
                      Haptics.ImpactFeedbackStyle.Heavy;
    Haptics.impactAsync(hapticType);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleToggleTask = (taskId: string) => {
    triggerHaptic('light');
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    triggerHaptic('medium');
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTasks(tasks.filter(task => task.id !== taskId));
            triggerHaptic('heavy');
          },
        },
      ]
    );
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    triggerHaptic('medium');
    setIsLoading(true);

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      aiSuggested: false,
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'Work',
      estimatedDuration: 30,
    });
    setShowAddTaskModal(false);
    setIsLoading(false);
    triggerHaptic('heavy');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProgressPercentage = () => {
    return (stats.focusTimeToday / stats.weeklyGoal) * 100;
  };

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
        <PremiumNavbar 
          title="BGFocus"
          subtitle="Professional Focus Management"
          variant="gradient"
          rightComponent={
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          }
        />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <GlassCard style={styles.welcomeCard} neumorphism glow>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Optimize Your Focus Sessions
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            Professional productivity management at your fingertips
          </Text>
        </GlassCard>

        {/* Performance Analysis Card */}
        <GlassCard style={styles.performanceCard} neumorphism glow>
          <View style={styles.performanceHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Analysis</Text>
            <AnimatedButton
              title="AI Report"
              onPress={() => {}}
              variant="primary"
              size="small"
              icon="analytics"
            />
          </View>
          <Text style={[styles.performanceSubtitle, { color: colors.textSecondary }]}>Total task completion</Text>
          
          {/* Circular Progress */}
          <View style={styles.circularProgressContainer}>
            <View style={styles.circularProgress}>
              <View style={[styles.progressSegment, { backgroundColor: '#6366F1', transform: [{ rotate: '0deg' }] }]} />
              <View style={[styles.progressSegment, { backgroundColor: '#EC4899', transform: [{ rotate: '120deg' }] }]} />
              <View style={[styles.progressSegment, { backgroundColor: '#10B981', transform: [{ rotate: '240deg' }] }]} />
              <View style={styles.progressCenter}>
                <Text style={[styles.progressPercentage, { color: colors.text }]}>75%</Text>
                <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Task Completed</Text>
              </View>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#6366F1' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Done</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EC4899' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>In progress</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>To do</Text>
            </View>
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <AnimatedButton
            title="Start Focus Session"
            onPress={() => navigation.navigate('focus')}
            variant="primary"
            size="large"
            icon="play-circle"
            iconPosition="left"
            style={styles.actionButton}
            gradient
          />
          
          <AnimatedButton
            title="Manage Tasks"
            onPress={() => navigation.navigate('tasks')}
            variant="neumorphism"
            size="large"
            icon="checkmark-circle"
            iconPosition="left"
            style={styles.actionButton}
          />
        </View>

        {/* Today's Tasks */}
        <GlassCard style={styles.tasksCard} neumorphism>
          <View style={styles.tasksHeader}>
            <View style={styles.tasksTitleContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Tasks</Text>
              <View style={styles.taskCountBadge}>
                <Text style={styles.taskCountText}>{tasks.length}</Text>
              </View>
            </View>
            <View style={styles.tasksActions}>
              <TouchableOpacity 
                onPress={() => setShowAddTaskModal(true)}
                style={styles.addTaskButton}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.addTaskButtonGradient}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={styles.addTaskButtonText}>Add Task</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('tasks')}>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {tasks.slice(0, 3).map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <TouchableOpacity 
                style={styles.taskLeft}
                onPress={() => handleToggleTask(task.id)}
                activeOpacity={0.7}
              >
                <View 
                  style={[
                    styles.priorityDot, 
                    { backgroundColor: task.priority === 'high' ? '#EF4444' : 
                                       task.priority === 'medium' ? '#F59E0B' : 
                                       '#10B981' }
                  ]} 
                />
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, { color: colors.text }, task.completed && styles.completedTask]}>
                    {task.title}
                  </Text>
                  <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>{task.description}</Text>
                  <View style={styles.taskMeta}>
                    <View style={[styles.categoryBadge, { backgroundColor: task.priority === 'high' ? '#EF4444' : 
                                                                        task.priority === 'medium' ? '#F59E0B' : 
                                                                        '#10B981' }]}>
                      <Text style={styles.categoryText}>{task.category}</Text>
                    </View>
                    <Text style={[styles.durationText, { color: colors.textSecondary }]}>
                      {task.estimatedDuration}m
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.taskActions}>
                <TouchableOpacity 
                  style={styles.taskCheckbox}
                  onPress={() => handleToggleTask(task.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={task.completed ? '#10B981' : colors.textSecondary} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteTaskButton}
                  onPress={() => handleDeleteTask(task.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* AI Insights */}
        <GlassCard style={styles.insightsCard} neumorphism glow>
          <View style={styles.insightsHeader}>
            <Ionicons name="bulb-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Insight</Text>
          </View>
          <Text style={[styles.insightText, { color: colors.textSecondary }]}>
            You're on fire! 🚀 Your focus sessions are 25% more productive than last week. 
            Try a 25-minute focus session next for optimal results.
          </Text>
        </GlassCard>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={showAddTaskModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddTaskModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Task</Text>
              <TouchableOpacity 
                onPress={() => setShowAddTaskModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Task Title</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newTask.title}
                  onChangeText={(text) => setNewTask({...newTask, title: text})}
                  placeholder="Enter task title"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { color: colors.text }]}
                  value={newTask.description}
                  onChangeText={(text) => setNewTask({...newTask, description: text})}
                  placeholder="Enter task description"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Priority</Text>
                <View style={styles.prioritySelector}>
                  {(['high', 'medium', 'low'] as const).map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityOption,
                        newTask.priority === priority && styles.priorityOptionSelected
                      ]}
                      onPress={() => setNewTask({...newTask, priority})}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        { color: newTask.priority === priority ? '#FFFFFF' : colors.text }
                      ]}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newTask.category}
                  onChangeText={(text) => setNewTask({...newTask, category: text})}
                  placeholder="Enter category"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Estimated Duration (minutes)</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newTask.estimatedDuration.toString()}
                  onChangeText={(text) => setNewTask({...newTask, estimatedDuration: parseInt(text) || 30})}
                  placeholder="30"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <AnimatedButton
                title="Cancel"
                onPress={() => setShowAddTaskModal(false)}
                variant="ghost"
                style={styles.modalButton}
              />
              <AnimatedButton
                title="Add Task"
                onPress={handleAddTask}
                variant="primary"
                style={styles.modalButton}
              />
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
  welcomeCard: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  profileButton: {
    padding: SPACING.sm,
  },
  performanceCard: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  performanceSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  aiReportButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 15,
  },
  aiReportText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  circularProgressContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  circularProgress: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSegment: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 20,
    borderColor: 'transparent',
    borderTopColor: 'currentColor',
  },
  progressCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 48,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
  },
  tasksCard: {
    marginBottom: SPACING.lg,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tasksTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  taskCountBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskCountText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  tasksActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  addTaskButton: {
    marginRight: SPACING.sm,
  },
  addTaskButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    gap: SPACING.sm,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  addTaskButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.md,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: 2,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskDescription: {
    fontSize: FONT_SIZES.sm,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  durationText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  taskCheckbox: {
    padding: SPACING.sm,
  },
  deleteTaskButton: {
    padding: SPACING.sm,
  },
  insightsCard: {
    marginBottom: SPACING.xl,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  insightText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
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
  modalForm: {
    maxHeight: 400,
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
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  priorityOptionSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  priorityOptionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
  },
});