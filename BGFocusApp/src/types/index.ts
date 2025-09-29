export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  aiSuggested?: boolean;
  estimatedDuration?: number; // in minutes
  tags?: string[];
}

export interface FocusSession {
  id: string;
  duration: number; // in minutes
  type: 'work' | 'break' | 'long_break';
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
  taskId?: string;
  productivity: number; // 1-10 scale
}

export interface ProductivityStats {
  tasksCompleted: number;
  tasksCompletedToday: number;
  focusTimeToday: number; // in minutes
  focusTimeWeek: number; // in minutes
  streak: number;
  weeklyGoal: number;
  achievements: string[];
  productivityScore: number; // 0-100
  averageSessionLength: number;
  bestStreak: number;
}

export interface AIChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'suggestion' | 'insight' | 'motivation' | 'question';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'voice' | 'image';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isOrganized: boolean;
  category?: string;
}

export interface DailyPlan {
  id: string;
  date: Date;
  tasks: Task[];
  focusSessions: FocusSession[];
  breaks: FocusSession[];
  goals: string[];
  aiInsights: string[];
  completed: boolean;
}

export interface MotivationBoost {
  id: string;
  type: 'quote' | 'reminder' | 'achievement' | 'tip';
  content: string;
  timestamp: Date;
  isRead: boolean;
  category: string;
}

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  focusDuration: number; // default 25 minutes
  shortBreakDuration: number; // default 5 minutes
  longBreakDuration: number; // default 15 minutes
  notifications: boolean;
  hapticFeedback: boolean;
  dailyGoal: number; // minutes
  weeklyGoal: number; // minutes
  categories: string[];
  customCategories: string[];
}

export interface AIInsight {
  id: string;
  type: 'productivity' | 'focus' | 'task' | 'schedule' | 'wellness';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  data?: any;
}