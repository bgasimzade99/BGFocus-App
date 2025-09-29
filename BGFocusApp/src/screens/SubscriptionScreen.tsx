import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';

interface SubscriptionScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic focus timer',
        'Up to 5 tasks',
        'Basic analytics',
        'Standard support',
      ],
      limitations: [
        'Limited AI insights',
        'No team collaboration',
        'Basic themes only',
      ],
      color: '#6B7280',
      gradient: ['#6B7280', '#4B5563'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? '$9.99' : '$99.99',
      period: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        'Advanced focus timer',
        'Unlimited tasks',
        'Advanced analytics',
        'AI-powered insights',
        'Custom themes',
        'Priority support',
        'Data export',
      ],
      limitations: [],
      color: '#6366F1',
      gradient: ['#6366F1', '#8B5CF6'],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Advanced reporting',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'On-premise deployment',
      ],
      limitations: [],
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
    },
  ];

  const handleSubscribe = () => {
    Alert.alert(
      'Subscription',
      `You are about to subscribe to the ${plans.find(p => p.id === selectedPlan)?.name} plan.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Subscribe', onPress: () => Alert.alert('Success', 'Subscription activated successfully!') }
      ]
    );
  };

  const currentPlan = plans.find(p => p.id === selectedPlan);

  return (
    <LinearGradient colors={GRADIENTS.background as readonly [string, string]} style={styles.container}>
      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.backButtonGradient}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Subscription</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Choose your plan</Text>
        </View>
        
        <View style={styles.headerRight}>
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.1)']}
            style={styles.headerIconGradient}
          >
            <Ionicons name="diamond" size={20} color="#6366F1" />
          </LinearGradient>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Plan Status */}
        <GlassCard style={styles.statusCard} neumorphism glow>
          <View style={styles.statusHeader}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.statusIconGradient}
            >
              <Ionicons name="diamond" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.statusContent}>
              <Text style={[styles.statusTitle, { color: colors.text }]}>Current Plan</Text>
              <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
                You're currently on the Free plan
              </Text>
            </View>
            <View style={styles.upgradeBadge}>
              <Text style={styles.upgradeBadgeText}>UPGRADE</Text>
            </View>
          </View>
          
          {/* Usage Progress */}
          <View style={styles.usageContainer}>
            <View style={styles.usageHeader}>
              <Text style={[styles.usageTitle, { color: colors.text }]}>Usage This Month</Text>
              <Text style={[styles.usageValue, { color: colors.textSecondary }]}>3/5 tasks</Text>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={[styles.progressFill, { width: '60%' }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
        </GlassCard>

        {/* Billing Cycle Toggle */}
        <GlassCard style={styles.toggleCard} neumorphism>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                billingCycle === 'monthly' && styles.toggleOptionActive
              ]}
              onPress={() => setBillingCycle('monthly')}
            >
              <Text style={[
                styles.toggleText,
                { color: billingCycle === 'monthly' ? '#FFFFFF' : colors.textSecondary }
              ]}>
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                billingCycle === 'yearly' && styles.toggleOptionActive
              ]}
              onPress={() => setBillingCycle('yearly')}
            >
              <Text style={[
                styles.toggleText,
                { color: billingCycle === 'yearly' ? '#FFFFFF' : colors.textSecondary }
              ]}>
                Yearly
              </Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>Save 20%</Text>
              </View>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Pricing Plans */}
        {plans.map((plan) => (
          <GlassCard 
            key={plan.id} 
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
              plan.popular && styles.planCardPopular
            ]} 
            neumorphism
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.planContent}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.8}
            >
              <View style={styles.planHeader}>
                <LinearGradient
                  colors={plan.gradient}
                  style={styles.planIconGradient}
                >
                  <Ionicons name="diamond" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.planInfo}>
                  <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
                  <View style={styles.planPricing}>
                    <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                    <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>
                      /{plan.period}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  { borderColor: plan.color },
                  selectedPlan === plan.id && { backgroundColor: plan.color }
                ]}>
                  {selectedPlan === plan.id && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
              </View>

              <View style={styles.featuresContainer}>
                <Text style={[styles.featuresTitle, { color: colors.text }]}>Features:</Text>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color={plan.color} />
                    <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
                {plan.limitations.map((limitation, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="close-circle" size={16} color="#EF4444" />
                    <Text style={[styles.featureText, { color: colors.textSecondary, opacity: 0.6 }]}>
                      {limitation}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          </GlassCard>
        ))}

        {/* Subscribe Button */}
        <AnimatedButton
          title={`Subscribe to ${currentPlan?.name} Plan`}
          onPress={handleSubscribe}
          variant="primary"
          size="large"
          icon="diamond"
          iconPosition="left"
          style={styles.subscribeButton}
          gradient
        />

        {/* Additional Info */}
        <GlassCard style={styles.infoCard} neumorphism>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color="#6366F1" />
            <Text style={[styles.infoTitle, { color: colors.text }]}>Subscription Details</Text>
          </View>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Cancel anytime with no penalties{'\n'}
            • All plans include 7-day free trial{'\n'}
            • Upgrade or downgrade at any time{'\n'}
            • Secure payment processing
          </Text>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: SPACING.md,
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: 2,
    opacity: 0.8,
  },
  headerRight: {
    marginLeft: SPACING.md,
  },
  headerIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  statusCard: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  statusIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  upgradeBadge: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  upgradeBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  usageContainer: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  usageTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  usageValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  toggleCard: {
    marginBottom: SPACING.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  toggleOptionActive: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  savingsText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  planCard: {
    marginBottom: SPACING.md,
    position: 'relative',
  },
  planCardSelected: {
    borderWidth: 2,
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  planCardPopular: {
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: SPACING.md,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    zIndex: 1,
  },
  popularText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  planContent: {
    padding: SPACING.lg,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  planIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  planPeriod: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginLeft: 4,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresContainer: {
    marginTop: SPACING.md,
  },
  featuresTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginLeft: SPACING.sm,
  },
  subscribeButton: {
    marginBottom: SPACING.lg,
  },
  infoCard: {
    marginBottom: SPACING.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  infoTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 20,
  },
});
