import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image';
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
      text: "Good to see you, Ren! What can I help you with today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
    pulseAnim.setValue(1);
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsTyping(true);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I understand your request. Let me help you with that. Here's what I can suggest based on your productivity patterns...",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const quickActions = [
    { icon: 'image-outline', title: 'Image Generator' },
    { icon: 'mic-outline', title: 'Voice Recognition' },
    { icon: 'document-text-outline', title: 'Document Interaction' },
    { icon: 'language-outline', title: 'Multilingual Support' },
  ];

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isListening ? "I'm listening" : "Talking to AI Bot"}
          </Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* AI Sphere */}
        <View style={styles.aiSphereContainer}>
          <Animated.View 
            style={[
              styles.aiSphere,
              {
                transform: [{ scale: pulseAnim }],
                opacity: isListening ? 0.8 : 1,
              }
            ]}
          >
            <LinearGradient
              colors={['#00D4FF', '#4CAF50', '#F48FB1']}
              style={styles.sphereGradient}
            />
          </Animated.View>
        </View>

        {/* Quick Actions Grid */}
        {messages.length === 1 && (
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <GlassCard key={index} style={styles.quickActionCard}>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Ionicons name={action.icon as any} size={24} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>{action.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </GlassCard>
            ))}
          </View>
        )}

        {/* Chat Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View key={message.id} style={styles.messageContainer}>
              <View style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.aiMessage,
                { backgroundColor: message.isUser ? colors.primary : 'rgba(255, 255, 255, 0.1)' }
              ]}>
                <Text style={[
                  styles.messageText,
                  { color: message.isUser ? '#FFFFFF' : colors.text }
                ]}>
                  {message.text}
                </Text>
                <Text style={[
                  styles.messageTime,
                  { color: message.isUser ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary }
                ]}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ))}
          
          {isTyping && (
            <View style={styles.typingIndicator}>
              <View style={styles.typingDots}>
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachmentButton}>
            <Ionicons name="attach" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={[styles.inputWrapper, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Ask me anything..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.micButton,
              { backgroundColor: isListening ? colors.error : colors.primary }
            ]}
            onPress={isListening ? stopListening : startListening}
          >
            <Ionicons 
              name={isListening ? "stop" : "mic"} 
              size={24} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>

        {/* Start New Chat Button */}
        {messages.length === 1 && (
          <TouchableOpacity style={styles.startChatButton}>
            <LinearGradient
              colors={GRADIENTS.primary}
              style={styles.startChatGradient}
            >
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              <Text style={styles.startChatText}>Start a New Chat</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  menuButton: {
    padding: SPACING.sm,
  },
  aiSphereContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  aiSphere: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  sphereGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  quickActionCard: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  quickActionText: {
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  messageContainer: {
    marginBottom: SPACING.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'right',
  },
  typingIndicator: {
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  typingDots: {
    flexDirection: 'row',
    padding: SPACING.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  attachmentButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    maxHeight: 100,
  },
  textInput: {
    fontSize: FONT_SIZES.md,
    minHeight: 20,
  },
  micButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startChatButton: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  startChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 25,
  },
  startChatText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginLeft: SPACING.sm,
  },
});
