import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { Task } from '../types';

interface TasksScreenProps {
  navigation: any;
}

type FilterType = 'all' | 'today' | 'upcoming' | 'completed';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review project proposal',
    description: 'Analyze the Q4 budget proposal and provide feedback',
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
  {
    id: '4',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, vegetables',
    completed: false,
    priority: 'low',
    category: 'Personal',
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDuration: 20,
  },
  {
    id: '5',
    title: 'Read React Native docs',
    description: 'Study new features and best practices',
    completed: true,
    priority: 'high',
    category: 'Learning',
    createdAt: new Date(),
    updatedAt: new Date(),
    aiSuggested: true,
    estimatedDuration: 45,
  },
];

export const TasksScreen: React.FC<TasksScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'today':
        return tasks.filter(task => {
          const today = new Date();
          return task.dueDate && 
                 task.dueDate.toDateString() === today.toDateString();
        });
      case 'upcoming':
        return tasks.filter(task => !task.completed && task.dueDate);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
      )
    );
  };

  const addNewTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        description: '',
        completed: false,
        priority: 'medium',
        category: 'Personal',
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDuration: 15,
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setNewTaskTitle('');
      setShowAddTask(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'arrow-up';
      case 'medium': return 'remove';
      case 'low': return 'arrow-down';
      default: return 'ellipse';
    }
  };

  const renderTask = ({ item: task }: { item: Task }) => (
    <TouchableOpacity
      style={[styles.taskItem, { backgroundColor: colors.glass }]}
      onPress={() => toggleTaskCompletion(task.id)}
    >
      <View style={styles.taskLeft}>
        <View style={styles.taskCheckbox}>
          <Ionicons
            name={task.completed ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={task.completed ? colors.success : colors.textSecondary}
          />
        </View>
        
        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <Text style={[styles.taskTitle, { color: colors.text }, task.completed && styles.completedTask]}>
              {task.title}
            </Text>
            {task.aiSuggested && (
              <View style={[styles.aiBadge, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons name="sparkles" size={12} color={colors.primary} />
                <Text style={[styles.aiBadgeText, { color: colors.primary }]}>AI</Text>
              </View>
            )}
          </View>
          
          {task.description && (
            <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>{task.description}</Text>
          )}
          
          <View style={styles.taskMeta}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
              <Ionicons 
                name={getPriorityIcon(task.priority) as any} 
                size={12} 
                color={colors.text} 
              />
              <Text style={[styles.priorityText, { color: colors.text }]}>{task.priority}</Text>
            </View>
            
            <View style={[styles.categoryBadge, { backgroundColor: colors.border }]}>
              <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{task.category}</Text>
            </View>
            
            {task.dueDate && (
              <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
                {task.dueDate.toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-circle-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No tasks found</Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        {activeFilter === 'completed' 
          ? "You haven't completed any tasks yet."
          : "Add a new task to get started!"}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tasks</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddTask(!showAddTask)}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Add Task Input */}
      {showAddTask && (
        <GlassCard style={styles.addTaskCard}>
          <TextInput
            style={[styles.taskInput, { color: colors.text, borderBottomColor: colors.border }]}
            placeholder="What needs to be done?"
            placeholderTextColor={colors.textSecondary}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            autoFocus
          />
          <View style={styles.addTaskActions}>
            <AnimatedButton
              title="Cancel"
              onPress={() => setShowAddTask(false)}
              variant="ghost"
              size="small"
            />
            <AnimatedButton
              title="Add Task"
              onPress={addNewTask}
              variant="primary"
              size="small"
            />
          </View>
        </GlassCard>
      )}

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { key: 'all', label: 'All', count: tasks.length },
          { key: 'today', label: 'Today', count: tasks.filter(t => {
            const today = new Date();
            return t.dueDate && t.dueDate.toDateString() === today.toDateString();
          }).length },
          { key: 'upcoming', label: 'Upcoming', count: tasks.filter(t => !t.completed && t.dueDate).length },
          { key: 'completed', label: 'Completed', count: tasks.filter(t => t.completed).length },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              { backgroundColor: colors.glass },
              activeFilter === filter.key && { backgroundColor: `${colors.primary}20` },
            ]}
            onPress={() => setActiveFilter(filter.key as FilterType)}
          >
            <Text style={[
              styles.filterText,
              { color: colors.textSecondary },
              activeFilter === filter.key && { color: colors.primary, fontWeight: FONT_WEIGHTS.semiBold },
            ]}>
              {filter.label}
            </Text>
            <View style={[
              styles.filterBadge,
              { backgroundColor: activeFilter === filter.key ? colors.primary : colors.border },
            ]}>
              <Text style={[
                styles.filterBadgeText,
                { color: activeFilter === filter.key ? colors.text : colors.textSecondary },
              ]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tasks List */}
      <FlatList
        data={getFilteredTasks()}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.tasksList}
        contentContainerStyle={styles.tasksContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* AI Suggestion Card */}
      <GlassCard style={styles.aiSuggestionCard}>
        <View style={styles.aiSuggestionHeader}>
          <Ionicons name="bulb-outline" size={20} color={colors.primary} />
          <Text style={[styles.aiSuggestionTitle, { color: colors.text }]}>AI Suggestion</Text>
        </View>
        <Text style={[styles.aiSuggestionText, { color: colors.textSecondary }]}>
          You have 3 high-priority tasks. Consider using the Pomodoro technique to tackle them efficiently!
        </Text>
        <AnimatedButton
          title="Start Focus Session"
          onPress={() => navigation.navigate('Focus')}
          variant="primary"
          icon="arrow-forward"
          iconPosition="right"
          size="small"
        />
      </GlassCard>
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
  addButton: {
    padding: SPACING.sm,
  },
  addTaskCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  taskInput: {
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    marginBottom: SPACING.md,
  },
  addTaskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  filterContainer: {
    marginBottom: SPACING.md,
  },
  filterContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.sm,
  },
  filterBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  tasksList: {
    flex: 1,
  },
  tasksContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  taskItem: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskCheckbox: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: SPACING.sm,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginLeft: 2,
  },
  taskDescription: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginLeft: 2,
    textTransform: 'capitalize',
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.medium,
  },
  dueDate: {
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  aiSuggestionCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  aiSuggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  aiSuggestionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: SPACING.sm,
  },
  aiSuggestionText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
});