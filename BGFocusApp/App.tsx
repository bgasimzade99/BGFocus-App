import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AnimatedButton } from './src/components/AnimatedButton';
import { GlassCard } from './src/components/GlassCard';
import { AIAssistant } from './src/components/AIAssistant';
import { FocusTimer } from './src/components/FocusTimer';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ProjectSettingsScreen } from './src/screens/ProjectSettingsScreen';
import { PersonalInformationScreen } from './src/screens/PersonalInformationScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { SubscriptionScreen } from './src/screens/SubscriptionScreen';
import { SecurityScreen } from './src/screens/SecurityScreen';
import { ManageProjectsScreen } from './src/screens/ManageProjectsScreen';
import { TeamMembersScreen } from './src/screens/TeamMembersScreen';
import { ProjectAnalyticsScreen } from './src/screens/ProjectAnalyticsScreen';
import { ProjectFilesScreen } from './src/screens/ProjectFilesScreen';
import { AIChatInterface } from './src/components/AIChatInterface';
import { PremiumTabBar } from './src/components/PremiumTabBar';

const { width } = Dimensions.get('window');

// Mock data
const mockTasks = [
  { id: '1', title: 'Review project proposal', description: 'Analyze Q4 budget proposal', completed: false, priority: 'high', category: 'Work', aiSuggested: true },
  { id: '2', title: 'Team standup meeting', description: 'Daily sync with development team', completed: true, priority: 'medium', category: 'Work', aiSuggested: false },
  { id: '3', title: 'Gym workout', description: '30-minute cardio session', completed: false, priority: 'medium', category: 'Health', aiSuggested: false },
  { id: '4', title: 'Read React Native docs', description: 'Study new features and best practices', completed: true, priority: 'high', category: 'Learning', aiSuggested: true },
];

const mockNotes = [
  { id: '1', title: 'Meeting Notes', content: 'Discuss project timeline and deliverables for Q4', type: 'text', isOrganized: true, category: 'Work' },
  { id: '2', title: 'Voice Note', content: 'Remember to call the client about the proposal', type: 'voice', isOrganized: false, category: 'Personal' },
  { id: '3', title: 'Ideas for App', content: 'Add dark mode, improve animations, better onboarding', type: 'text', isOrganized: true, category: 'Development' },
];

const mockInsights = [
  { type: 'productivity', title: 'Peak Performance Time', description: 'You\'re most productive between 9-11 AM. Schedule your most important tasks during this window.', actionable: true },
  { type: 'focus', title: 'Optimal Session Length', description: 'Your focus sessions average 24 minutes. Consider adjusting to 25-minute Pomodoros for better results.', actionable: true },
  { type: 'wellness', title: 'Break Pattern Analysis', description: 'You take breaks every 45 minutes on average. This is excellent for maintaining focus!', actionable: false },
];

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [tasks, setTasks] = useState(mockTasks);
  const [notes, setNotes] = useState(mockNotes);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [focusTime, setFocusTime] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('main');
  
  // Animation values for logo
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkOnboardingStatus();
    startLogoAnimations();
  }, []);

  const startLogoAnimations = () => {
    // Pulse animation for the focus target
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Slow rotation for the outer ring
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    // Wave animations for brain activity
    const waveAnimation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const waveAnimation2 = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim2, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim2, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    const waveAnimation3 = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim3, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim3, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );

    // Start all animations
    pulseAnimation.start();
    rotateAnimation.start();
    waveAnimation1.start();
    waveAnimation2.start();
    waveAnimation3.start();
  };

  const checkOnboardingStatus = async () => {
    try {
      const onboarded = await AsyncStorage.getItem('isOnboarded');
      setIsOnboarded(onboarded === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('isOnboarded', 'true');
      setIsOnboarded(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
    setCurrentScreen('main');
  };

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleTaskCompletion = (taskId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = (title: string) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      description: 'AI-suggested task',
      completed: false,
      priority: 'medium' as const,
      category: 'Personal',
      aiSuggested: true,
    };
    setTasks(prev => [newTask, ...prev]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleFocusSessionComplete = (type: 'work' | 'break') => {
    if (type === 'work') {
      setCompletedSessions(prev => prev + 1);
      setFocusTime(prev => prev + 25);
    }
  };

  const handleTimeUpdate = (timeLeft: number, totalTime: number) => {
    // Update focus time tracking
  };

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <LinearGradient colors={['#0A0A0A', '#1A1A1A']} style={styles.container}>
      {/* Professional Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            {/* Left Section - Logo & Brand */}
            <View style={styles.headerLeft}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.logoGradient}
              >
                <View style={styles.logoInner}>
                  <View style={styles.logoIcon}>
                    {/* Focus Target/Circle */}
                    <Animated.View 
                      style={[
                        styles.focusTarget,
                        {
                          transform: [
                            { scale: pulseAnim },
                            { 
                              rotate: rotateAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg'],
                              })
                            }
                          ]
                        }
                      ]}
                    >
                      <View style={styles.targetOuter}>
                        <View style={styles.targetMiddle}>
                          <View style={styles.targetCenter}>
                            <Animated.View 
                              style={[
                                styles.focusDot,
                                {
                                  transform: [{ scale: pulseAnim }]
                                }
                              ]} 
                            />
                          </View>
                        </View>
                      </View>
                    </Animated.View>
                    {/* Brain/Concentration Lines */}
                    <View style={styles.brainWaves}>
                      <Animated.View 
                        style={[
                          styles.wave,
                          {
                            opacity: waveAnim1.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.3, 1],
                            }),
                            transform: [
                              {
                                scaleX: waveAnim1.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.8, 1.2],
                                })
                              }
                            ]
                          }
                        ]} 
                      />
                      <Animated.View 
                        style={[
                          styles.wave,
                          {
                            opacity: waveAnim2.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.3, 1],
                            }),
                            transform: [
                              {
                                scaleX: waveAnim2.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.8, 1.2],
                                })
                              }
                            ]
                          }
                        ]} 
                      />
                      <Animated.View 
                        style={[
                          styles.wave,
                          {
                            opacity: waveAnim3.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.3, 1],
                            }),
                            transform: [
                              {
                                scaleX: waveAnim3.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.8, 1.2],
                                })
                              }
                            ]
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              </LinearGradient>
              <View style={styles.brandContainer}>
                <Text style={styles.headerTitle}>BGFocus</Text>
                <Text style={styles.headerSubtitle}>Professional Focus Management</Text>
              </View>
            </View>

            {/* Right Section - User Profile & Actions */}
            <View style={styles.headerRight}>
              <View style={styles.userProfile}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitials}>JD</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>John Doe</Text>
                  <Text style={styles.userRole}>Product Manager</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleNavigation('PersonalInformation')}
                >
                  <View style={styles.actionButtonIcon}>
                    <Ionicons name="person-circle" size={18} color="#6366F1" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleNavigation('Settings')}
                >
                  <View style={styles.actionButtonIcon}>
                    <Ionicons name="settings" size={18} color="#8B5CF6" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {currentScreen === 'main' && (
          <>
            {activeTab === 'home' && <HomeScreen navigation={{ navigate: (screen: string) => handleTabChange(screen) }} tasks={tasks} onTaskToggle={toggleTaskCompletion} focusTime={focusTime} completedSessions={completedSessions} />}
            {activeTab === 'focus' && <FocusScreen onSessionComplete={handleFocusSessionComplete} onTimeUpdate={handleTimeUpdate} />}
            {activeTab === 'tasks' && <TasksScreen tasks={tasks} onTaskToggle={toggleTaskCompletion} onAddTask={addTask} />}
            {activeTab === 'notes' && <NotesScreen notes={notes} />}
            {activeTab === 'insights' && <InsightsScreen insights={mockInsights} />}
            {activeTab === 'analytics' && <AnalyticsScreen navigation={{ navigate: (screen: string) => handleNavigation(screen) }} />}
          </>
        )}
        
          {currentScreen === 'Settings' && (
            <SettingsScreen navigation={{ goBack: () => setCurrentScreen('main') }} />
          )}
          
          {currentScreen === 'ProjectSettings' && (
            <ProjectSettingsScreen navigation={{ goBack: () => setCurrentScreen('main') }} />
          )}

          {currentScreen === 'PersonalInformation' && (
            <PersonalInformationScreen navigation={{ goBack: () => setCurrentScreen('main') }} />
          )}

          {currentScreen === 'Notifications' && (
            <NotificationsScreen navigation={{ goBack: () => setCurrentScreen('main') }} />
          )}

          {currentScreen === 'Subscription' && (
            <SubscriptionScreen navigation={{ goBack: () => setCurrentScreen('main') }} />
          )}

          {currentScreen === 'Security' && (
            <SecurityScreen navigation={{ goBack: () => setCurrentScreen('main') }} />
          )}

          {currentScreen === 'ManageProjects' && (
            <ManageProjectsScreen navigation={{ goBack: () => setCurrentScreen('main') }} />
          )}

          {currentScreen === 'TeamMembers' && (
            <TeamMembersScreen navigation={{ goBack: () => setCurrentScreen('main') }} />
          )}

          {currentScreen === 'ProjectAnalytics' && (
            <ProjectAnalyticsScreen navigation={{ goBack: () => setCurrentScreen('main') }} />
          )}

          {currentScreen === 'ProjectFiles' && (
            <ProjectFilesScreen navigation={{ goBack: () => setCurrentScreen('main') }} />
          )}
      </View>

      {/* Tab Bar */}
      {currentScreen === 'main' && (
        <PremiumTabBar
          tabs={[
            { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
            { id: 'focus', label: 'Focus', icon: 'timer-outline', activeIcon: 'timer' },
            { id: 'tasks', label: 'Tasks', icon: 'checkmark-circle-outline', activeIcon: 'checkmark-circle' },
            { id: 'notes', label: 'Notes', icon: 'document-text-outline', activeIcon: 'document-text' },
            { id: 'analytics', label: 'Analytics', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
          ]}
          activeTab={activeTab}
          onTabPress={handleTabChange}
          variant="glass"
          centerButton={{
            icon: 'sparkles',
            onPress: () => {
              setShowAIChat(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            },
            gradient: true,
          }}
        />
      )}

      {/* AI Chat Interface */}
      <AIChatInterface
        visible={showAIChat}
        onClose={() => setShowAIChat(false)}
      />
    </LinearGradient>
  );
}

const OnboardingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const pages = [
    {
      title: 'Welcome to BGFocus',
      subtitle: 'AI-Powered Productivity Assistant',
      description: 'Transform your productivity with intelligent task management, smart focus sessions, and personalized insights.',
      icon: 'rocket-outline',
      color: '#00D4FF',
    },
    {
      title: 'Smart Focus Timer',
      subtitle: 'Pomodoro Technique Enhanced',
      description: 'Stay focused with AI-optimized work sessions, intelligent break reminders, and productivity analytics.',
      icon: 'timer-outline',
      color: '#FFD700',
    },
    {
      title: 'AI Insights & Analytics',
      subtitle: 'Your Productivity Dashboard',
      description: 'Get personalized insights, track your progress, and receive AI-powered recommendations to boost efficiency.',
      icon: 'analytics-outline',
      color: '#40E0D0',
    },
  ];

  const currentData = pages[currentPage];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      Animated.spring(translateX, {
        toValue: -nextPage * width,
        useNativeDriver: true,
        tension: 100,
        friction: 20,
      }).start();
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <LinearGradient colors={[currentData.color, '#1A1A1A']} style={styles.container}>
      <View style={styles.onboardingContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${currentData.color}20` }]}>
            <Ionicons name={currentData.icon as any} size={80} color={currentData.color} />
        </View>
        
        <Text style={styles.title}>{currentData.title}</Text>
        <Text style={styles.subtitle}>{currentData.subtitle}</Text>
        <Text style={styles.description}>{currentData.description}</Text>
      </View>

      <View style={styles.onboardingFooter}>
        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentPage ? currentData.color : '#666666',
                  width: index === currentPage ? 24 : 8,
                }
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <AnimatedButton
            title={currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="large"
            icon={currentPage === pages.length - 1 ? 'checkmark' : 'arrow-forward' as any}
            iconPosition="right"
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const HomeScreen = ({ tasks, onTaskToggle, focusTime, completedSessions }: any) => {
  const todayTasks = tasks.filter((t: any) => !t.completed);
  const completedToday = tasks.filter((t: any) => t.completed).length;

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeContainer}>
        <LinearGradient
          colors={['#6366F1', '#EC4899', '#10B981']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.welcomeGradient}
        >
          <Text style={styles.welcomeText}>Professional Focus Dashboard</Text>
        </LinearGradient>
        <Text style={styles.welcomeSubtext}>Advanced Productivity Analytics</Text>
      </View>
      
      <GlassCard style={styles.statsCard} glow animated>
        <Text style={styles.cardTitle}>Today's Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#00D4FF' }]}>{completedToday}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#FFD700' }]}>{Math.floor(focusTime / 60)}h {focusTime % 60}m</Text>
            <Text style={styles.statLabel}>Focus Time</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#40E0D0' }]}>{completedSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>
      </GlassCard>

      <AnimatedButton
        title="Start Focus Session"
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        variant="glow"
        size="large"
        icon="play-circle"
        iconPosition="left"
        style={styles.primaryAction}
      />

      <GlassCard style={styles.tasksCard} animated delay={200}>
        <View style={styles.tasksHeader}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tasksTitleGradient}
          >
            <Text style={styles.tasksTitle}>Today's Tasks</Text>
          </LinearGradient>
          <View style={styles.tasksCount}>
            <Text style={styles.tasksCountText}>{todayTasks.length}</Text>
          </View>
        </View>
        {todayTasks.slice(0, 3).map((task: any) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskItem}
            onPress={() => onTaskToggle(task.id)}
          >
            <View style={styles.taskLeft}>
              <View style={[styles.priorityDot, { backgroundColor: task.priority === 'high' ? '#FF4444' : task.priority === 'medium' ? '#FFB800' : '#00FF88' }]} />
              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.taskCheckbox}>
              <Ionicons name="ellipse-outline" size={24} color="#666666" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </GlassCard>

      <GlassCard style={styles.insightCard} animated delay={400}>
        <View style={styles.insightHeader}>
          <LinearGradient
            colors={['#00D4FF', '#0099CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.insightIconGradient}
          >
            <Ionicons name="analytics-outline" size={18} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.insightTitleContainer}>
            <Text style={styles.insightTitle}>AI Analytics</Text>
            <Text style={styles.insightSubtitle}>Performance Intelligence</Text>
          </View>
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightText}>
            Your focus sessions show 25% improved productivity compared to last week. 
            Optimal session duration: 25 minutes for peak performance.
          </Text>
          <View style={styles.insightMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>+25%</Text>
              <Text style={styles.metricLabel}>Productivity</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>25min</Text>
              <Text style={styles.metricLabel}>Optimal</Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </ScrollView>
  );
};

const FocusScreen = ({ onSessionComplete, onTimeUpdate }: any) => {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <FocusTimer onSessionComplete={onSessionComplete} onTimeUpdate={onTimeUpdate} />
    </ScrollView>
  );
};

const TasksScreen = ({ tasks, onTaskToggle, onAddTask }: any) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTasks = tasks.filter((task: any) => {
    switch (activeFilter) {
      case 'completed': return task.completed;
      case 'pending': return !task.completed;
      default: return true;
    }
  });

  const addTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <GlassCard style={styles.addTaskCard} animated>
        <TextInput
          style={styles.taskInput}
          placeholder="Add new task..."
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <AnimatedButton
          title="Add"
          onPress={addTask}
          variant="primary"
          icon="add"
          disabled={!newTaskTitle.trim()}
        />
      </GlassCard>

      <View style={styles.filterContainer}>
        {['all', 'pending', 'completed'].map((filter) => (
          <AnimatedButton
            key={filter}
            title={filter.charAt(0).toUpperCase() + filter.slice(1)}
            onPress={() => setActiveFilter(filter)}
            variant={activeFilter === filter ? 'primary' : 'ghost'}
            size="small"
          />
        ))}
      </View>

      {filteredTasks.map((task: any) => (
        <GlassCard key={task.id} style={styles.taskCard} animated delay={100}>
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => onTaskToggle(task.id)}
          >
            <View style={styles.taskLeft}>
              <View style={[styles.priorityDot, { backgroundColor: task.priority === 'high' ? '#FF4444' : task.priority === 'medium' ? '#FFB800' : '#00FF88' }]} />
              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, task.completed && styles.completedTask]}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
                {task.aiSuggested && (
                  <View style={styles.aiBadge}>
                    <Ionicons name="sparkles" size={12} color="#00D4FF" />
                    <Text style={styles.aiBadgeText}>AI Suggested</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.taskCheckbox}>
              <Ionicons 
                name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={task.completed ? "#00FF88" : "#666666"} 
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </GlassCard>
      ))}
    </ScrollView>
  );
};

const NotesScreen = ({ notes }: any) => {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {notes.map((note: any, index: number) => (
        <GlassCard key={note.id} style={styles.noteCard} animated delay={index * 100}>
          <View style={styles.noteHeader}>
            <View style={styles.noteTitleContainer}>
              <Ionicons 
                name={note.type === 'voice' ? 'mic' : 'document-text'} 
                size={20} 
                color="#00D4FF" 
              />
              <Text style={styles.noteTitle}>{note.title}</Text>
            </View>
            {note.isOrganized && (
              <View style={styles.organizedBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#00FF88" />
                <Text style={styles.organizedText}>AI</Text>
              </View>
            )}
          </View>
          <Text style={styles.noteContent}>{note.content}</Text>
          <View style={styles.noteMeta}>
            <Text style={styles.noteCategory}>{note.category}</Text>
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  );
};

const InsightsScreen = ({ insights }: any) => {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <GlassCard style={styles.scoreCard} glow animated>
        <Text style={styles.scoreTitle}>Productivity Score</Text>
        <Text style={styles.scoreValue}>92/100</Text>
        <Text style={styles.scoreDescription}>Excellent work this week!</Text>
      </GlassCard>

      {insights.map((insight: any, index: number) => (
        <GlassCard key={index} style={styles.insightCard} animated delay={index * 100}>
          <View style={styles.insightHeader}>
            <Ionicons name="bulb-outline" size={20} color="#00D4FF" />
            <Text style={styles.insightTitle}>{insight.title}</Text>
          </View>
          <Text style={styles.insightText}>{insight.description}</Text>
          {insight.actionable && (
            <AnimatedButton
              title="Apply Suggestion"
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              variant="primary"
              size="small"
              icon="arrow-forward"
              iconPosition="right"
            />
          )}
        </GlassCard>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'transparent',
  },
  headerGradient: {
    borderRadius: 20,
    padding: SPACING.md,
    marginHorizontal: SPACING.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoInner: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'System',
    textAlign: 'left',
    lineHeight: 28,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A1A1AA',
    letterSpacing: 0.5,
    marginTop: 2,
    opacity: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  userInitials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  userRole: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '400',
    opacity: 0.8,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.sm,
  },
  actionButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  focusTarget: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetOuter: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetMiddle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetCenter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  focusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  brainWaves: {
    position: 'absolute',
    top: -8,
    right: -8,
    flexDirection: 'column',
    gap: 1,
  },
  wave: {
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    paddingVertical: 10,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTabButton: {
    // Active tab styling
  },
  tabLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#00D4FF',
    fontWeight: '600',
  },
  aiButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Onboarding styles
  onboardingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#B0B0B0',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  onboardingFooter: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  skipText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  // Screen styles
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  welcomeGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    fontFamily: 'System',
  },
  welcomeSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  statsCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tasksTitleGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  tasksCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tasksCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  primaryAction: {
    marginBottom: 20,
  },
  tasksCard: {
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    marginRight: 15,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskDescription: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  taskCheckbox: {
    padding: 8,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  aiBadgeText: {
    fontSize: 10,
    color: '#00D4FF',
    marginLeft: 4,
    fontWeight: '600',
  },
  insightCard: {
    marginBottom: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  insightTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  insightSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  insightContent: {
    marginTop: 4,
  },
  insightText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '400',
  },
  insightMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00D4FF',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Task screen styles
  addTaskCard: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  taskCard: {
    marginBottom: 15,
  },
  // Notes screen styles
  noteCard: {
    marginBottom: 15,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noteTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
  },
  organizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  organizedText: {
    fontSize: 10,
    color: '#00FF88',
    marginLeft: 4,
    fontWeight: '600',
  },
  noteContent: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginBottom: 10,
  },
  noteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteCategory: {
    fontSize: 12,
    color: '#666666',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  // Insights screen styles
  scoreCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00D4FF',
    marginBottom: 10,
  },
  scoreDescription: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
  },
});