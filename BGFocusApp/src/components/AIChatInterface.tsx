import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Animated, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { aiService, createProductivitySystemMessage, createUserMessage, createAssistantMessage, AIMessage } from '../services/aiService';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image' | 'system';
  status?: 'sending' | 'sent' | 'delivered' | 'error';
  reactions?: string[];
  isTyping?: boolean;
  avatar?: string;
}

interface AIChatInterfaceProps {
  visible: boolean;
  onClose: () => void;
}

export const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: aiService.isConfigured() 
        ? "Hello! I'm BGFocus AI powered by ChatGLM. I'm here to help you with productivity and focus. How can I assist you today?"
        : "⚠️ AI service not configured. Please add your API key to use this feature.",
      isUser: false,
      timestamp: new Date(),
      type: 'system',
      status: 'delivered',
      avatar: '🤖',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConfigured, setIsConfigured] = useState(aiService.isConfigured());
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [messageAnimations, setMessageAnimations] = useState<{[key: string]: Animated.Value}>({});
  
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Advanced animations and effects
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: height,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Typing animation
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isTyping]);

  // Check API configuration on mount
  useEffect(() => {
    const configured = aiService.isConfigured();
    setIsConfigured(configured);
    
    if (!configured) {
      Alert.alert(
        'API Key Required',
        'To use the AI chat feature, please configure your API key in the environment variables.\n\nAdd EXPO_PUBLIC_CHATGLM_API_KEY to your .env file.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  const startListening = () => {
    setIsListening(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopListening = () => {
    setIsListening(false);
    pulseAnim.stopAnimation();
    Animated.spring(pulseAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !isConfigured) {
      if (!isConfigured) {
        Alert.alert(
          'Configuration Required',
          'Please configure your API key to use the AI chat feature.',
          [{ text: 'OK' }]
        );
      }
      return;
    }

    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
      status: 'sending',
      avatar: '👤',
    };

    // Add animation for new message
    const messageAnim = new Animated.Value(0);
    setMessageAnimations(prev => ({ ...prev, [messageId]: messageAnim }));
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Animate message appearance
    Animated.spring(messageAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    try {
      // Prepare messages for AI service
      const aiMessages: AIMessage[] = [
        createProductivitySystemMessage(),
        ...messages.slice(1).map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        createUserMessage(inputText.trim())
      ];

      // Call AI service
      const response = await aiService.sendMessage(aiMessages);
      
      const aiMessageId = (Date.now() + 1).toString();
      const aiResponse: Message = {
        id: aiMessageId,
        text: response.content,
        isUser: false,
        timestamp: new Date(),
        status: 'delivered',
        avatar: '🤖',
      };

      // Add animation for AI response
      const aiMessageAnim = new Animated.Value(0);
      setMessageAnimations(prev => ({ ...prev, [aiMessageId]: aiMessageAnim }));
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Animate AI message appearance
      setTimeout(() => {
        Animated.spring(aiMessageAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }, 500);

      // Update user message status
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'delivered' } : msg
      ));
    } catch (error) {
      console.error('AI Service Error:', error);
      const errorMessageId = (Date.now() + 1).toString();
      const errorMessage: Message = {
        id: errorMessageId,
        text: "Sorry, I encountered an error while processing your request. Please try again or check your API configuration.",
        isUser: false,
        timestamp: new Date(),
        status: 'error',
        avatar: '⚠️',
      };
      
      // Add animation for error message
      const errorMessageAnim = new Animated.Value(0);
      setMessageAnimations(prev => ({ ...prev, [errorMessageId]: errorMessageAnim }));
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Animate error message appearance
      setTimeout(() => {
        Animated.spring(errorMessageAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }, 300);
      
      // Update user message status to error
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'error' } : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { text: 'Help me focus', icon: '🎯', color: '#4CAF50' },
    { text: 'Create a task', icon: '✅', color: '#2196F3' },
    { text: 'Time management', icon: '⏰', color: '#FF9800' },
    { text: 'Productivity tips', icon: '💡', color: '#9C27B0' },
    { text: 'Motivation boost', icon: '🚀', color: '#E91E63' },
    { text: 'Goal setting', icon: '🎯', color: '#00BCD4' },
  ];

  const handleQuickAction = (action: any) => {
    setInputText(action.text);
    setShowQuickActions(false);
  };

  const addReaction = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
        : msg
    ));
  };

  const copyMessage = (text: string) => {
    // In a real app, you'd use Clipboard from expo-clipboard
    Alert.alert('Copied', 'Message copied to clipboard');
  };

  const renderMessage = (message: Message) => {
    const messageAnim = messageAnimations[message.id] || new Animated.Value(1);
    
    return (
      <Animated.View
        key={message.id}
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessage : styles.aiMessage,
          {
            transform: [{ scale: messageAnim }],
            opacity: messageAnim,
          }
        ]}
      >
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageAvatar}>{message.avatar}</Text>
            <View style={styles.messageInfo}>
              <Text style={styles.messageSender}>
                {message.isUser ? 'You' : 'BGFocus AI'}
              </Text>
              <Text style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            {message.status && (
              <View style={styles.messageStatus}>
                <Ionicons 
                  name={
                    message.status === 'sending' ? 'time-outline' :
                    message.status === 'delivered' ? 'checkmark-circle' :
                    message.status === 'error' ? 'alert-circle' : 'checkmark'
                  } 
                  size={16} 
                  color={
                    message.status === 'sending' ? '#FFA726' :
                    message.status === 'delivered' ? '#4CAF50' :
                    message.status === 'error' ? '#F44336' : '#4CAF50'
                  } 
                />
              </View>
            )}
          </View>
          
          <Text style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
            message.status === 'error' && styles.errorMessageText
          ]}>
            {message.text}
          </Text>
          
          {message.reactions && message.reactions.length > 0 && (
            <View style={styles.reactionsContainer}>
              {message.reactions.map((reaction, index) => (
                <TouchableOpacity key={index} style={styles.reactionButton}>
                  <Text style={styles.reactionText}>{reaction}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {!message.isUser && (
            <View style={styles.messageActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => addReaction(message.id, '👍')}
              >
                <Ionicons name="thumbs-up-outline" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => addReaction(message.id, '👎')}
              >
                <Ionicons name="thumbs-down-outline" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => copyMessage(message.text)}
              >
                <Ionicons name="copy-outline" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.8)" />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
          style={styles.gradientBackground}
        >
          {/* Minimal Status Bar */}
          <View style={styles.statusBar}>
            <View style={styles.statusLeft}>
              <View style={[styles.statusDot, { backgroundColor: isConfigured ? '#4CAF50' : '#FF4444' }]} />
              <Text style={styles.statusText}>
                {isConfigured ? 'ChatGLM Connected' : 'Not Configured'}
              </Text>
              {!isConfigured && (
                <TouchableOpacity 
                  style={styles.configButton}
                  onPress={() => Alert.alert(
                    'API Configuration',
                    'To use AI features, add your API key to environment variables:\n\nEXPO_PUBLIC_CHATGLM_API_KEY=your_key_here\n\nSupported services: ChatGLM, OpenAI, Anthropic, Local AI',
                    [{ text: 'OK' }]
                  )}
                >
                  <Ionicons name="settings-outline" size={16} color="#FF6B6B" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          {showQuickActions && (
            <View style={styles.quickActionsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.quickActionsGrid}>
                  {quickActions.map((action, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.quickActionButton, { backgroundColor: action.color }]}
                      onPress={() => handleQuickAction(action)}
                    >
                      <Text style={styles.quickActionIcon}>{action.icon}</Text>
                      <Text style={styles.quickActionText}>{action.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Messages Area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
            
            {/* Typing Indicator */}
            {isTyping && (
              <Animated.View 
                style={[
                  styles.typingIndicator,
                  {
                    opacity: typingAnim,
                    transform: [{ scale: typingAnim }],
                  }
                ]}
              >
                <Text style={styles.typingAvatar}>🤖</Text>
                <View style={styles.typingDots}>
                  <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                  <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                  <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                </View>
                <Text style={styles.typingText}>AI is thinking...</Text>
              </Animated.View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TouchableOpacity 
                style={styles.quickActionsToggle}
                onPress={() => setShowQuickActions(!showQuickActions)}
              >
                <Ionicons name="apps" size={24} color={colors.text} />
              </TouchableOpacity>
              
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ask BGFocus AI anything..."
                  placeholderTextColor="#999999"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                />
                <View style={styles.inputActions}>
                  <Text style={styles.characterCount}>{inputText.length}/500</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: inputText.trim() ? '#4CAF50' : '#666' }
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || !isConfigured}
              >
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.md,
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: SPACING.xs,
  },
  closeButton: {
    padding: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  configButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  quickActionsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickActionButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  messagesContent: {
    paddingVertical: SPACING.md,
  },
  messageContainer: {
    marginBottom: SPACING.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageContent: {
    maxWidth: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  messageAvatar: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  messageInfo: {
    flex: 1,
  },
  messageSender: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#1A1A1A',
  },
  messageTime: {
    fontSize: FONT_SIZES.xs,
    color: '#666666',
  },
  messageStatus: {
    marginLeft: SPACING.sm,
  },
  messageText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#1A1A1A',
  },
  aiMessageText: {
    color: '#1A1A1A',
  },
  errorMessageText: {
    color: '#D32F2F',
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  reactionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  reactionText: {
    fontSize: FONT_SIZES.sm,
  },
  messageActions: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  typingAvatar: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  typingDots: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  typingText: {
    color: '#1A1A1A',
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  inputContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  quickActionsToggle: {
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    maxHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  textInput: {
    color: '#1A1A1A',
    fontSize: FONT_SIZES.md,
    minHeight: 20,
    maxHeight: 60,
  },
  inputActions: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  characterCount: {
    fontSize: FONT_SIZES.xs,
    color: '#666666',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});