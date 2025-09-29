import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AnimatedButton } from './AnimatedButton';

const { width } = Dimensions.get('window');

interface FocusTimerProps {
  onSessionComplete: (type: 'work' | 'break') => void;
  onTimeUpdate: (timeLeft: number, totalTime: number) => void;
}

type SessionType = 'work' | 'shortBreak' | 'longBreak';

const sessionConfig = {
  work: { duration: 25, color: '#00D4FF', icon: 'library', label: 'Focus Time' },
  shortBreak: { duration: 5, color: '#00FF88', icon: 'cafe', label: 'Short Break' },
  longBreak: { duration: 15, color: '#FFD700', icon: 'walk', label: 'Long Break' },
};

export const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete, onTimeUpdate }) => {
  const [currentSession, setCurrentSession] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(sessionConfig.work.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          const totalTime = sessionConfig[currentSession].duration * 60;
          const progressValue = (totalTime - newTime) / totalTime;
          
          Animated.timing(progressAnim, {
            toValue: progressValue,
            duration: 1000,
            useNativeDriver: false,
          }).start();
          
          onTimeUpdate(newTime, totalTime);
          
          if (newTime <= 0) {
            handleSessionComplete();
            return 0;
          }
          return newTime;
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
  }, [isRunning, timeLeft, currentSession]);

  // Pulse animation when running
  useEffect(() => {
    if (isRunning) {
      const pulseAnimation = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]).start();
      };

      pulseIntervalRef.current = setInterval(pulseAnimation, 4000);
      pulseAnimation();
    } else {
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current);
      }
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current);
      }
    };
  }, [isRunning]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    setCompletedSessions(prev => prev + 1);
    
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Completion animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 15,
      }),
    ]).start();

    // Auto-advance to next session
    setTimeout(() => {
      if (currentSession === 'work') {
        const nextSession = completedSessions % 3 === 2 ? 'longBreak' : 'shortBreak';
        setCurrentSession(nextSession);
        setTimeLeft(sessionConfig[nextSession].duration * 60);
      } else {
        setCurrentSession('work');
        setTimeLeft(sessionConfig.work.duration * 60);
      }
      progressAnim.setValue(0);
      onSessionComplete(currentSession === 'work' ? 'work' : 'break');
    }, 2000);
  };

  const toggleTimer = () => {
    if (isRunning) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionConfig[currentSession].duration * 60);
    progressAnim.setValue(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const switchSession = (sessionType: SessionType) => {
    if (!isRunning) {
      setCurrentSession(sessionType);
      setTimeLeft(sessionConfig[sessionType].duration * 60);
      progressAnim.setValue(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const config = sessionConfig[currentSession];

  const progressRotation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Enhanced Session Selector */}
      <View style={styles.sessionSelector}>
        {Object.entries(sessionConfig).map(([key, session]) => (
          <View key={key} style={styles.sessionButtonContainer}>
            <TouchableOpacity 
              style={[
                styles.sessionButtonWrapper,
                currentSession === key && styles.sessionButtonActive
              ]}
              onPress={() => switchSession(key as SessionType)}
              disabled={isRunning}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={currentSession === key 
                  ? [session.color, `${session.color}CC`] 
                  : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                }
                style={styles.sessionButtonGradient}
              >
                <View style={styles.sessionButtonContent}>
                  <View style={[
                    styles.sessionIconWrapper,
                    { backgroundColor: currentSession === key ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)' }
                  ]}>
                    <Ionicons 
                      name={session.icon as any} 
                      size={18} 
                      color={currentSession === key ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'} 
                    />
                  </View>
                  <Text style={[
                    styles.sessionButtonText,
                    { color: currentSession === key ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)' }
                  ]}>
                    {session.label}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={[
              styles.sessionDuration,
              { color: currentSession === key ? session.color : 'rgba(255, 255, 255, 0.5)' }
            ]}>
              {session.duration}min
            </Text>
          </View>
        ))}
      </View>

      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        {/* Progress Ring */}
        <View style={styles.progressRing}>
          <View style={[styles.progressTrack, { borderColor: config.color }]} />
          <Animated.View style={[styles.progressFill, { transform: [{ rotate: progressRotation }] }]}>
            <View style={[styles.progressArc, { borderColor: config.color }]} />
          </Animated.View>
        </View>

        {/* Timer Display */}
        <Animated.View style={[
          styles.timerCircle,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
            ],
          }
        ]}>
          <LinearGradient
            colors={[config.color, `${config.color}CC`]}
            style={styles.timerGradient}
          >
            <View style={styles.timerContent}>
              <Text style={[styles.timeText, { color: config.color }]}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={styles.sessionLabel}>{config.label}</Text>
              <View style={styles.sessionIcon}>
                <Ionicons name={config.icon as any} size={32} color="#FFFFFF" />
              </View>
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
          variant="glow"
          size="large"
          icon={isRunning ? "pause" : "play"}
          iconPosition="left"
        />
        
        <AnimatedButton
          title="Skip"
          onPress={() => handleSessionComplete()}
          variant="ghost"
          icon="play-forward"
        />
      </View>

      {/* Enhanced Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.statCardGradient}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={24} color={config.color} />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: config.color }]}>
                {completedSessions}
              </Text>
              <Text style={styles.statLabel}>Completed Sessions</Text>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.statCard}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.statCardGradient}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color={config.color} />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: config.color }]}>
                {Math.floor((completedSessions * 25) / 60)}h {(completedSessions * 25) % 60}m
              </Text>
              <Text style={styles.statLabel}>Total Focus Time</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  sessionSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 20,
    gap: 12,
  },
  sessionButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  sessionButtonWrapper: {
    width: '100%',
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sessionButtonActive: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sessionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  sessionButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sessionDuration: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  progressRing: {
    width: 280,
    height: 280,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    opacity: 0.3,
  },
  progressFill: {
    position: 'absolute',
    width: 280,
    height: 280,
  },
  progressArc: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    position: 'absolute',
    overflow: 'hidden',
  },
  timerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 52,
    fontWeight: '300',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 2,
    fontFamily: 'System',
  },
  sessionLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sessionIcon: {
    marginTop: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
    gap: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});