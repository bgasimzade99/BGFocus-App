import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Modal, Dimensions, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AnimatedButton } from './AnimatedButton';

const { height } = Dimensions.get('window');

interface AIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'suggestion' | 'insight' | 'motivation' | 'question';
}

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your AI productivity assistant. How can I help you focus better today?",
      isUser: false,
      timestamp: new Date(),
      type: 'motivation',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(modalTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 300,
          friction: 20,
        }),
      ]).start();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      type: 'question',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        isUser: false,
        timestamp: new Date(),
        type: aiResponse.type,
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const generateAIResponse = (input: string): { text: string; type: AIMessage['type'] } => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('task') || lowerInput.includes('todo')) {
      return {
        text: "I suggest breaking your tasks into 25-minute focused sessions. Prioritize by urgency and impact. Would you like me to help organize your current tasks?",
        type: 'suggestion',
      };
    }
    
    if (lowerInput.includes('focus') || lowerInput.includes('concentration')) {
      return {
        text: "Based on your patterns, you're most productive between 9-11 AM. Try the Pomodoro technique: 25 min work, 5 min break. I can start a timer for you!",
        type: 'insight',
      };
    }
    
    if (lowerInput.includes('motivation') || lowerInput.includes('motivated')) {
      return {
        text: "Remember: 'The secret of getting ahead is getting started.' - Mark Twain. You've completed 5 tasks today - you're on fire! 🔥",
        type: 'motivation',
      };
    }
    
    if (lowerInput.includes('schedule') || lowerInput.includes('time')) {
      return {
        text: "I recommend scheduling your most challenging tasks during your peak hours (9-11 AM). Block 2-hour deep work sessions with 15-minute breaks.",
        type: 'suggestion',
      };
    }
    
    return {
      text: "I'm here to help optimize your productivity! Try asking me about task prioritization, focus techniques, or scheduling advice.",
      type: 'insight',
    };
  };

  const getMessageIcon = (type: AIMessage['type']) => {
    switch (type) {
      case 'suggestion': return 'bulb';
      case 'insight': return 'analytics';
      case 'motivation': return 'heart';
      default: return 'chatbubble';
    }
  };

  const getMessageColor = (type: AIMessage['type']) => {
    switch (type) {
      case 'suggestion': return '#00D4FF';
      case 'insight': return '#40E0D0';
      case 'motivation': return '#FFD700';
      default: return '#FFFFFF';
    }
  };

  const renderMessage = (message: AIMessage) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!message.isUser && (
        <View style={[styles.messageIcon, { backgroundColor: getMessageColor(message.type) }]}>
          <Ionicons name={getMessageIcon(message.type) as any} size={16} color="#000" />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={[
          styles.messageText,
          { color: message.isUser ? '#000' : '#FFF' },
        ]}>
          {message.text}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[
        styles.modalOverlay,
        {
          opacity: modalOpacity,
          transform: [{ translateY: modalTranslateY }],
        }
      ]}>
        <BlurView intensity={20} style={styles.blurContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={24} color="#00D4FF" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>AI Assistant</Text>
                  <Text style={styles.headerSubtitle}>Your productivity companion</Text>
                </View>
              </View>
              <AnimatedButton
                title=""
                onPress={onClose}
                variant="ghost"
                icon="close"
                style={styles.closeButton}
              />
            </View>

            {/* Messages */}
            <ScrollView 
              style={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(renderMessage)}
              {isTyping && (
                <View style={[styles.messageContainer, styles.aiMessage]}>
                  <View style={[styles.messageIcon, { backgroundColor: '#40E0D0' }]}>
                    <Ionicons name="chatbubble" size={16} color="#000" />
                  </View>
                  <View style={[styles.messageBubble, styles.aiBubble]}>
                    <Text style={styles.typingText}>AI is typing...</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask me anything about productivity..."
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <AnimatedButton
                title=""
                onPress={sendMessage}
                variant="primary"
                icon="send"
                disabled={!inputText.trim()}
                style={styles.sendButton}
              />
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  blurContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#00D4FF',
    marginLeft: 'auto',
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  typingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});