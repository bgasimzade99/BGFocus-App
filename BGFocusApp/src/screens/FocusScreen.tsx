import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface FocusScreenProps {
  navigation: any;
}

type SessionType = 'work' | 'break' | 'long_break';

const sessionTypes = {
  work: { duration: 25, color: '#00D4FF', icon: 'library' },
  break: { duration: 5, color: '#00FF88', icon: 'cafe' },
  long_break: { duration: 15, color: '#FFD700', icon: 'walk' },
};

export const FocusScreen: React.FC<FocusScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [currentSession, setCurrentSession] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(sessionTypes.work.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const progress = (sessionTypes[currentSession].duration * 60 - timeLeft) / (sessionTypes[currentSession].duration * 60);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, currentSession]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    setCompletedSessions(prev => prev + 1);
    
    // Animate completion
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance to next session type
    setTimeout(() => {
      if (currentSession === 'work') {
        setCurrentSession(completedSessions % 3 === 2 ? 'long_break' : 'break');
      } else {
        setCurrentSession('work');
      }
      setTimeLeft(sessionTypes[currentSession].duration * 60);
      progressAnim.setValue(0);
    }, 2000);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionTypes[currentSession].duration * 60);
    progressAnim.setValue(0);
  };

  const switchSession = (sessionType: SessionType) => {
    if (!isRunning) {
      setCurrentSession(sessionType);
      setTimeLeft(sessionTypes[sessionType].duration * 60);
      progressAnim.setValue(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionIcon = (sessionType: SessionType) => {
    const icons = {
      work: 'library',
      break: 'cafe',
      long_break: 'walk',
    };
    return icons[sessionType] as keyof typeof Ionicons.glyphMap;
  };

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Focus Timer</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Session Type Selector */}
      <View style={styles.sessionSelector}>
        {Object.keys(sessionTypes).map((sessionType) => (
          <TouchableOpacity
            key={sessionType}
            style={[
              styles.sessionButton,
              { backgroundColor: colors.glass },
              currentSession === sessionType && { backgroundColor: `${sessionTypes[sessionType as SessionType].color}20` },
            ]}
            onPress={() => switchSession(sessionType as SessionType)}
            disabled={isRunning}
          >
            <Ionicons 
              name={getSessionIcon(sessionType as SessionType)} 
              size={20} 
              color={currentSession === sessionType ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
              styles.sessionButtonText,
              { color: currentSession === sessionType ? colors.primary : colors.textSecondary },
              currentSession === sessionType && { fontWeight: FONT_WEIGHTS.semiBold },
            ]}>
              {sessionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
            <Text style={[
              styles.sessionDuration,
              { color: currentSession === sessionType ? colors.primary : colors.textSecondary },
            ]}>
              {sessionTypes[sessionType as SessionType].duration}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        <Animated.View style={[styles.timerCircle, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={GRADIENTS.primary as readonly [string, string]}
            style={styles.timerGradient}
          >
            <View style={styles.timerInner}>
              <Text style={[styles.timeText, { color: colors.text }]}>{formatTime(timeLeft)}</Text>
              <Text style={[styles.sessionText, { color: colors.textSecondary }]}>
                {currentSession.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Session
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <AnimatedButton
          title="Reset"
          onPress={resetTimer}
          variant="ghost"
          icon="refresh"
          disabled={isRunning}
        />

        <AnimatedButton
          title={isRunning ? "Pause" : "Start"}
          onPress={toggleTimer}
          variant="primary"
          size="large"
          icon={isRunning ? "pause" : "play"}
          iconPosition="left"
        />

        <AnimatedButton
          title="Tasks"
          onPress={() => navigation.navigate('Tasks')}
          variant="ghost"
          icon="list"
        />
      </View>

      {/* Stats */}
      <GlassCard style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{completedSessions}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sessions Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.secondary }]}>
              {Math.floor((completedSessions * 25) / 60)}h {(completedSessions * 25) % 60}m
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Focus Time</Text>
          </View>
        </View>
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
  settingsButton: {
    padding: SPACING.sm,
  },
  sessionSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  sessionButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 80,
  },
  sessionButtonText: {
    fontSize: FONT_SIZES.xs,
    marginTop: 4,
    textAlign: 'center',
  },
  sessionDuration: {
    fontSize: 10,
    marginTop: 2,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xl,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
  },
  timerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
  },
  sessionText: {
    fontSize: FONT_SIZES.md,
    marginTop: 8,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginVertical: SPACING.xl,
  },
  statsCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
  },
});