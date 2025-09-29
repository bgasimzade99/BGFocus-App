import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, Dimensions, Image, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated, PanResponder } from 'react-native';
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
import { SPACING } from './src/constants/spacing';

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
  // Core App State
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('main');
  
  // Data State
  const [tasks, setTasks] = useState(mockTasks);
  const [notes, setNotes] = useState(mockNotes);
  
  // UI State
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Productivity State
  const [focusTime, setFocusTime] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(480); // 8 hours in minutes
  const [streak, setStreak] = useState(7);
  const [productivityScore, setProductivityScore] = useState(85);
  
  // Professional Features
  const [isPremium, setIsPremium] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  
  // Professional Animation System
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Professional Gesture Handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (hapticEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      },
    })
  ).current;

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setIsLoading(true);
    try {
      await checkOnboardingStatus();
      await loadUserPreferences();
      await loadProductivityData();
      startProfessionalAnimations();
    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedSound = await AsyncStorage.getItem('soundEnabled');
      const savedHaptic = await AsyncStorage.getItem('hapticEnabled');
      
      if (savedTheme) setTheme(savedTheme);
      if (savedSound !== null) setSoundEnabled(JSON.parse(savedSound));
      if (savedHaptic !== null) setHapticEnabled(JSON.parse(savedHaptic));
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadProductivityData = async () => {
    try {
      const savedFocusTime = await AsyncStorage.getItem('focusTime');
      const savedSessions = await AsyncStorage.getItem('completedSessions');
      const savedStreak = await AsyncStorage.getItem('streak');
      const savedScore = await AsyncStorage.getItem('productivityScore');
      
      if (savedFocusTime) setFocusTime(parseInt(savedFocusTime));
      if (savedSessions) setCompletedSessions(parseInt(savedSessions));
      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedScore) setProductivityScore(parseInt(savedScore));
    } catch (error) {
      console.error('Error loading productivity data:', error);
    }
  };

  const startProfessionalAnimations = () => {
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

  // Professional Utility Functions
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (hapticEnabled) {
      const hapticType = type === 'light' ? Haptics.ImpactFeedbackStyle.Light :
                        type === 'medium' ? Haptics.ImpactFeedbackStyle.Medium :
                        Haptics.ImpactFeedbackStyle.Heavy;
      Haptics.impactAsync(hapticType);
    }
  };

  const saveProductivityData = async () => {
    try {
      await AsyncStorage.setItem('focusTime', focusTime.toString());
      await AsyncStorage.setItem('completedSessions', completedSessions.toString());
      await AsyncStorage.setItem('streak', streak.toString());
      await AsyncStorage.setItem('productivityScore', productivityScore.toString());
    } catch (error) {
      console.error('Error saving productivity data:', error);
    }
  };

  const calculateProductivityScore = () => {
    const goalProgress = Math.min((focusTime / dailyGoal) * 100, 100);
    const sessionBonus = Math.min(completedSessions * 5, 25);
    const streakBonus = Math.min(streak * 2, 20);
    return Math.min(Math.round(goalProgress + sessionBonus + streakBonus), 100);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
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

  const addTask = (title: string, priority: 'low' | 'medium' | 'high' = 'medium', category: string = 'Personal') => {
    triggerHaptic('medium');
    const newTask = {
      id: Date.now().toString(),
      title,
      description: 'AI-suggested task',
      completed: false,
      priority,
      category,
      aiSuggested: true,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    
    // Update productivity score
    setProductivityScore(prev => Math.min(prev + 1, 100));
    saveProductivityData();
  };

  const deleteTask = (taskId: string) => {
    triggerHaptic('medium');
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    saveProductivityData();
  };

  const handleFocusSessionComplete = (type: 'work' | 'break') => {
    triggerHaptic('heavy');
    if (type === 'work') {
      setCompletedSessions(prev => prev + 1);
      setFocusTime(prev => prev + 25);
      setProductivityScore(prev => Math.min(prev + 5, 100));
      setStreak(prev => prev + 1);
    }
    saveProductivityData();
  };

  const handleTimeUpdate = (timeLeft: number, totalTime: number) => {
    // Update focus time tracking
  };

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <LinearGradient colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)']}
          style={styles.headerBackground}
        >
          <View style={styles.headerContent}>
            {/* Left Section - Logo & Brand */}
            <View style={styles.headerLeft}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899', '#F59E0B']}
                style={styles.logoContainer}
              >
                <Animated.View 
                  style={[
                    styles.logoIcon,
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
                  <View style={styles.focusTarget}>
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
                  </View>
                </Animated.View>
              </LinearGradient>
              <View style={styles.brandContainer}>
                <Text style={styles.brandName}>BGFOCUS</Text>
                <View style={styles.brandUnderline} />
                <Text style={styles.brandTagline}>Professional Focus Management</Text>
              </View>
            </View>

            {/* Right Section - Settings */}
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => handleNavigation('Settings')}
            >
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {currentScreen === 'main' && (
          <>
            {activeTab === 'home' && <HomeScreen navigation={{ navigate: (screen: string) => handleTabChange(screen) }} tasks={tasks} onTaskToggle={toggleTaskCompletion} focusTime={focusTime} completedSessions={completedSessions} onTabChange={handleTabChange} onAddTask={addTask} onDeleteTask={deleteTask} />}
            {activeTab === 'focus' && <FocusScreen onSessionComplete={handleFocusSessionComplete} onTimeUpdate={handleTimeUpdate} />}
            {activeTab === 'tasks' && <TasksScreen tasks={tasks} onTaskToggle={toggleTaskCompletion} onAddTask={addTask} onDeleteTask={deleteTask} />}
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
    </View>
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

const HomeScreen = ({ tasks, onTaskToggle, focusTime, completedSessions, onTabChange, onAddTask, onDeleteTask }: any) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const todayTasks = tasks.filter((t: any) => !t.completed);
  const completedToday = tasks.filter((t: any) => t.completed).length;

  const addTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

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
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onTabChange('focus');
        }}
        variant="glow"
        size="large"
        icon="play-circle"
        iconPosition="left"
        style={styles.primaryAction}
      />

      {/* Add Task Section */}
      <GlassCard style={styles.addTaskCard} animated delay={150}>
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
          <View key={task.id} style={styles.taskItem}>
            <TouchableOpacity
              style={styles.taskMainContent}
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
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => onDeleteTask(task.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4444" />
            </TouchableOpacity>
          </View>
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

const TasksScreen = ({ tasks, onTaskToggle, onAddTask, onDeleteTask }: any) => {
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
          <View style={styles.taskItem}>
            <TouchableOpacity
              style={styles.taskMainContent}
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
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => onDeleteTask(task.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4444" />
            </TouchableOpacity>
          </View>
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
  appContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  container: {
    flex: 1,
  },
  // Enhanced Header Styles
  header: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'transparent',
  },
  headerBackground: {
    borderRadius: 20,
    padding: SPACING.lg,
    marginHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    flex: 1,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    fontFamily: 'System',
    lineHeight: 28,
  },
  brandUnderline: {
    width: 50,
    height: 2,
    backgroundColor: '#8B5CF6',
    borderRadius: 1,
    marginTop: 2,
  },
  brandTagline: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 'auto',
  },
  focusTarget: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetMiddle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  focusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
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
  taskMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.2)',
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