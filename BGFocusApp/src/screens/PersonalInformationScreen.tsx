import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/spacing';
import { GRADIENTS } from '../constants/colors';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';

interface PersonalInformationScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export const PersonalInformationScreen: React.FC<PersonalInformationScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  // Use refs for text inputs to prevent focus issues
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const companyRef = useRef<TextInput>(null);
  const positionRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  
  const [originalData, setOriginalData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc.',
    position: 'Product Manager',
    location: 'San Francisco, CA',
    avatar: 'default',
    profilePhoto: null,
  });
  
  const [formData, setFormData] = useState(originalData);

  // Sync formData with originalData when originalData changes
  useEffect(() => {
    setFormData(originalData);
  }, [originalData]);
  
  // Cartoon character avatars
  const avatars = [
    { id: 'default', name: 'Default', emoji: '👤', color: '#6366F1' },
    { id: 'avatar1', name: 'Professional', emoji: '👨‍💼', color: '#10B981' },
    { id: 'avatar2', name: 'Creative', emoji: '🎨', color: '#EC4899' },
    { id: 'avatar3', name: 'Tech', emoji: '👨‍💻', color: '#F59E0B' },
    { id: 'avatar4', name: 'Business', emoji: '👩‍💼', color: '#8B5CF6' },
    { id: 'avatar5', name: 'Modern', emoji: '🚀', color: '#06B6D4' },
    { id: 'avatar6', name: 'Student', emoji: '🎓', color: '#F97316' },
    { id: 'avatar7', name: 'Artist', emoji: '🎭', color: '#84CC16' },
    { id: 'avatar8', name: 'Gamer', emoji: '🎮', color: '#EF4444' },
  ];

  const handleSave = () => {
    // Create a deep copy to ensure proper state update
    const newData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      position: formData.position,
      location: formData.location,
      avatar: formData.avatar,
      profilePhoto: formData.profilePhoto,
    };
    setOriginalData(newData);
    setIsEditing(false);
    Alert.alert('Success', 'Your personal information has been updated successfully.');
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleAvatarSelect = (avatarId: string) => {
    setFormData(prev => ({...prev, avatar: avatarId}));
    setShowAvatarModal(false);
  };

  const handlePhotoUpload = async () => {
    Alert.alert(
      'Photo Upload', 
      'Photo upload feature will be available soon! For now, you can choose from the cartoon character avatars below.',
      [{ text: 'OK', onPress: () => setShowAvatarModal(false) }]
    );
  };

  const getAvatarDisplay = () => {
    if (formData.profilePhoto) {
      return <Image source={{ uri: formData.profilePhoto }} style={styles.profileImage} />;
    }
    
    const avatar = avatars.find(a => a.id === formData.avatar);
    if (avatar && avatar.id !== 'default') {
      return <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>;
    }
    
    return <Text style={styles.avatarText}>{getAvatarInitials()}</Text>;
  };

  const getAvatarInitials = () => {
    return `${formData.firstName[0]}${formData.lastName[0]}`;
  };

  const getAvatarColor = () => {
    const avatar = avatars.find(a => a.id === formData.avatar);
    return avatar ? avatar.color : '#6366F1';
  };

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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Personal Information</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Manage your profile details</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setIsEditing(!isEditing)} 
          style={styles.editButton}
        >
          <LinearGradient
            colors={isEditing ? ['#EF4444', '#DC2626'] : ['#6366F1', '#8B5CF6']}
            style={styles.editButtonGradient}
          >
            <Ionicons name={isEditing ? "close" : "create"} size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Status Indicator */}
        <GlassCard style={styles.statusCard} neumorphism glow>
          <View style={styles.statusHeader}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.statusIconGradient}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.statusContent}>
              <Text style={[styles.statusTitle, { color: colors.text }]}>Profile Status</Text>
              <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
                {isEditing ? 'Editing Mode Active' : 'Profile Complete - 100%'}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{isEditing ? 'EDIT' : 'COMPLETE'}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Profile Header */}
        <GlassCard style={styles.profileCard} neumorphism glow>
          <View style={styles.profileHeader}>
            <TouchableOpacity 
              onPress={() => setShowAvatarModal(true)}
              style={styles.avatarContainer}
              disabled={!isEditing}
            >
              <LinearGradient
                colors={[getAvatarColor(), `${getAvatarColor()}CC`]}
                style={styles.avatarGradient}
              >
                {getAvatarDisplay()}
              </LinearGradient>
              {isEditing && (
                <View style={styles.avatarEditBadge}>
                  <Ionicons name="camera" size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {formData.firstName} {formData.lastName}
              </Text>
              <Text style={[styles.profilePosition, { color: colors.textSecondary }]}>
                {formData.position}
              </Text>
              <Text style={[styles.profileCompany, { color: colors.textSecondary }]}>
                {formData.company}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Personal Details Form */}
        <GlassCard style={styles.formCard} neumorphism>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionTitleGradient}
            >
              <Text style={styles.sectionTitle}>Personal Details</Text>
            </LinearGradient>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>First Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                ref={firstNameRef}
                style={[styles.input, { color: colors.text }]}
                value={formData.firstName}
                onChangeText={(text) => setFormData(prev => ({...prev, firstName: text}))}
                editable={isEditing}
                placeholder="Enter first name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Last Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                ref={lastNameRef}
                style={[styles.input, { color: colors.text }]}
                value={formData.lastName}
                onChangeText={(text) => setFormData(prev => ({...prev, lastName: text}))}
                editable={isEditing}
                placeholder="Enter last name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                ref={emailRef}
                style={[styles.input, { color: colors.text }]}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
                editable={isEditing}
                placeholder="Enter email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                ref={phoneRef}
                style={[styles.input, { color: colors.text }]}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({...prev, phone: text}))}
                editable={isEditing}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
          </View>
        </GlassCard>

        {/* Professional Information */}
        <GlassCard style={styles.formCard} neumorphism>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#EC4899', '#BE185D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionTitleGradient}
            >
              <Text style={styles.sectionTitle}>Professional Information</Text>
            </LinearGradient>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Company</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="business" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                ref={companyRef}
                style={[styles.input, { color: colors.text }]}
                value={formData.company}
                onChangeText={(text) => setFormData(prev => ({...prev, company: text}))}
                editable={isEditing}
                placeholder="Enter company name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Position</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="briefcase" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                ref={positionRef}
                style={[styles.input, { color: colors.text }]}
                value={formData.position}
                onChangeText={(text) => setFormData(prev => ({...prev, position: text}))}
                editable={isEditing}
                placeholder="Enter your position"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Location</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                ref={locationRef}
                style={[styles.input, { color: colors.text }]}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({...prev, location: text}))}
                editable={isEditing}
                placeholder="Enter your location"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View>
          </View>
        </GlassCard>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <AnimatedButton
              title="Cancel"
              onPress={handleCancel}
              variant="ghost"
              style={styles.actionButton}
            />
            <AnimatedButton
              title="Save Changes"
              onPress={handleSave}
              variant="primary"
              style={styles.actionButton}
            />
          </View>
        )}
      </ScrollView>

      {/* Avatar Selection Modal */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Avatar</Text>
              <TouchableOpacity 
                onPress={() => setShowAvatarModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            {/* Photo Upload Option */}
            <TouchableOpacity
              style={styles.uploadOption}
              onPress={handlePhotoUpload}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.uploadGradient}
              >
                <Ionicons name="camera" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.uploadText, { color: colors.text }]}>Upload Photo</Text>
            </TouchableOpacity>
            
            <View style={styles.avatarGrid}>
              {avatars.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={styles.avatarOption}
                  onPress={() => handleAvatarSelect(avatar.id)}
                >
                  <LinearGradient
                    colors={[avatar.color, `${avatar.color}CC`]}
                    style={[
                      styles.avatarOptionGradient,
                      formData.avatar === avatar.id && styles.avatarOptionSelected
                    ]}
                  >
                    <Text style={styles.avatarEmoji}>
                      {avatar.id === 'default' ? getAvatarInitials() : avatar.emoji}
                    </Text>
                  </LinearGradient>
                  <Text style={[styles.avatarOptionName, { color: colors.textSecondary }]}>
                    {avatar.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
  editButton: {
    marginLeft: SPACING.md,
  },
  editButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  statusBadge: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  profileCard: {
    marginBottom: SPACING.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.lg,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  profilePosition: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: 2,
  },
  profileCompany: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
  },
  formCard: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    marginBottom: SPACING.lg,
  },
  sectionTitleGradient: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 20,
    padding: SPACING.lg,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  modalCloseButton: {
    padding: SPACING.sm,
  },
  uploadOption: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  uploadGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  uploadText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    alignItems: 'center',
    width: '30%',
    marginBottom: SPACING.lg,
  },
  avatarOptionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarOptionText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  avatarOptionName: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    textAlign: 'center',
  },
});
